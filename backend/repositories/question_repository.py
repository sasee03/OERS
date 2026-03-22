from sqlalchemy.orm import Session
from models.question_model import Question


def bulk_create_questions(db: Session, questions: list[dict]) -> list[Question]:
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


def update_question(db: Session, question: Question,
                    question_text: str, option_a: str, option_b: str,
                    option_c: str, option_d: str, correct_answer: str) -> Question:
    question.question_text = question_text
    question.option_a = option_a
    question.option_b = option_b
    question.option_c = option_c
    question.option_d = option_d
    question.correct_answer = correct_answer
    db.commit()
    db.refresh(question)
    return question


def delete_questions_by_exam(db: Session, exam_id: int) -> None:
    db.query(Question).filter(Question.exam_id == exam_id).delete()
    db.commit()
