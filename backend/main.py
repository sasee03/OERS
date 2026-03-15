from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
import models.user_model
import models.exam_model
import models.question_model
import models.assignment_model
import models.submission_model
from routes import auth, admin, student

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(student.router)

@app.get("/", tags=["Normal"])
def root():
    return {"message": "Hello Hi Welcome"}