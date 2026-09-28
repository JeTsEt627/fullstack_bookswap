"""Проверки API на PostgreSQL. Тестовые изменения откатываются."""

import unittest
from unittest.mock import patch
from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError, OperationalError
from sqlalchemy.orm import Session

from app.database import engine, get_db
from app.main import app
from app.models import Book, PickupLocation, Reservation, User


class ApiTests(unittest.TestCase):
    @classmethod
    def tearDownClass(cls):
        engine.dispose()

    def setUp(self):
        self.connection = engine.connect()
        self.transaction = self.connection.begin()
        # Даже commit() внутри маршрута остаётся в тестовой транзакции.
        self.session = Session(
            bind=self.connection, join_transaction_mode="create_savepoint"
        )

        def test_db():
            yield self.session

        app.dependency_overrides[get_db] = test_db
        self.client = TestClient(app)

    def tearDown(self):
        self.client.close()
        app.dependency_overrides.clear()
        self.session.close()
        self.transaction.rollback()
        self.connection.close()

    def create(self, resource, data):
        response = self.client.post(f"/api/{resource}", json=data)
        self.assertEqual(response.status_code, 201, response.text)
        return response.json()

    def fixtures(self):
        user = self.create("users", {
            "name": "Анна", "email": f"api-test-{uuid4().hex}@example.com",
        })
        location = self.create("locations", {
            "name": "Библиотека", "address": "Улица Книжная, 1", "hours": "10:00–18:00",
        })
        book = self.create("books", {
            "title": "Книга", "author": "Автор", "genre": "Проза",
            "year": 2020, "pages": 100, "location_id": location["id"],
        })
        return user, location, book

    def reservation_data(self, user, book):
        return {
            "user_id": user["id"], "book_id": book["id"],
            "reserved_at": "2026-09-28", "due_at": "2026-10-12",
        }

    def test_create_and_read_all_entities(self):
        user, location, book = self.fixtures()
        reservation = self.create("reservations", self.reservation_data(user, book))
        self.assertEqual(reservation["status"], "reserved")
        self.assertEqual(book["description"], "")
        for resource, record in (
            ("users", user), ("locations", location),
            ("books", book), ("reservations", reservation),
        ):
            response = self.client.get(f"/api/{resource}/{record['id']}")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json(), record)

    def test_invalid_request_data(self):
        book = {
            "title": "Книга", "author": "Автор", "genre": "Проза",
            "year": 2020, "pages": 100, "location_id": 1,
        }
        reservation = self.reservation_data({"id": 1}, {"id": 1})
        cases = [
            ("users", {}, "body.name"),
            ("users", {"name": "Анна", "email": "wrong"}, "body.email"),
            ("users", {"name": "   ", "email": "a@example.com"}, "body.name"),
            ("users", {"name": "A" * 101, "email": "a@example.com"}, "body.name"),
            ("users", {"name": "Анна", "email": "a@example.com", "admin": True}, "body.admin"),
            ("locations", {"name": "Пункт", "address": " ", "hours": "10–18"}, "body.address"),
            ("books", {**book, "pages": 0}, "body.pages"),
            ("books", {**book, "pages": True}, "body.pages"),
            ("books", {**book, "year": "2020"}, "body.year"),
            ("books", {**book, "location_id": 2147483648}, "body.location_id"),
            ("books", {**book, "title": None}, "body.title"),
            ("reservations", {**reservation, "status": "unknown"}, "body.status"),
            ("reservations", {**reservation, "due_at": "not-a-date"}, "body.due_at"),
            ("reservations", {**reservation, "due_at": "2026-09-01"}, "body"),
        ]
        for resource, data, field in cases:
            with self.subTest(resource=resource, field=field, data=data):
                response = self.client.post(f"/api/{resource}", json=data)
                self.assertEqual(response.status_code, 422, response.text)
                errors = response.json()["errors"]
                self.assertIn(field, [error["field"] for error in errors])
                self.assertTrue(all(error["message"] for error in errors))
                self.assertNotIn("input", response.json())

    def test_missing_records_and_foreign_keys(self):
        for resource in ("users", "locations", "books", "reservations"):
            response = self.client.get(f"/api/{resource}/2147483647")
            self.assertEqual(response.status_code, 404, response.text)
        response = self.client.post("/api/books", json={
            "title": "Книга", "author": "Автор", "genre": "Проза",
            "year": 2020, "pages": 100, "location_id": 2147483647,
        })
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()["detail"], "Пункт выдачи не найден.")
        user, _, book = self.fixtures()
        for field in ("user_id", "book_id"):
            data = {**self.reservation_data(user, book), field: 2147483647}
            response = self.client.post("/api/reservations", json=data)
            self.assertEqual(response.status_code, 404, response.text)

    def test_conflicts_and_session_recovery(self):
        user, _, book = self.fixtures()
        response = self.client.post("/api/users", json={
            "name": "Другая Анна", "email": user["email"],
        })
        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.json()["detail"], "Пользователь с такой почтой уже существует.")
        data = self.reservation_data(user, book)
        self.create("reservations", data)
        response = self.client.post("/api/reservations", json=data)
        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.json()["detail"], "Книга уже забронирована или выдана.")
        response = self.client.get(f"/api/books/{book['id']}")
        self.assertEqual(response.status_code, 200)

    def test_relationships_loaded_from_database(self):
        user, location, book = self.fixtures()
        reservation = self.create("reservations", self.reservation_data(user, book))
        self.session.expunge_all()
        stored = self.session.get(Reservation, reservation["id"])
        self.assertEqual(stored.user.id, user["id"])
        self.assertEqual(stored.book.id, book["id"])
        self.assertEqual(stored.book.location.id, location["id"])
        self.assertIn(stored, stored.user.reservations)
        self.assertIn(stored, stored.book.reservations)
        self.assertIn(stored.book, stored.book.location.books)

    def test_history_does_not_prevent_new_reservation(self):
        user, _, book = self.fixtures()
        data = self.reservation_data(user, book)
        for status in ("returned", "cancelled", "reserved"):
            self.create("reservations", {**data, "status": status})
        response = self.client.post("/api/reservations", json={**data, "status": "borrowed"})
        self.assertEqual(response.status_code, 409)
        stored = self.session.scalars(
            select(Reservation).where(Reservation.book_id == book["id"])
        ).all()
        self.assertCountEqual([row.status for row in stored], ["returned", "cancelled", "reserved"])

    def test_database_restricts_deletion_of_related_records(self):
        user, location, book = self.fixtures()
        reservation = self.create("reservations", self.reservation_data(user, book))
        # DELETE-маршрутов пока нет: проверяем защиту внешними ключами напрямую.
        for model, record in ((User, user), (PickupLocation, location), (Book, book)):
            with self.subTest(table=model.__tablename__):
                with self.assertRaises(IntegrityError) as error:
                    with self.session.begin_nested():
                        self.session.execute(delete(model).where(model.id == record["id"]))
                self.assertEqual(error.exception.orig.sqlstate, "23503")
                self.assertIsNotNone(self.session.get(model, record["id"]))
        self.assertIsNotNone(self.session.get(Reservation, reservation["id"]))

    def test_routing_json_and_openapi(self):
        self.assertEqual(self.client.get("/api/unknown").status_code, 404)
        response = self.client.delete("/api/users/1")
        self.assertEqual(response.status_code, 405)
        self.assertIn("GET", response.headers["allow"])
        for identifier in ("abc", "0", "-1", "2147483648"):
            self.assertEqual(self.client.get(f"/api/books/{identifier}").status_code, 422)
        response = self.client.post("/api/users", content="{", headers={"Content-Type": "application/json"})
        self.assertEqual(response.status_code, 422)
        self.assertEqual(response.json()["errors"][0]["message"], "Некорректный JSON.")
        specification = self.client.get("/openapi.json").json()
        schema = specification["paths"]["/api/books"]["post"]["responses"]["422"]["content"]["application/json"]["schema"]
        self.assertEqual(schema["$ref"], "#/components/schemas/ErrorResponse")

    def test_server_errors_hide_internal_details(self):
        with patch("app.crud.get_by_id", side_effect=OperationalError("SELECT secret", {}, Exception("private"))):
            response = self.client.get("/api/books/1")
        self.assertEqual(response.status_code, 503)
        self.assertNotIn("secret", response.text)
        self.assertNotIn("private", response.text)
        with patch("app.services.get_record", return_value={"id": 1}):
            response = self.client.get("/api/books/1")
        self.assertEqual(response.status_code, 500)


if __name__ == "__main__":
    unittest.main()
