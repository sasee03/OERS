from pydantic import BaseModel, ConfigDict
from typing import Dict, Optional
from datetime import datetime


class StartExam(BaseModel):
    pass 


class SubmitExam(BaseModel):
    answers: Dict[int, str]   


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
    time_taken:   str   
