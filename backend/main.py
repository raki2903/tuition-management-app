from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
from database import engine, SessionLocal


# ==================================================
# DATABASE
# ==================================================

models.Base.metadata.create_all(bind=engine)


# ==================================================
# FASTAPI
# ==================================================

app = FastAPI(
    title="Tuition Management App",
    description="Backend for managing classes, students, subjects and syllabus tasks"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================================================
# DATABASE CONNECTION
# ==================================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# ==================================================
# HOME
# ==================================================

@app.get("/")
def home():
    return {
        "message": "Tuition App Backend is running!"
    }


# ==================================================
# CLASSES
# ==================================================

@app.post("/classes")
def create_class(
    classroom: schemas.ClassCreate,
    db: Session = Depends(get_db)
):

    new_class = models.ClassRoom(
        name=classroom.name
    )

    db.add(new_class)
    db.commit()
    db.refresh(new_class)

    return new_class


@app.get("/classes")
def get_classes(
    db: Session = Depends(get_db)
):

    return db.query(models.ClassRoom).all()


# ==================================================
# DELETE CLASS
# ==================================================

@app.delete("/classes/{class_id}")
def delete_class(
    class_id: int,
    db: Session = Depends(get_db)
):

    classroom = db.query(
        models.ClassRoom
    ).filter(
        models.ClassRoom.id == class_id
    ).first()

    if not classroom:
        raise HTTPException(
            status_code=404,
            detail="Class not found"
        )

    # Find students in this class
    students = db.query(
        models.Student
    ).filter(
        models.Student.class_id == class_id
    ).all()

    # Delete their student-task records
    for student in students:
        db.query(
            models.StudentTask
        ).filter(
            models.StudentTask.student_id == student.id
        ).delete(
            synchronize_session=False
        )

    # Delete students
    db.query(
        models.Student
    ).filter(
        models.Student.class_id == class_id
    ).delete(
        synchronize_session=False
    )

    # Find subjects in this class
    subjects = db.query(
        models.Subject
    ).filter(
        models.Subject.class_id == class_id
    ).all()

    for subject in subjects:

        tasks = db.query(
            models.Task
        ).filter(
            models.Task.subject_id == subject.id
        ).all()

        for task in tasks:

            db.query(
                models.StudentTask
            ).filter(
                models.StudentTask.task_id == task.id
            ).delete(
                synchronize_session=False
            )

        db.query(
            models.Task
        ).filter(
            models.Task.subject_id == subject.id
        ).delete(
            synchronize_session=False
        )

    # Delete subjects
    db.query(
        models.Subject
    ).filter(
        models.Subject.class_id == class_id
    ).delete(
        synchronize_session=False
    )

    # Delete class
    db.delete(classroom)

    db.commit()

    return {
        "message": "Class deleted successfully"
    }


# ==================================================
# STUDENTS
# ==================================================

@app.post("/students")
def create_student(
    student: schemas.StudentCreate,
    db: Session = Depends(get_db)
):

    classroom = db.query(
        models.ClassRoom
    ).filter(
        models.ClassRoom.id == student.class_id
    ).first()

    if not classroom:
        raise HTTPException(
            status_code=404,
            detail="Class not found"
        )

    new_student = models.Student(
        name=student.name,
        class_id=student.class_id
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    # Get only tasks belonging to subjects
    # of this student's class
    subjects = db.query(
        models.Subject
    ).filter(
        models.Subject.class_id == student.class_id
    ).all()

    subject_ids = [
        subject.id
        for subject in subjects
    ]

    if subject_ids:

        tasks = db.query(
            models.Task
        ).filter(
            models.Task.subject_id.in_(subject_ids)
        ).all()

        for task in tasks:

            student_task = models.StudentTask(
                student_id=new_student.id,
                task_id=task.id,
                completed=0
            )

            db.add(student_task)

    db.commit()

    return new_student


@app.get("/students")
def get_students(
    db: Session = Depends(get_db)
):

    return db.query(models.Student).all()


@app.get("/classes/{class_id}/students")
def get_class_students(
    class_id: int,
    db: Session = Depends(get_db)
):

    classroom = db.query(
        models.ClassRoom
    ).filter(
        models.ClassRoom.id == class_id
    ).first()

    if not classroom:
        raise HTTPException(
            status_code=404,
            detail="Class not found"
        )

    return db.query(
        models.Student
    ).filter(
        models.Student.class_id == class_id
    ).all()


# ==================================================
# DELETE STUDENT
# ==================================================

@app.delete("/students/{student_id}")
def delete_student(
    student_id: int,
    db: Session = Depends(get_db)
):

    student = db.query(
        models.Student
    ).filter(
        models.Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    db.query(
        models.StudentTask
    ).filter(
        models.StudentTask.student_id == student_id
    ).delete(
        synchronize_session=False
    )

    db.delete(student)

    db.commit()

    return {
        "message": "Student deleted successfully"
    }


# ==================================================
# SUBJECTS
# ==================================================

@app.post("/subjects")
def create_subject(
    subject: schemas.SubjectCreate,
    db: Session = Depends(get_db)
):

    classroom = db.query(
        models.ClassRoom
    ).filter(
        models.ClassRoom.id == subject.class_id
    ).first()

    if not classroom:
        raise HTTPException(
            status_code=404,
            detail="Class not found"
        )

    new_subject = models.Subject(
        name=subject.name,
        class_id=subject.class_id
    )

    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)

    return new_subject


@app.get("/subjects")
def get_subjects(
    db: Session = Depends(get_db)
):

    return db.query(models.Subject).all()


@app.get("/classes/{class_id}/subjects")
def get_class_subjects(
    class_id: int,
    db: Session = Depends(get_db)
):

    classroom = db.query(
        models.ClassRoom
    ).filter(
        models.ClassRoom.id == class_id
    ).first()

    if not classroom:
        raise HTTPException(
            status_code=404,
            detail="Class not found"
        )

    return db.query(
        models.Subject
    ).filter(
        models.Subject.class_id == class_id
    ).all()


# ==================================================
# DELETE SUBJECT
# ==================================================

@app.delete("/subjects/{subject_id}")
def delete_subject(
    subject_id: int,
    db: Session = Depends(get_db)
):

    subject = db.query(
        models.Subject
    ).filter(
        models.Subject.id == subject_id
    ).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    # Find tasks belonging to subject
    tasks = db.query(
        models.Task
    ).filter(
        models.Task.subject_id == subject_id
    ).all()

    for task in tasks:

        # Delete student-task records
        db.query(
            models.StudentTask
        ).filter(
            models.StudentTask.task_id == task.id
        ).delete(
            synchronize_session=False
        )

    # Delete tasks
    db.query(
        models.Task
    ).filter(
        models.Task.subject_id == subject_id
    ).delete(
        synchronize_session=False
    )

    # Delete subject
    db.delete(subject)

    db.commit()

    return {
        "message": "Subject deleted successfully"
    }


# ==================================================
# TASKS
# ==================================================

@app.post("/tasks")
def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(get_db)
):

    subject = db.query(
        models.Subject
    ).filter(
        models.Subject.id == task.subject_id
    ).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    new_task = models.Task(
        description=task.description,
        subject_id=task.subject_id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    # Find students ONLY in this subject's class
    students = db.query(
        models.Student
    ).filter(
        models.Student.class_id == subject.class_id
    ).all()

    for student in students:

        student_task = models.StudentTask(
            student_id=student.id,
            task_id=new_task.id,
            completed=0
        )

        db.add(student_task)

    db.commit()

    return new_task


@app.get("/tasks")
def get_tasks(
    db: Session = Depends(get_db)
):

    return db.query(models.Task).all()


@app.get("/subjects/{subject_id}/tasks")
def get_subject_tasks(
    subject_id: int,
    db: Session = Depends(get_db)
):

    subject = db.query(
        models.Subject
    ).filter(
        models.Subject.id == subject_id
    ).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    return db.query(
        models.Task
    ).filter(
        models.Task.subject_id == subject_id
    ).all()


# ==================================================
# DELETE TASK
# ==================================================

@app.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):

    task = db.query(
        models.Task
    ).filter(
        models.Task.id == task_id
    ).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    db.query(
        models.StudentTask
    ).filter(
        models.StudentTask.task_id == task_id
    ).delete(
        synchronize_session=False
    )

    db.delete(task)

    db.commit()

    return {
        "message": "Task deleted successfully"
    }


# ==================================================
# STUDENT TASKS
# ==================================================

@app.post("/student-tasks")
def assign_task(
    student_task: schemas.StudentTaskCreate,
    db: Session = Depends(get_db)
):

    student = db.query(
        models.Student
    ).filter(
        models.Student.id == student_task.student_id
    ).first()

    task = db.query(
        models.Task
    ).filter(
        models.Task.id == student_task.task_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    # Make sure student's class matches
    # the task's subject class
    subject = db.query(
        models.Subject
    ).filter(
        models.Subject.id == task.subject_id
    ).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    if student.class_id != subject.class_id:
        raise HTTPException(
            status_code=400,
            detail="Student and task belong to different classes"
        )

    new_student_task = models.StudentTask(
        student_id=student_task.student_id,
        task_id=student_task.task_id,
        completed=0
    )

    db.add(new_student_task)
    db.commit()
    db.refresh(new_student_task)

    return new_student_task


@app.get("/student-tasks")
def get_student_tasks(
    db: Session = Depends(get_db)
):

    return db.query(
        models.StudentTask
    ).all()


# ==================================================
# UPDATE TASK STATUS
# ==================================================

@app.put("/student-tasks/{student_task_id}")
def update_task_status(
    student_task_id: int,
    status: schemas.TaskStatusUpdate,
    db: Session = Depends(get_db)
):

    student_task = db.query(
        models.StudentTask
    ).filter(
        models.StudentTask.id == student_task_id
    ).first()

    if not student_task:
        raise HTTPException(
            status_code=404,
            detail="Student task not found"
        )

    if status.completed not in [0, 1]:
        raise HTTPException(
            status_code=400,
            detail="completed must be 0 or 1"
        )

    student_task.completed = status.completed

    db.commit()
    db.refresh(student_task)

    return student_task


# ==================================================
# GET ONE STUDENT'S TASKS
# ==================================================

@app.get("/students/{student_id}/tasks")
def get_student_tasks_for_student(
    student_id: int,
    db: Session = Depends(get_db)
):

    student = db.query(
        models.Student
    ).filter(
        models.Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return db.query(
        models.StudentTask
    ).filter(
        models.StudentTask.student_id == student_id
    ).all()