from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Dummy Database
# -------------------------

users = {
    "Student": {},
    "Teacher": {"teacher1": "123"}
}

student_marks = {}

# -------------------------
# Models
# -------------------------

class LoginData(BaseModel):
    role: str
    username: str
    password: str

class MarksData(BaseModel):
    student: str
    math: int
    science: int
    english: int

# -------------------------
# Signup
# -------------------------

@app.post("/signup")
def signup(data: LoginData):
    if data.username in users[data.role]:
        return {"status": "error"}
    users[data.role][data.username] = data.password
    return {"status": "success"}

# -------------------------
# Login
# -------------------------

@app.post("/login")
def login(data: LoginData):
    if data.username in users[data.role] and users[data.role][data.username] == data.password:
        return {"status": "success"}
    return {"status": "error"}

# -------------------------
# Upload Marks (Teacher)
# -------------------------

@app.post("/upload_marks")
def upload_marks(data: MarksData):
    student_marks[data.student] = {
        "math": data.math,
        "science": data.science,
        "english": data.english,
        "average": (data.math + data.science + data.english) / 3
    }
    return {"status": "success"}

# -------------------------
# Get Student Data
# -------------------------

@app.get("/student/{username}")
def get_student(username: str):
    if username in student_marks:
        return student_marks[username]
    return {"error": "No Data"}

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)