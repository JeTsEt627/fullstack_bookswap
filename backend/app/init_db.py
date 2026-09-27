"""Создание таблиц: python -m app.init_db из папки backend."""

from app.database import engine
from app.models import Base


def main() -> None:
    try:
        Base.metadata.create_all(bind=engine)
        print("Таблицы BookSwap созданы: users, pickup_locations, books, reservations")
    finally:
        engine.dispose()


if __name__ == "__main__":
    main()
