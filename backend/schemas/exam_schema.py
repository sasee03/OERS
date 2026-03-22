from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class ExamCreate(BaseModel):
    title:           str
    total_questions: int
    start_time:      datetime
    end_time:        datetime
    duration_minutes: int

class ExamUpdate(BaseModel):
    title: Optional[str] = None
    total_questions: Optional[int] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    is_active: Optional[bool] = None


class ExamOut(BaseModel):
    id:              int
    title:           str
    total_questions: int
    start_time:      datetime
    end_time:        datetime
    duration_minutes: int
    created_by:      int
    is_active:       bool
    created_at:      datetime
    model_config = ConfigDict(from_attributes=True)
