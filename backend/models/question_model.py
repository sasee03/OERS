from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Question(Base):
    """
    questions table
    - belongs to one exam
    - stores 4 options and the correct answer (A/B/C/D)
    - order_number controls display order
    """
    __tablename__ = "questions"

    id             = Column(Integer, primary_key=True, index=True)
    exam_id        = Column(Integer, ForeignKey("exams.id"), nullable=False)
    question_text  = Column(Text, nullable=False)
    option_a       = Column(String(500), nullable=False)
    option_b       = Column(String(500), nullable=False)
    option_c       = Column(String(500), nullable=False)
    option_d       = Column(String(500), nullable=False)
    correct_answer = Column(String(1), nullable=False)   # "A" "B" "C" "D"
    order_number   = Column(Integer, nullable=False)     # 1, 2, 3 ...

    exam = relationship("Exam", back_populates="questions")
