from pydantic import BaseModel


class ClassCreate(BaseModel):
    name: str


class StudentCreate(BaseModel):
    name: str
    class_id: int


class SubjectCreate(BaseModel):
    name: str
    class_id: int


class TaskCreate(BaseModel):
    description: str
    subject_id: int


class StudentTaskCreate(BaseModel):
    student_id: int
    task_id: int


class TaskStatusUpdate(BaseModel):
    completed: int