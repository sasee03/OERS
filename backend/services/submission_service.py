from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime, timezone

from repositories.submission_repository import (
    create_submission, get_submission,
    complete_submission, get_submissions_by_exam,
    get_submissions_by_student, get_all_submissions,
)
from repositories.question_repository import get_questions_by_exam
from repositories.assignment_repository import is_student_assigned
from repositories.exam_repository import get_exam_by_id
from repositories.user_repository import get_user_by_id
from schemas.submission_schema import SubmitExam, LeaderboardEntry
from datetime import timedelta

def service_start_exam(db: Session, exam_id: int, student_id: int,
                        student_email: str):
    """
    Called when student clicks Start Exam.
    - Checks exam is active and within time window
    - Checks student is assigned
    - Creates submission row with started_at
    """
    exam = get_exam_by_id(db, exam_id)
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    now = datetime.now(timezone.utc)

    if not exam.is_active:
        raise HTTPException(status_code=400, detail="Exam is no longer active")

    if now < exam.start_time.replace(tzinfo=timezone.utc):
        raise HTTPException(status_code=400, detail="Exam has not started yet")

    if now > exam.end_time.replace(tzinfo=timezone.utc):
        raise HTTPException(status_code=400, detail="Exam time is over")

    if not is_student_assigned(db, exam_id, student_email):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not assigned to this exam",
        )

    existing = get_submission(db, exam_id, student_id)
    if existing and existing.is_completed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already submitted this exam",
        )

    # Return existing started submission if any (page refresh case)
    if existing:
        return existing

    return create_submission(db, exam_id, student_id)

def get_student_deadline(exam, submission):
    """Returns the actual deadline for this student's attempt."""
    personal_deadline = submission.started_at + timedelta(minutes=exam.duration_minutes)
    return min(personal_deadline, exam.end_time)
    
def service_submit_exam(db: Session, exam_id: int,
                         student_id: int, data: SubmitExam):
    """
    Called when student clicks Submit.
    - Auto-calculates score
    - Marks submission as completed
    """
    exam = get_exam_by_id(db, exam_id)
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    submission = get_submission(db, exam_id, student_id)
    if not submission:
        raise HTTPException(
            status_code=400,
            detail="You must start the exam before submitting",
        )
    if submission.is_completed:
        raise HTTPException(status_code=400, detail="Already submitted")

    # Auto-calculate score
    questions  = get_questions_by_exam(db, exam_id)
    score      = 0
    total      = len(questions)

    for q in questions:
        submitted = data.answers.get(q.id)
        if submitted and submitted.upper() == q.correct_answer.upper():
            score += 1

    # Convert keys to strings for JSONB storage
    answers_json = {str(k): v for k, v in data.answers.items()}

    return complete_submission(db, submission, answers_json, score, total)


def service_get_leaderboard(db: Session,
                             exam_id: int) -> list[LeaderboardEntry]:
    exam = get_exam_by_id(db, exam_id)
    submission = get_submission(db, exam_id, 0) 
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    if not submission:
        raise HTTPException(status_code=404, detail="Exam not started")
    if submission.is_completed :
        raise HTTPException(status_code=400, detail="Already submitted")
    submissions = get_submissions_by_exam(db, exam_id)
    leaderboard = []

    for rank, sub in enumerate(submissions, start=1):
        student    = get_user_by_id(db, sub.student_id)
        percentage = (sub.score / sub.total_marks * 100) if sub.total_marks else 0
        personal_deadline = submission.started_at + timedelta(minutes=exam.duration_minutes)
        actual_deadline = min(personal_deadline, exam.end_time)
        if datetime.now(timezone.utc) > actual_deadline:
            pass
        # Calculate time taken
        if sub.submitted_at and sub.started_at:
            delta   = sub.submitted_at - sub.started_at
            mins    = int(delta.total_seconds() // 60)
            secs    = int(delta.total_seconds() % 60)
            time_taken = f"{mins} mins {secs} secs"
        else:
            time_taken = "N/A"

        leaderboard.append(
            LeaderboardEntry(
                rank         = rank,
                student_id   = sub.student_id,
                username     = student.username if student else "Unknown",
                score        = sub.score,
                total_marks  = sub.total_marks,
                percentage   = round(percentage, 2),
                time_taken   = time_taken,
                submitted_at = sub.submitted_at,
            )
        )
    return leaderboard


def service_get_my_results(db: Session, student_id: int):
    submissions = get_submissions_by_student(db, student_id)
    results = []
    for sub in submissions:
        exam = get_exam_by_id(db, sub.exam_id)
        results.append({
            "exam_id":      sub.exam_id,
            "exam_title":   exam.title if exam else "Unknown",
            "score":        sub.score,
            "total_marks":  sub.total_marks,
            "percentage":   round((sub.score / sub.total_marks * 100) if sub.total_marks else 0, 2),
            "submitted_at": sub.submitted_at,
            "is_completed": sub.is_completed,
        })
    return results


def service_get_all_results(db: Session):
    submissions = get_all_submissions(db)
    results = []
    for sub in submissions:
        exam    = get_exam_by_id(db, sub.exam_id)
        student = get_user_by_id(db, sub.student_id)
        results.append({
            "submission_id": sub.id,
            "student_id":    sub.student_id,
            "username":      student.username if student else "Unknown",
            "exam_id":       sub.exam_id,
            "exam_title":    exam.title if exam else "Unknown",
            "score":         sub.score,
            "total_marks":   sub.total_marks,
            "percentage":    round((sub.score / sub.total_marks * 100) if sub.total_marks else 0, 2),
            "submitted_at":  sub.submitted_at,
        })
    return results
