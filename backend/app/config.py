from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "BookSwap API"
    database_url: str = (
        "postgresql+psycopg://postgres:postgres@localhost:5432/bookswap"
    )

    # Путь к .env не зависит от папки, из которой запущен Python.
    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parent.parent / ".env",
        env_file_encoding="utf-8",
    )


settings = Settings()
