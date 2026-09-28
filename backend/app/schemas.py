from datetime import date
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator


PositiveInt = Annotated[int, Field(strict=True, gt=0, le=2147483647)]
ReservationStatus = Literal["reserved", "borrowed", "returned", "cancelled"]


class RequestSchema(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class UserCreate(RequestSchema):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr = Field(max_length=255)


class UserUpdate(UserCreate):
    """Полное изменение пользователя (для будущего PUT)."""


class UserRead(UserCreate):
    model_config = ConfigDict(from_attributes=True)
    id: PositiveInt


class PickupLocationCreate(RequestSchema):
    name: str = Field(min_length=1, max_length=200)
    address: str = Field(min_length=1, max_length=300)
    hours: str = Field(min_length=1, max_length=200)
    description: str = ""


class PickupLocationUpdate(PickupLocationCreate):
    """Полное изменение пункта выдачи (для будущего PUT)."""


class PickupLocationRead(PickupLocationCreate):
    model_config = ConfigDict(from_attributes=True)
    id: PositiveInt


class BookCreate(RequestSchema):
    title: str = Field(min_length=1, max_length=255)
    author: str = Field(min_length=1, max_length=255)
    genre: str = Field(min_length=1, max_length=100)
    year: PositiveInt
    pages: PositiveInt
    description: str = ""
    location_id: PositiveInt


class BookUpdate(BookCreate):
    """Полное изменение книги (для будущего PUT)."""


class BookRead(BookCreate):
    model_config = ConfigDict(from_attributes=True)
    id: PositiveInt


class ReservationCreate(RequestSchema):
    book_id: PositiveInt
    user_id: PositiveInt
    status: ReservationStatus = "reserved"
    reserved_at: date = Field(default_factory=date.today)
    due_at: date

    @model_validator(mode="after")
    def check_dates(self):
        if self.due_at < self.reserved_at:
            raise ValueError("Срок возврата не может быть раньше даты бронирования.")
        return self


class ReservationUpdate(ReservationCreate):
    """Полное изменение бронирования (для будущего PUT)."""

    status: ReservationStatus
    reserved_at: date


class ReservationRead(ReservationCreate):
    model_config = ConfigDict(from_attributes=True)
    id: PositiveInt


class FieldError(BaseModel):
    field: str
    message: str


class ErrorResponse(BaseModel):
    detail: str
    errors: list[FieldError] = Field(default_factory=list)


class HealthResponse(BaseModel):
    status: Literal["ok"]
