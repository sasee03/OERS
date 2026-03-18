from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from utils.dependencies import require_admin
from schemas.exam_schema import ExamCreate, ExamUpdate, ExamOut
from schemas.question_schema import (
    BulkQuestionCreate, QuestionOutWithAnswer, CorrectAnswerUpdate, QuestionUpdate,
)
from schemas.assignment_schema import AssignExam, AssignmentOut
from schemas.submission_schema import LeaderboardEntry
from schemas.user_schema import UserResponse
from services.exam_service import (
    service_create_exam, service_get_all_exams, service_get_exam,
    service_update_exam, service_delete_exam, service_search_exams,
)
from services.question_service import (
    service_add_questions, service_get_questions, service_update_answer,
    service_update_question,
)
from services.submission_service import (
    service_get_leaderboard, service_get_all_results,
)
from repositories.assignment_repository import (
    assign_students, get_assignments_by_exam,
)
from repositories.user_repository import get_all_students

router = APIRouter(prefix="/api/admin", tags=["Admin"])

# ── Exam CRUD ─────────────────────────────────────────────────

@router.post("/exams", response_model=ExamOut,
             status_code=status.HTTP_201_CREATED)
def create_exam(data: ExamCreate, db: Session = Depends(get_db),
                admin=Depends(require_admin)):
    return service_create_exam(db, data, admin.id)


@router.get("/exams", response_model=List[ExamOut])
def list_exams(db: Session = Depends(get_db),
               admin=Depends(require_admin)):
    return service_get_all_exams(db)


@router.get("/exams/search", response_model=List[ExamOut])
def search_exams(q: str, db: Session = Depends(get_db),
                 admin=Depends(require_admin)):
    return service_search_exams(db, q)


@router.get("/exams/{exam_id}", response_model=ExamOut)
def get_exam(exam_id: int, db: Session = Depends(get_db),
             admin=Depends(require_admin)):
    return service_get_exam(db, exam_id)


@router.put("/exams/{exam_id}", response_model=ExamOut)
def update_exam(exam_id: int, data: ExamUpdate,
                db: Session = Depends(get_db),
                admin=Depends(require_admin)):
    return service_update_exam(db, exam_id, data)


@router.delete("/exams/{exam_id}",
               status_code=status.HTTP_204_NO_CONTENT)
def delete_exam(exam_id: int, db: Session = Depends(get_db),
                admin=Depends(require_admin)):
    service_delete_exam(db, exam_id)


# ── Questions ─────────────────────────────────────────────────

@router.post("/exams/{exam_id}/questions",
             response_model=List[QuestionOutWithAnswer],
             status_code=status.HTTP_201_CREATED)
def add_questions(exam_id: int, data: BulkQuestionCreate,
                  db: Session = Depends(get_db),
                  admin=Depends(require_admin)):
    return service_add_questions(db, exam_id, data)


@router.get("/exams/{exam_id}/questions",
            response_model=List[QuestionOutWithAnswer])
def get_questions(exam_id: int, db: Session = Depends(get_db),
                  admin=Depends(require_admin)):
    return service_get_questions(db, exam_id)


@router.patch("/questions/{question_id}/answer",
              response_model=QuestionOutWithAnswer)
def update_correct_answer(question_id: int, data: CorrectAnswerUpdate,
                           db: Session = Depends(get_db),
                           admin=Depends(require_admin)):
    """
    Change correct answer for a question.
    Already submitted scores will NOT change — only future submissions.
    """
    return service_update_answer(db, question_id, data)


@router.put("/questions/{question_id}",
            response_model=QuestionOutWithAnswer)
def update_question_full(question_id: int, data: QuestionUpdate,
                         db: Session = Depends(get_db),
                         admin=Depends(require_admin)):
    """Edit full question (text, options, correct answer)."""
    return service_update_question(db, question_id, data)


# ── Assign students ───────────────────────────────────────────

@router.post("/exams/{exam_id}/assign")
def assign_exam(exam_id: int, data: AssignExam,
                db: Session = Depends(get_db),
                admin=Depends(require_admin)):
    return assign_students(db, exam_id, data.student_emails)


@router.get("/exams/{exam_id}/candidates")
def get_candidates(exam_id: int, db: Session = Depends(get_db),
                   admin=Depends(require_admin)):
    return get_assignments_by_exam(db, exam_id)


# ── Results & Leaderboard ─────────────────────────────────────

@router.get("/results")
def all_results(db: Session = Depends(get_db),
                admin=Depends(require_admin)):
    return service_get_all_results(db)


@router.get("/exams/{exam_id}/leaderboard",
            response_model=List[LeaderboardEntry])
def leaderboard(exam_id: int, db: Session = Depends(get_db),
                admin=Depends(require_admin)):
    return service_get_leaderboard(db, exam_id)


# ── Students ──────────────────────────────────────────────────

@router.get("/students", response_model=List[UserResponse])
def list_students(db: Session = Depends(get_db),
                  admin=Depends(require_admin)):
    return get_all_students(db)
