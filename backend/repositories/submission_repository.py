from sqlalchemy.orm import Session
from datetime import datetime
from models.submission_model import Submission


def create_submission(db: Session, exam_id: int,
                      student_id: int) -> Submission:
    """Create a submission row when student starts the exam."""
    sub = Submission(exam_id=exam_id, student_id=student_id)
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub


def get_submission(db: Session, exam_id: int,
                   student_id: int) -> Submission | None:
    return (
        db.query(Submission)
        .filter(
            Submission.exam_id == exam_id,
            Submission.student_id == student_id,
        )
        .first()
    )

def complete_submission(db: Session, submission: Submission,
                         answers: dict, score: float,
                         total_marks: int) -> Submission:
    """Update submission row when student submits answers."""
    submission.answers      = answers
    submission.score        = score
    submission.total_marks  = total_marks
    submission.submitted_at = datetime.utcnow()
    submission.is_completed = True
    db.commit()
    db.refresh(submission)
    return submission


def get_submissions_by_exam(db: Session,
                             exam_id: int) -> list[Submission]:
    return (
        db.query(Submission)
        .filter(
            Submission.exam_id == exam_id,
            Submission.is_completed == True,
        )
        .order_by(Submission.score.desc())
        .all()
    )


def get_submissions_by_student(db: Session,
                                student_id: int) -> list[Submission]:
    return (
        db.query(Submission)
        .filter(Submission.student_id == student_id)
        .all()
    )


def get_all_submissions(db: Session) -> list[Submission]:
    return (
        db.query(Submission)
        .filter(Submission.is_completed == True)
        .all()
    )
