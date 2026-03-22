from pydantic import BaseModel, ConfigDict, field_validator
from typing import List


class QuestionCreate(BaseModel):
    question_text:  str
    option_a:       str
    option_b:       str
    option_c:       str
    option_d:       str
    correct_answer: str 
    order_number:   int

    @field_validator("correct_answer")
    @classmethod
    def must_be_valid_option(cls, v):
        if v.upper() not in ("A", "B", "C", "D"):
            raise ValueError("correct_answer must be A, B, C, or D")
        return v.upper()


class BulkQuestionCreate(BaseModel):
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
    correct_answer: str


class CorrectAnswerUpdate(BaseModel):
    correct_answer: str

    @field_validator("correct_answer")
    @classmethod
    def must_be_valid(cls, v):
        if v.upper() not in ("A", "B", "C", "D"):
            raise ValueError("correct_answer must be A, B, C, or D")
        return v.upper()


class QuestionUpdate(BaseModel):
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
