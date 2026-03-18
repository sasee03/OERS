from pydantic import BaseModel, ConfigDict, field_validator
from typing import List


class QuestionCreate(BaseModel):
    """Single question — used inside bulk create"""
    question_text:  str
    option_a:       str
    option_b:       str
    option_c:       str
    option_d:       str
    correct_answer: str   # must be A B C or D
    order_number:   int

    @field_validator("correct_answer")
    @classmethod
    def must_be_valid_option(cls, v):
        if v.upper() not in ("A", "B", "C", "D"):
            raise ValueError("correct_answer must be A, B, C, or D")
        return v.upper()


class BulkQuestionCreate(BaseModel):
    """Body for POST /api/admin/exams/{id}/questions"""
    questions: List[QuestionCreate]


class QuestionOut(BaseModel):
    id:             int
    exam_id:        int
    question_text:  str
    option_a:       str
    option_b:       str
    option_c:       str
    option_d:       str
    order_number:   int
    model_config = ConfigDict(from_attributes=True)


class QuestionOutWithAnswer(QuestionOut):
    """Includes correct_answer — only returned to admin"""
    correct_answer: str


class CorrectAnswerUpdate(BaseModel):
    """Body for PATCH /api/admin/questions/{id}/answer"""
    correct_answer: str

    @field_validator("correct_answer")
    @classmethod
    def must_be_valid(cls, v):
        if v.upper() not in ("A", "B", "C", "D"):
            raise ValueError("correct_answer must be A, B, C, or D")
        return v.upper()


class QuestionUpdate(BaseModel):
    """Body for PUT /api/admin/questions/{id} — full question edit"""
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str

    @field_validator("correct_answer")
    @classmethod
    def must_be_valid(cls, v):
        if v.upper() not in ("A", "B", "C", "D"):
            raise ValueError("correct_answer must be A, B, C, or D")
        return v.upper()
