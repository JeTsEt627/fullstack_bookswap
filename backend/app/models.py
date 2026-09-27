from __future__ import annotations

from datetime import date

from sqlalchemy import CheckConstraint, Date, ForeignKey, Index, String, Text, func, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    """Общая основа моделей SQLAlchemy."""


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255), unique=True)

    reservations: Mapped[list[Reservation]] = relationship(
        back_populates="user", passive_deletes="all"
    )


class PickupLocation(Base):
    __tablename__ = "pickup_locations"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    address: Mapped[str] = mapped_column(String(300))
    hours: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text, default="", server_default="")

    books: Mapped[list[Book]] = relationship(
        back_populates="location", passive_deletes="all"
    )


class Book(Base):
    __tablename__ = "books"
    __table_args__ = (
        CheckConstraint("year > 0", name="ck_books_year_positive"),
        CheckConstraint("pages > 0", name="ck_books_pages_positive"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    author: Mapped[str] = mapped_column(String(255))
    genre: Mapped[str] = mapped_column(String(100))
    year: Mapped[int]
    pages: Mapped[int]
    description: Mapped[str] = mapped_column(Text, default="", server_default="")
    location_id: Mapped[int] = mapped_column(
        ForeignKey("pickup_locations.id", ondelete="RESTRICT"), index=True
    )

    location: Mapped[PickupLocation] = relationship(back_populates="books")
    reservations: Mapped[list[Reservation]] = relationship(
        back_populates="book", passive_deletes="all"
    )


class Reservation(Base):
    __tablename__ = "reservations"
    __table_args__ = (
        CheckConstraint(
            "status IN ('reserved', 'borrowed', 'returned', 'cancelled')",
            name="ck_reservations_status",
        ),
        CheckConstraint(
            "due_at >= reserved_at", name="ck_reservations_dates"
        ),
        # Завершённые бронирования сохраняются, но активное у книги только одно.
        Index(
            "uq_reservations_active_book",
            "book_id",
            unique=True,
            postgresql_where=text("status IN ('reserved', 'borrowed')"),
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    book_id: Mapped[int] = mapped_column(
        ForeignKey("books.id", ondelete="RESTRICT"), index=True
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"), index=True
    )
    status: Mapped[str] = mapped_column(
        String(20), default="reserved", server_default="reserved"
    )
    reserved_at: Mapped[date] = mapped_column(Date, server_default=func.current_date())
    due_at: Mapped[date] = mapped_column(Date)

    book: Mapped[Book] = relationship(back_populates="reservations")
    user: Mapped[User] = relationship(back_populates="reservations")
