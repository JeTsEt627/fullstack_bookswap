from fastapi import Request
from fastapi.exceptions import RequestValidationError, ResponseValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError, OperationalError, SQLAlchemyError
from starlette.exceptions import HTTPException

from app.schemas import ErrorResponse, FieldError


def error_response(status_code: int, detail: str, errors=None, headers=None):
    content = ErrorResponse(detail=detail, errors=errors or [])
    return JSONResponse(
        status_code=status_code, content=content.model_dump(), headers=headers
    )


def validation_message(error: dict) -> str:
    kind = error["type"]
    context = error.get("ctx", {})
    messages = {
        "missing": "Обязательное поле.",
        "extra_forbidden": "Неизвестное поле.",
        "string_type": "Ожидается строка.",
        "int_type": "Ожидается целое число.",
        "int_parsing": "Ожидается целое число.",
        "int_from_float": "Ожидается целое число без дробной части.",
        "json_invalid": "Некорректный JSON.",
        "model_attributes_type": "Ожидается JSON-объект.",
        "date_type": "Ожидается дата в формате ГГГГ-ММ-ДД.",
        "date_parsing": "Ожидается корректная дата в формате ГГГГ-ММ-ДД.",
        "date_from_datetime_parsing": "Ожидается корректная дата в формате ГГГГ-ММ-ДД.",
        "date_from_datetime_inexact": "Укажите дату без времени: ГГГГ-ММ-ДД.",
    }
    if kind in messages:
        return messages[kind]
    if kind == "string_too_short":
        return f"Минимальная длина — {context['min_length']} символов."
    if kind in ("string_too_long", "too_long"):
        return f"Максимальная длина — {context['max_length']} символов."
    if kind == "greater_than":
        return f"Значение должно быть больше {context['gt']}."
    if kind == "less_than_equal":
        return f"Значение должно быть не больше {context['le']}."
    if kind == "literal_error":
        return f"Допустимые значения: {context['expected']}."
    if kind == "value_error":
        if error["loc"] and error["loc"][-1] == "email":
            return "Укажите корректный адрес электронной почты."
        return str(context.get("error", "Некорректное значение."))
    return "Некорректное значение."


async def validation_error_handler(request: Request, exc: RequestValidationError):
    errors = [
        FieldError(
            field=".".join(str(part) for part in error["loc"]),
            message=validation_message(error),
        )
        for error in exc.errors()
    ]
    return error_response(422, "Некорректные данные запроса.", errors)


async def http_error_handler(request: Request, exc: HTTPException):
    detail = {"Not Found": "Маршрут не найден.", "Method Not Allowed": "Метод не поддерживается."}.get(
        str(exc.detail), str(exc.detail)
    )
    return error_response(exc.status_code, detail, headers=exc.headers)


async def database_error_handler(request: Request, exc: SQLAlchemyError):
    if isinstance(exc, IntegrityError):
        constraint = getattr(getattr(exc.orig, "diag", None), "constraint_name", None)
        detail = {
            "users_email_key": "Пользователь с такой почтой уже существует.",
            "uq_reservations_active_book": "Книга уже забронирована или выдана.",
        }.get(constraint, "Изменение нарушает ограничения или связи данных.")
        return error_response(409, detail)
    if isinstance(exc, OperationalError):
        return error_response(503, "База данных временно недоступна.")
    return error_response(500, "Не удалось выполнить операцию с данными.")


async def response_error_handler(request: Request, exc: ResponseValidationError):
    return error_response(500, "Не удалось сформировать ответ сервера.")


# Один формат ошибок в Swagger и в ответах API.
ERROR_RESPONSES = {
    code: {"model": ErrorResponse, "description": description}
    for code, description in {
        404: "Запись или связанный объект не найдены",
        409: "Конфликт данных",
        422: "Некорректные данные запроса",
        500: "Ошибка сервера",
        503: "База данных недоступна",
    }.items()
}
