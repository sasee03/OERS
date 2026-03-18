from sqlalchemy import (
    Column, Integer, String, Text,
    DateTime, ForeignKey, Boolean
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Exam(Base):
    """
    exams table
    - created by admin
    - has a start_time and end_time
    - is_active = False means admin ended it manually
    """
    __tablename__ = "exams"

    id               = Column(Integer, primary_key=True, index=True)
    title            = Column(String(255), nullable=False)
    total_questions  = Column(Integer, nullable=False)
    start_time       = Column(DateTime(timezone=True), nullable=False)
    end_time         = Column(DateTime(timezone=True), nullable=False)
    created_by       = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_active        = Column(Boolean, default=True)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())
    duration_minutes = Column(Integer, nullable=False, default=60)
    # relationships
    questions   = relationship("Question",       back_populates="exam", cascade="all, delete-orphan")
    assignments = relationship("ExamAssignment", back_populates="exam", cascade="all, delete-orphan")
    submissions = relationship("Submission",     back_populates="exam", cascade="all, delete-orphan")
