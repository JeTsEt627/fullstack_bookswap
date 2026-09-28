from typing import Annotated

from fastapi import APIRouter, Depends, Path
from sqlalchemy.orm import Session

from app import crud, services
from app.database import get_db
from app.errors import ERROR_RESPONSES
from app.models import Book, PickupLocation, Reservation, User
from app.schemas import (
    BookCreate, BookRead, PickupLocationCreate, PickupLocationRead,
    ReservationCreate, ReservationRead, UserCreate, UserRead,
)

router = APIRouter(responses=ERROR_RESPONSES)
Database = Annotated[Session, Depends(get_db)]
RecordId = Annotated[int, Path(gt=0, le=2147483647)]


@router.post("/users", response_model=UserRead, status_code=201, tags=["Пользователи"])
def create_user(data: UserCreate, db: Database):
    return crud.create(db, User, data.model_dump())


@router.get("/users/{record_id}", response_model=UserRead, tags=["Пользователи"])
def get_user(record_id: RecordId, db: Database):
    return services.get_record(db, User, record_id)


@router.post("/locations", response_model=PickupLocationRead, status_code=201, tags=["Пункты выдачи"])
def create_location(data: PickupLocationCreate, db: Database):
    return crud.create(db, PickupLocation, data.model_dump())


@router.get("/locations/{record_id}", response_model=PickupLocationRead, tags=["Пункты выдачи"])
def get_location(record_id: RecordId, db: Database):
    return services.get_record(db, PickupLocation, record_id)


@router.post("/books", response_model=BookRead, status_code=201, tags=["Книги"])
def create_book(data: BookCreate, db: Database):
    return services.create_book(db, data.model_dump())


@router.get("/books/{record_id}", response_model=BookRead, tags=["Книги"])
def get_book(record_id: RecordId, db: Database):
    return services.get_record(db, Book, record_id)


@router.post("/reservations", response_model=ReservationRead, status_code=201, tags=["Бронирования"])
def create_reservation(data: ReservationCreate, db: Database):
    return services.create_reservation(db, data.model_dump())


@router.get("/reservations/{record_id}", response_model=ReservationRead, tags=["Бронирования"])
def get_reservation(record_id: RecordId, db: Database):
    return services.get_record(db, Reservation, record_id)
