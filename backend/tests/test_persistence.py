"""Проверка настоящего commit через API. Удаляются только записи этого теста."""

import unittest
from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy import delete, func, select

from app.database import SessionLocal, engine, get_db
from app.main import app
from app.models import Book, PickupLocation, Reservation, User


class PersistenceTests(unittest.TestCase):
    @classmethod
    def tearDownClass(cls):
        engine.dispose()

    def setUp(self):
        self.assertNotIn(get_db, app.dependency_overrides)
        self.created = []
        self.addCleanup(self.remove_test_records)

    def remove_test_records(self):
        # Обратный порядок: сначала бронирования, затем книги и их родители.
        with SessionLocal() as db:
            for model, record_id in reversed(self.created):
                db.execute(delete(model).where(model.id == record_id))
            db.commit()
        with SessionLocal() as db:
            for model, record_id in self.created:
                self.assertIsNone(db.get(model, record_id))

    def create(self, client, resource, model, data):
        response = client.post(f"/api/{resource}", json=data)
        self.assertEqual(response.status_code, 201, response.text)
        record = response.json()
        self.created.append((model, record["id"]))
        return record

    def test_committed_data_survives_new_sessions_and_client(self):
        marker = uuid4().hex
        with TestClient(app) as client:
            user = self.create(client, "users", User, {
                "name": "Проверка сохранения", "email": f"persistence-{marker}@example.com",
            })
            location = self.create(client, "locations", PickupLocation, {
                "name": f"Тестовый пункт {marker}", "address": "Тестовый адрес", "hours": "10–18",
            })
            book = self.create(client, "books", Book, {
                "title": f"Тестовая книга {marker}", "author": "Автор", "genre": "Проза",
                "year": 2020, "pages": 100, "location_id": location["id"],
            })
            data = {
                "user_id": user["id"], "book_id": book["id"],
                "reserved_at": "2026-09-28", "due_at": "2026-10-12",
            }
            reservation = self.create(client, "reservations", Reservation, data)

            # Ошибки не должны сохранять дополнительные или несвязанные строки.
            response = client.post("/api/reservations", json=data)
            self.assertEqual(response.status_code, 409)
            response = client.post("/api/reservations", json={**data, "book_id": 2147483647})
            self.assertEqual(response.status_code, 404)
            response = client.post("/api/reservations", json={**data, "due_at": "2026-09-01"})
            self.assertEqual(response.status_code, 422)

        # Закрываем пул: следующие чтения используют новые соединения PostgreSQL.
        engine.dispose()
        with SessionLocal() as db:
            row = db.execute(
                select(Reservation.id, User.email, Book.title, PickupLocation.name)
                .select_from(Reservation)
                .join(User, Reservation.user_id == User.id)
                .join(Book, Reservation.book_id == Book.id)
                .join(PickupLocation, Book.location_id == PickupLocation.id)
                .where(Reservation.id == reservation["id"])
            ).one()
            self.assertEqual(tuple(row), (
                reservation["id"], user["email"], book["title"], location["name"],
            ))
            count = db.scalar(
                select(func.count()).select_from(Reservation)
                .where(Reservation.user_id == user["id"])
            )
            self.assertEqual(count, 1)

        with TestClient(app) as client:
            for resource, record in (
                ("users", user), ("locations", location),
                ("books", book), ("reservations", reservation),
            ):
                response = client.get(f"/api/{resource}/{record['id']}")
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.json(), record)


if __name__ == "__main__":
    unittest.main()
