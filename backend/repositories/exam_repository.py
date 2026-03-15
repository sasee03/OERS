from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime
from models.exam_model import Exam


def create_exam(db: Session, title: str, total_questions: int,
                start_time: datetime, end_time: datetime,
                created_by: int) -> Exam:
    exam = Exam(title=title, total_questions=total_questions,
                start_time=start_time, end_time=end_time,
                created_by=created_by)
    db.add(exam)
    db.commit()
    db.refresh(exam)
    return exam


def get_exam_by_id(db: Session, exam_id: int) -> Exam | None:
    return db.query(Exam).filter(Exam.id == exam_id).first()


def get_all_exams(db: Session) -> list[Exam]:
    return db.query(Exam).order_by(Exam.created_at.desc()).all()


def search_exams(db: Session, query: str) -> list[Exam]:
    return db.query(Exam).filter(
        Exam.title.ilike(f"%{query}%")
    ).all()


def update_exam(db: Session, exam: Exam, **kwargs) -> Exam:
    for key, val in kwargs.items():
        if val is not None:
            setattr(exam, key, val)
    db.commit()
    db.refresh(exam)
    return exam


def delete_exam(db: Session, exam: Exam) -> None:
    db.delete(exam)
    db.commit()


def get_active_exams(db: Session) -> list[Exam]:
    now = datetime.utcnow()
    return db.query(Exam).filter(
        Exam.is_active == True,
        Exam.start_time <= now,
        Exam.end_time >= now
    ).all()


def get_scheduled_exams(db: Session) -> list[Exam]:
    now = datetime.utcnow()
    return db.query(Exam).filter(
        Exam.is_active == True,
        Exam.start_time > now
    ).all()
