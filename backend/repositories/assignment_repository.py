from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models.assignment_model import ExamAssignment


def assign_students(db: Session, exam_id: int,
                    student_emails: list[str]) -> list[dict]:
    results = []
    for email in student_emails:
        assignment = ExamAssignment(exam_id=exam_id, student_email=email)
        db.add(assignment)
        try:
            db.commit()
            db.refresh(assignment)
            results.append({"email": email, "status": "assigned"})
        except IntegrityError:
            db.rollback()
            results.append({"email": email, "status": "already assigned"})
    return results


def get_assignments_by_exam(db: Session,exam_id: int) -> list[ExamAssignment]:
    return (
        db.query(ExamAssignment)
        .filter(ExamAssignment.exam_id == exam_id)
        .all()
    )


def is_student_assigned(db: Session, exam_id: int,student_email: str) -> bool:
    return (
        db.query(ExamAssignment)
        .filter(
            ExamAssignment.exam_id == exam_id,
            ExamAssignment.student_email == student_email,
        )
        .first() is not None
    )


def link_student_id(db: Session, exam_id: int,student_email: str, student_id: int) -> None:
    """Called when a registered student opens an assigned exam."""
    assignment = (
        db.query(ExamAssignment)
        .filter(
            ExamAssignment.exam_id == exam_id,
            ExamAssignment.student_email == student_email,
        )
        .first()
    )
    if assignment and not assignment.student_id:
        assignment.student_id = student_id
        db.commit()
