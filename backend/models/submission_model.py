from sqlalchemy import (
    Column, Integer, Float,
    ForeignKey, DateTime, Boolean,
    UniqueConstraint
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Submission(Base):
    __tablename__ = "submissions"

    id             = Column(Integer, primary_key=True, index=True)
    exam_id        = Column(Integer, ForeignKey("exams.id"),  nullable=False)
    student_id     = Column(Integer, ForeignKey("users.id"),  nullable=False)
    answers        = Column(JSONB, nullable=True)    
    score          = Column(Float,   default=0)
    total_marks    = Column(Integer, default=0)
    started_at     = Column(DateTime(timezone=True), server_default=func.now())
    submitted_at   = Column(DateTime(timezone=True), nullable=True)
    is_completed   = Column(Boolean, default=False)

    __table_args__ = (
        UniqueConstraint("exam_id", "student_id", name="uq_submission_exam_student"),
    )

    exam = relationship("Exam", back_populates="submissions")
