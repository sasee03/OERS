from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from repositories.question_repository import (
    bulk_create_questions, get_questions_by_exam,
    get_question_by_id, update_correct_answer,
)
from repositories.exam_repository import get_exam_by_id
from schemas.question_schema import BulkQuestionCreate, CorrectAnswerUpdate


def service_add_questions(db: Session, exam_id: int,
                           data: BulkQuestionCreate):
    exam = get_exam_by_id(db, exam_id)
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    if len(data.questions) != exam.total_questions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Exam expects {exam.total_questions} questions, "
                   f"got {len(data.questions)}",
        )

    questions_data = [
        {**q.model_dump(), "exam_id": exam_id}
        for q in data.questions
    ]
    return bulk_create_questions(db, questions_data)


def service_get_questions(db: Session, exam_id: int):
    exam = get_exam_by_id(db, exam_id)
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return get_questions_by_exam(db, exam_id)


def service_update_answer(db: Session, question_id: int,
                           data: CorrectAnswerUpdate):
    """
    Admin can change the correct answer.
    Note: scores already submitted will NOT be recalculated.
    Only future submissions will use the new answer.
    """
    question = get_question_by_id(db, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return update_correct_answer(db, question, data.correct_answer)
