from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from models.exam_model import Exam
from models.assignment_model import ExamAssignment


def create_exam(db: Session, title: str, total_questions: int,
                start_time: datetime, end_time: datetime,
                created_by: int, duration_minutes: int = 60) -> Exam:
    exam = Exam(title=title, total_questions=total_questions,
                start_time=start_time, end_time=end_time,
                created_by=created_by, duration_minutes=duration_minutes)
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
    now = func.now()
    return db.query(Exam).filter(
        Exam.is_active == True,
        Exam.start_time <= now,
        Exam.end_time >= now
    ).all()


def get_scheduled_exams(db: Session) -> list[Exam]:
    now = func.now()
    return db.query(Exam).filter(
        Exam.is_active == True,
        Exam.start_time > now
    ).all()


def get_active_exams_for_student(db: Session, student_email: str) -> list[Exam]:
    now = func.now()
    return (
        db.query(Exam)
        .join(ExamAssignment, Exam.id == ExamAssignment.exam_id)
        .filter(
            Exam.is_active == True,
            Exam.start_time <= now,
            Exam.end_time >= now,
            ExamAssignment.student_email == student_email,
        )
        .distinct()
        .all()
    )


def get_scheduled_exams_for_student(db: Session, student_email: str) -> list[Exam]:
    now = func.now()
    return (
        db.query(Exam)
        .join(ExamAssignment, Exam.id == ExamAssignment.exam_id)
        .filter(
            Exam.is_active == True,
            Exam.start_time > now,
            ExamAssignment.student_email == student_email,
        )
        .distinct()
        .all()
    )


def search_exams_for_student(db: Session, query: str, student_email: str) -> list[Exam]:
    return (
        db.query(Exam)
        .join(ExamAssignment, Exam.id == ExamAssignment.exam_id)
        .filter(
            Exam.title.ilike(f"%{query}%"),
            ExamAssignment.student_email == student_email,
        )
        .distinct()
        .all()
    )
