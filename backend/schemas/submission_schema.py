from pydantic import BaseModel, ConfigDict
from typing import Dict, Optional
from datetime import datetime


class StartExam(BaseModel):
    """Body for POST /api/student/exams/{id}/start"""
    pass   # no body needed — just the exam_id in URL


class SubmitExam(BaseModel):
    """Body for POST /api/student/exams/{id}/submit"""
    answers: Dict[int, str]   # { question_id: "A" }


class SubmissionOut(BaseModel):
    id:           int
    exam_id:      int
    student_id:   int
    score:        float
    total_marks:  int
    started_at:   datetime
    submitted_at: Optional[datetime]
    is_completed: bool
    model_config = ConfigDict(from_attributes=True)


class LeaderboardEntry(BaseModel):
    rank:         int
    student_id:   int
    username:     str
    score:        float
    total_marks:  int
    percentage:   float
    time_taken:   str          # e.g. "12 mins 34 secs"
