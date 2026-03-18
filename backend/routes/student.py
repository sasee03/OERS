from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from utils.dependencies import require_student
from schemas.question_schema import QuestionOut
from schemas.exam_schema import ExamOut
from schemas.submission_schema import SubmitExam, SubmissionOut, LeaderboardEntry
from services.exam_service import (
    service_get_exam,
    service_get_active_exams_for_student,
    service_get_scheduled_exams_for_student,
    service_search_exams_for_student,
)
from services.question_service import service_get_questions
from services.submission_service import (
    service_get_my_score, service_start_exam, service_submit_exam,
    service_get_leaderboard, service_get_my_results,
)
from repositories.submission_repository import get_submission

router = APIRouter(prefix="/api/student", tags=["Student"])


# ── Exam Listing ──────────────────────────────────────────────

@router.get("/exams/active", response_model=List[ExamOut])
def active_exams(db: Session = Depends(get_db),
                 student=Depends(require_student)):
    """Exams currently open for attempt — only exams assigned to this student."""
    return service_get_active_exams_for_student(db, student.email)


@router.get("/exams/scheduled", response_model=List[ExamOut])
def scheduled_exams(db: Session = Depends(get_db),
                    student=Depends(require_student)):
    """Upcoming exams — only exams assigned to this student."""
    return service_get_scheduled_exams_for_student(db, student.email)


@router.get("/exams/search", response_model=List[ExamOut])
def search_exams(q: str, db: Session = Depends(get_db),
                 student=Depends(require_student)):
    """Search exams assigned to this student."""
    return service_search_exams_for_student(db, q, student.email)


@router.get("/exams/{exam_id}", response_model=ExamOut)
def get_exam(exam_id: int, db: Session = Depends(get_db),
             student=Depends(require_student)):
    return service_get_exam(db, exam_id)


# ── Attempt Exam ──────────────────────────────────────────────

@router.post("/exams/{exam_id}/start",
             response_model=SubmissionOut,
             status_code=status.HTTP_201_CREATED)
def start_exam(exam_id: int, db: Session = Depends(get_db),
               student=Depends(require_student)):
    """
    Called when student clicks Start Exam on the Note page.
    Creates the submission row with started_at timestamp.
    Returns the submission so frontend knows started_at.
    """
    return service_start_exam(
        db, exam_id, student.id, student.email
    )


@router.get("/exams/{exam_id}/questions",
            response_model=List[QuestionOut])
def get_questions(exam_id: int, db: Session = Depends(get_db),
                  student=Depends(require_student)):
    """
    Returns questions WITHOUT correct_answer.
    Only accessible after exam has started.
    """
    return service_get_questions(db, exam_id)


@router.post("/exams/{exam_id}/submit",
             response_model=SubmissionOut)
def submit_exam(exam_id: int, data: SubmitExam,
                db: Session = Depends(get_db),
                student=Depends(require_student)):
    """
    Submit answers — auto-calculates score.
    Can only be done once.
    """
    return service_submit_exam(db, exam_id, student.id, data)

@router.get("/exams/{exam_id}/score", response_model=SubmissionOut)
def get_my_score(
    exam_id: int,
    db: Session = Depends(get_db),
    student= Depends(require_student)
):
    """
    Get the authenticated student's submission (score) for a given exam.
    Returns 404 if no submission exists (exam not started or not submitted).
    """
    return service_get_my_score(db, exam_id, student.id)


# ── Results ───────────────────────────────────────────────────

@router.get("/exams/{exam_id}/submission",
            response_model=SubmissionOut)
def get_my_submission(exam_id: int, db: Session = Depends(get_db),
                      student=Depends(require_student)):
    """
    Returns the student's submission for this exam (started or completed).
    Used by AttemptExam for timer (started_at). 404 if student hasn't started.
    """
    sub = get_submission(db, exam_id, student.id)
    if not sub:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="No submission found")
    return sub


@router.get("/results")
def my_results(db: Session = Depends(get_db),
               student=Depends(require_student)):
    return service_get_my_results(db, student.id)


@router.get("/exams/{exam_id}/leaderboard",
            response_model=List[LeaderboardEntry])
def leaderboard(exam_id: int, db: Session = Depends(get_db),
                student=Depends(require_student)):
    return service_get_leaderboard(db, exam_id)
