from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class ExamCreate(BaseModel):
    """Body for POST /api/admin/exams"""
    title:           str
    total_questions: int
    start_time:      datetime
    end_time:        datetime


class ExamUpdate(BaseModel):
    """Body for PUT /api/admin/exams/{id} — all fields optional"""
    title:           Optional[str]      = None
    end_time:        Optional[datetime] = None   # extend the date
    is_active:       Optional[bool]     = None


class ExamOut(BaseModel):
    id:              int
    title:           str
    total_questions: int
    start_time:      datetime
    end_time:        datetime
    created_by:      int
    is_active:       bool
    created_at:      datetime
    model_config = ConfigDict(from_attributes=True)
