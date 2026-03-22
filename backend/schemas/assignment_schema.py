from pydantic import BaseModel, ConfigDict
from typing import List
from datetime import datetime


class AssignExam(BaseModel):
    student_emails: List[str]


class AssignmentOut(BaseModel):
    id:            int
    exam_id:       int
    student_email: str
    student_id:    int | None
    assigned_at:   datetime
    model_config = ConfigDict(from_attributes=True)
