from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError, ResponseValidationError
from sqlalchemy.exc import SQLAlchemyError
from starlette.exceptions import HTTPException

from app.config import settings
from app.errors import (
    database_error_handler, http_error_handler,
    response_error_handler, validation_error_handler,
)
from app.routes.health import router as health_router
from app.routes.records import router as records_router

app = FastAPI(title=settings.app_name)
app.add_exception_handler(RequestValidationError, validation_error_handler)
app.add_exception_handler(HTTPException, http_error_handler)
app.add_exception_handler(SQLAlchemyError, database_error_handler)
app.add_exception_handler(ResponseValidationError, response_error_handler)
app.include_router(health_router, prefix="/api")
app.include_router(records_router, prefix="/api")
