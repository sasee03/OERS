from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from repositories.exam_repository import (
    create_exam, get_exam_by_id, get_all_exams,
    search_exams, update_exam, delete_exam,
    get_active_exams, get_scheduled_exams,
    get_active_exams_for_student, get_scheduled_exams_for_student,
    search_exams_for_student,
)
from schemas.exam_schema import ExamCreate, ExamUpdate


def service_create_exam(db: Session, data: ExamCreate,
                         admin_id: int):
    if data.end_time <= data.start_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="end_time must be after start_time",
        )
    return create_exam(
        db,
        title=data.title,
        total_questions=data.total_questions,
        start_time=data.start_time,
        end_time=data.end_time,
        created_by=admin_id,
        duration_minutes=data.duration_minutes,
    )


def service_get_all_exams(db: Session):
    return get_all_exams(db)


def service_get_exam(db: Session, exam_id: int):
    exam = get_exam_by_id(db, exam_id)
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found",
        )
    return exam


def service_update_exam(db: Session, exam_id: int, data: ExamUpdate):
    exam = service_get_exam(db, exam_id)
    return update_exam(db, exam, **data.model_dump(exclude_none=True))


def service_delete_exam(db: Session, exam_id: int):
    exam = service_get_exam(db, exam_id)
    delete_exam(db, exam)


def service_search_exams(db: Session, query: str):
    return search_exams(db, query)


def service_get_active_exams(db: Session):
    return get_active_exams(db)


def service_get_scheduled_exams(db: Session):
    return get_scheduled_exams(db)


def service_get_active_exams_for_student(db: Session, student_email: str):
    return get_active_exams_for_student(db, student_email)


def service_get_scheduled_exams_for_student(db: Session, student_email: str):
    return get_scheduled_exams_for_student(db, student_email)


def service_search_exams_for_student(db: Session, query: str, student_email: str):
    return search_exams_for_student(db, query, student_email)
