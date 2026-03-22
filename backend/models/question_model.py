from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Question(Base):
    __tablename__ = "questions"

    id             = Column(Integer, primary_key=True, index=True)
    exam_id        = Column(Integer, ForeignKey("exams.id"), nullable=False)
    question_text  = Column(Text, nullable=False)
    option_a       = Column(String(500), nullable=False)
    option_b       = Column(String(500), nullable=False)
    option_c       = Column(String(500), nullable=False)
    option_d       = Column(String(500), nullable=False)
    correct_answer = Column(String(1), nullable=False) 
    order_number   = Column(Integer, nullable=False)   

    exam = relationship("Exam", back_populates="questions")
