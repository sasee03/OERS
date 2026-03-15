from sqlalchemy.orm import Session
from models.question_model import Question


def bulk_create_questions(db: Session, questions: list[dict]) -> list[Question]:
    """Insert multiple questions at once."""
    objs = [Question(**q) for q in questions]
    db.add_all(objs)
    db.commit()
    for obj in objs:
        db.refresh(obj)
    return objs


def get_questions_by_exam(db: Session, exam_id: int) -> list[Question]:
    return (
        db.query(Question)
        .filter(Question.exam_id == exam_id)
        .order_by(Question.order_number)
        .all()
    )


def get_question_by_id(db: Session, question_id: int) -> Question | None:
    return db.query(Question).filter(Question.id == question_id).first()


def update_correct_answer(db: Session, question: Question,
                          correct_answer: str) -> Question:
    question.correct_answer = correct_answer
    db.commit()
    db.refresh(question)
    return question


def delete_questions_by_exam(db: Session, exam_id: int) -> None:
    db.query(Question).filter(Question.exam_id == exam_id).delete()
    db.commit()
