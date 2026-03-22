from sqlalchemy import (
    Column, Integer, String,
    ForeignKey, DateTime, UniqueConstraint
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class ExamAssignment(Base):
    __tablename__ = "exam_assignments"

    id            = Column(Integer, primary_key=True, index=True)
    exam_id       = Column(Integer, ForeignKey("exams.id"), nullable=False)
    student_email = Column(String(255), nullable=False)
    student_id    = Column(Integer, ForeignKey("users.id"), nullable=True)
    assigned_at   = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("exam_id", "student_email", name="uq_exam_student_email"),
    )

    exam = relationship("Exam", back_populates="assignments")
