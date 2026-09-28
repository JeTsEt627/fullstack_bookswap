"""Проверка существования записей и связанных объектов."""

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app import crud
from app.models import Book, PickupLocation, Reservation, User


def get_record(db: Session, model, record_id: int):
    record = crud.get_by_id(db, model, record_id)
    if record is None:
        message = {
            User: "Пользователь не найден.",
            PickupLocation: "Пункт выдачи не найден.",
            Book: "Книга не найдена.",
            Reservation: "Бронирование не найдено.",
        }[model]
        raise HTTPException(status_code=404, detail=message)
    return record


def create_book(db: Session, data: dict):
    get_record(db, PickupLocation, data["location_id"])
    return crud.create(db, Book, data)


def create_reservation(db: Session, data: dict):
    get_record(db, User, data["user_id"])
    get_record(db, Book, data["book_id"])
    return crud.create(db, Reservation, data)
