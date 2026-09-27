"""Проверка подключения: python -m app.check_db из папки backend."""

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.database import SessionLocal, engine


def main() -> None:
    try:
        with SessionLocal() as session:
            result = session.execute(text("SELECT 1")).scalar_one()
        if result != 1:
            raise SystemExit("PostgreSQL вернула неожиданный ответ.")
        print("Подключение к PostgreSQL работает: SELECT 1 = 1")
    except SQLAlchemyError:
        # Не выводим строку подключения и учётные данные.
        raise SystemExit(
            "Не удалось подключиться к PostgreSQL. "
            "Проверьте запуск сервера и параметры DB_* в .env."
        ) from None
    finally:
        engine.dispose()


if __name__ == "__main__":
    main()
