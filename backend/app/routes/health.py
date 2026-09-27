from fastapi import APIRouter

from app.schemas import HealthResponse

router = APIRouter(tags=["Проверка работы"])


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    """Проверяет, что API запущен. Подключение к БД не проверяется."""
    return HealthResponse(status="ok")
