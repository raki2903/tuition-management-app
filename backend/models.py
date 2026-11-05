
from sqlalchemy import Column, Integer, String
from database import Base


# ==================================================
# CLASS
# ==================================================

class ClassRoom(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)


# ==================================================
# STUDENT
# ==================================================

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    class_id = Column(Integer, nullable=False)


# ==================================================
# SUBJECT
# ==================================================

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    class_id = Column(Integer, nullable=False)


# ==================================================
# TASK
# ==================================================

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, nullable=False)
    subject_id = Column(Integer, nullable=False)


# ==================================================
# STUDENT TASK
# ==================================================

class StudentTask(Base):
    __tablename__ = "student_tasks"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=False)
    task_id = Column(Integer, nullable=False)
    completed = Column(Integer, default=0)
