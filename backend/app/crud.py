"""Общие операции создания и чтения; изменение и удаление добавим позднее."""

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session


def get_by_id(db: Session, model, record_id: int):
    return db.get(model, record_id)


def create(db: Session, model, data: dict):
    record = model(**data)
    db.add(record)
    try:
        db.commit()
        db.refresh(record)
    except SQLAlchemyError:
        db.rollback()
        raise
    return record
