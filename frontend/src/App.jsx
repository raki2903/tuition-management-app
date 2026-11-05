import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://127.0.0.1:8000";

// ======================================================
// DASHBOARD
// ======================================================

function Dashboard({
  classes,
  students,
  subjects,
  tasks,
  setPage,
}) {
  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Manage your tuition classes in one place.</p>
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-icon">🏫</div>
          <div>
            <h2>{classes.length}</h2>
            <p>Classes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👨‍🎓</div>
          <div>
            <h2>{students.length}</h2>
            <p>Students</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div>
            <h2>{subjects.length}</h2>
            <p>Subjects</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div>
            <h2>{tasks.length}</h2>
            <p>Syllabus Tasks</p>
          </div>
        </div>
      </div>

      <div className="welcome">
        <h2>Welcome to Tuition Manager 👋</h2>

        <p>
          Create classes first, then add students and subjects
          to the correct class.
        </p>

        <button onClick={() => setPage("classes")}>
          Manage Classes →
        </button>
      </div>
    </>
  );
}

// ======================================================
// CLASSES
// ======================================================

function Classes({
  classes,
  className,
  setClassName,
  addClass,
  deleteClass,
  message,
}) {
  return (
    <>
      <div className="page-header">
        <h1>Classes</h1>
        <p>Create and manage your tuition classes.</p>
      </div>

      <div className="card">
        <h2>Add Class</h2>

        <form
          className="input-row"
          onSubmit={(e) => {
            e.preventDefault();
            addClass();
          }}
        >
          <input
            type="text"
            placeholder="Example: Class 10"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            autoComplete="off"
          />

          <button type="submit">
            Add Class
          </button>
        </form>

        {message && (
          <p className="form-message">
            {message}
          </p>
        )}
      </div>

      <div className="card">
        <h2>All Classes</h2>

        {classes.length === 0 ? (
          <p className="empty">
            No classes added yet.
          </p>
        ) : (
          <div className="student-list">
            {classes.map((classroom) => (
              <div
                className="student"
                key={classroom.id}
              >
                <div className="avatar">
                  🏫
                </div>

                <div>
                  <strong>
                    {classroom.name}
                  </strong>

                  <small>
                    Class ID: {classroom.id}
                  </small>
                </div>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() =>
                    deleteClass(classroom.id)
                  }
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ======================================================
// STUDENTS
// ======================================================

function Students({
  classes,
  students,
  selectedClass,
  setSelectedClass,
  studentName,
  setStudentName,
  addStudent,
  deleteStudent,
  message,
}) {
  const classStudents = selectedClass
    ? students.filter(
        (student) =>
          Number(student.class_id) ===
          Number(selectedClass)
      )
    : [];

  return (
    <>
      <div className="page-header">
        <h1>Students</h1>
        <p>Add students to the correct class.</p>
      </div>

      <div className="card">
        <h2>Add Student</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            addStudent();
          }}
        >
          <label>Class</label>

          <select
            value={selectedClass}
            onChange={(e) =>
              setSelectedClass(e.target.value)
            }
          >
            <option value="">
              Select a class
            </option>

            {classes.map((classroom) => (
              <option
                key={classroom.id}
                value={classroom.id}
              >
                {classroom.name}
              </option>
            ))}
          </select>

          <label>Student Name</label>

          <div className="input-row">
            <input
              type="text"
              placeholder="Enter student name"
              value={studentName}
              onChange={(e) =>
                setStudentName(e.target.value)
              }
              autoComplete="off"
            />

            <button type="submit">
              Add Student
            </button>
          </div>
        </form>

        {message && (
          <p className="form-message">
            {message}
          </p>
        )}
      </div>

      <div className="card">
        <h2>
          Students
          {selectedClass && (
            <>
              {" "}
              ({classStudents.length})
            </>
          )}
        </h2>

        {!selectedClass ? (
          <p className="empty">
            Select a class to see its students.
          </p>
        ) : classStudents.length === 0 ? (
          <p className="empty">
            No students in this class yet.
          </p>
        ) : (
          <div className="student-list">
            {classStudents.map((student) => (
              <div
                className="student"
                key={student.id}
              >
                <div className="avatar">
                  {student.name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

                <div>
                  <strong>
                    {student.name}
                  </strong>

                  <small>
                    Student ID: {student.id}
                  </small>
                </div>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() =>
                    deleteStudent(student.id)
                  }
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ======================================================
// SUBJECTS
// ======================================================

function Subjects({
  classes,
  subjects,
  tasks,
  selectedClass,
  setSelectedClass,
  subjectName,
  setSubjectName,
  addSubject,
  deleteSubject,
  message,
}) {
  const classSubjects = selectedClass
    ? subjects.filter(
        (subject) =>
          Number(subject.class_id) ===
          Number(selectedClass)
      )
    : [];

  return (
    <>
      <div className="page-header">
        <h1>Subjects</h1>
        <p>Manage subjects for each class.</p>
      </div>

      <div className="card">
        <h2>Add Subject</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            addSubject();
          }}
        >
          <label>Class</label>

          <select
            value={selectedClass}
            onChange={(e) =>
              setSelectedClass(e.target.value)
            }
          >
            <option value="">
              Select a class
            </option>

            {classes.map((classroom) => (
              <option
                key={classroom.id}
                value={classroom.id}
              >
                {classroom.name}
              </option>
            ))}
          </select>

          <label>Subject Name</label>

          <div className="input-row">
            <input
              type="text"
              placeholder="Example: Mathematics"
              value={subjectName}
              onChange={(e) =>
                setSubjectName(e.target.value)
              }
              autoComplete="off"
            />

            <button type="submit">
              Add Subject
            </button>
          </div>
        </form>

        {message && (
          <p className="form-message">
            {message}
          </p>
        )}
      </div>

      <div className="subject-grid">
        {classSubjects.map((subject) => {
          const taskCount = tasks.filter(
            (task) =>
              Number(task.subject_id) ===
              Number(subject.id)
          ).length;

          return (
            <div
              className="subject-card"
              key={subject.id}
            >
              <div className="subject-icon">
                📚
              </div>

              <h3>{subject.name}</h3>

              <p>{taskCount} tasks</p>

              <button
                type="button"
                className="delete-button"
                onClick={() =>
                  deleteSubject(subject.id)
                }
              >
                🗑️
              </button>
            </div>
          );
        })}
      </div>

      {!selectedClass && (
        <p className="empty">
          Select a class to see its subjects.
        </p>
      )}

      {selectedClass &&
        classSubjects.length === 0 && (
          <p className="empty">
            No subjects added to this class yet.
          </p>
        )}
    </>
  );
}

// ======================================================
// TASKS
// ======================================================

function Tasks({
  classes,
  subjects,
  tasks,
  selectedClass,
  setSelectedClass,
  selectedSubject,
  setSelectedSubject,
  taskText,
  setTaskText,
  addTasks,
  deleteTask,
  loading,
  message,
}) {
  const classSubjects = selectedClass
    ? subjects.filter(
        (subject) =>
          Number(subject.class_id) ===
          Number(selectedClass)
      )
    : [];

  const classSubjectIds = classSubjects.map(
    (subject) => Number(subject.id)
  );

  const classTasks = tasks.filter((task) =>
    classSubjectIds.includes(
      Number(task.subject_id)
    )
  );

  return (
    <>
      <div className="page-header">
        <h1>Syllabus</h1>
        <p>Add one syllabus task per line.</p>
      </div>

      <div className="card">
        <h2>Add Syllabus Tasks</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTasks();
          }}
        >
          <label>Class</label>

          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedSubject("");
            }}
          >
            <option value="">
              Select a class
            </option>

            {classes.map((classroom) => (
              <option
                key={classroom.id}
                value={classroom.id}
              >
                {classroom.name}
              </option>
            ))}
          </select>

          <label>Subject</label>

          <select
            value={selectedSubject}
            onChange={(e) =>
              setSelectedSubject(e.target.value)
            }
            disabled={!selectedClass}
          >
            <option value="">
              Select a subject
            </option>

            {classSubjects.map((subject) => (
              <option
                key={subject.id}
                value={subject.id}
              >
                {subject.name}
              </option>
            ))}
          </select>

          <label>Tasks</label>

          <textarea
            value={taskText}
            onChange={(e) =>
              setTaskText(e.target.value)
            }
            placeholder={`Complete Exercise 1.1
Learn Tables 2-10
Revise Chapter 2`}
          />

          <div className="task-help">
            Each line becomes one separate task.
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Adding..."
              : "Add Tasks"}
          </button>
        </form>

        {message && (
          <p className="form-message">
            {message}
          </p>
        )}
      </div>

      <div className="card">
        <h2>Current Syllabus</h2>

        {!selectedClass ? (
          <p className="empty">
            Select a class to see its syllabus.
          </p>
        ) : classSubjects.length === 0 ? (
          <p className="empty">
            No subjects in this class yet.
          </p>
        ) : (
          classSubjects.map((subject) => {
            const subjectTasks =
              classTasks.filter(
                (task) =>
                  Number(task.subject_id) ===
                  Number(subject.id)
              );

            return (
              <div
                className="syllabus"
                key={subject.id}
              >
                <h3>
                  📚 {subject.name}
                </h3>

                {subjectTasks.length === 0 ? (
                  <p className="empty">
                    No tasks added.
                  </p>
                ) : (
                  subjectTasks.map(
                    (task, index) => (
                      <div
                        className="task"
                        key={task.id}
                      >
                        <span>
                          {index + 1}
                        </span>

                        <p>
                          {task.description}
                        </p>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            deleteTask(task.id)
                          }
                        >
                          🗑️
                        </button>
                      </div>
                    )
                  )
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

// ======================================================
// PROGRESS
// ======================================================

function Progress({
  students,
  classes,
  subjects,
  tasks,
  studentTasks,
  selectedStudent,
  setSelectedStudent,
  updateTaskStatus,
}) {
  const selectedStudentObject =
    students.find(
      (student) =>
        Number(student.id) ===
        Number(selectedStudent)
    );

  const studentClassId =
    selectedStudentObject?.class_id;

  const classSubjects = subjects.filter(
    (subject) =>
      Number(subject.class_id) ===
      Number(studentClassId)
  );

  const classSubjectIds =
    classSubjects.map(
      (subject) => Number(subject.id)
    );

  const classTasks = tasks.filter((task) =>
    classSubjectIds.includes(
      Number(task.subject_id)
    )
  );

  const studentTaskMap = {};

  studentTasks.forEach((studentTask) => {
    studentTaskMap[
      studentTask.task_id
    ] = studentTask;
  });

  const completedTasks =
    studentTasks.filter((studentTask) => {
      const task = tasks.find(
        (t) =>
          Number(t.id) ===
          Number(studentTask.task_id)
      );

      return (
        task &&
        classSubjectIds.includes(
          Number(task.subject_id)
        ) &&
        Number(studentTask.completed) === 1
      );
    }).length;

  const totalTasks = classTasks.length;

  const percentage =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  return (
    <>
      <div className="page-header">
        <h1>Student Progress</h1>
        <p>
          Track each student's syllabus completion.
        </p>
      </div>

      <div className="card">
        <h2>Select Student</h2>

        <select
          value={selectedStudent}
          onChange={(e) =>
            setSelectedStudent(e.target.value)
          }
        >
          <option value="">
            Select a student
          </option>

          {classes.map((classroom) => {
            const classStudents =
              students.filter(
                (student) =>
                  Number(student.class_id) ===
                  Number(classroom.id)
              );

            if (classStudents.length === 0) {
              return null;
            }

            return (
              <optgroup
                key={classroom.id}
                label={classroom.name}
              >
                {classStudents.map(
                  (student) => (
                    <option
                      key={student.id}
                      value={student.id}
                    >
                      {student.name}
                    </option>
                  )
                )}
              </optgroup>
            );
          })}
        </select>
      </div>

      {selectedStudent && (
        <>
          <div className="progress-card">
            <div>
              <h2>
                {completedTasks} / {totalTasks}
              </h2>

              <p>
                Tasks Completed
              </p>
            </div>

            <div className="progress-percentage">
              {percentage}%
            </div>
          </div>

          {classSubjects.map((subject) => {
            const subjectTasks =
              classTasks.filter(
                (task) =>
                  Number(task.subject_id) ===
                  Number(subject.id)
              );

            return (
              <div
                className="card"
                key={subject.id}
              >
                <h2>
                  📚 {subject.name}
                </h2>

                {subjectTasks.length === 0 ? (
                  <p className="empty">
                    No tasks for this subject.
                  </p>
                ) : (
                  subjectTasks.map((task) => {
                    const studentTask =
                      studentTaskMap[task.id];

                    const completed =
                      Number(
                        studentTask?.completed
                      ) === 1;

                    return (
                      <div
                        className="progress-task"
                        key={task.id}
                      >
                        <input
                          type="checkbox"
                          checked={completed}
                          disabled={!studentTask}
                          onChange={() => {
                            if (!studentTask) {
                              return;
                            }

                            updateTaskStatus(
                              studentTask.id,
                              completed ? 0 : 1
                            );
                          }}
                        />

                        <div className="progress-task-text">
                          <span
                            className={
                              completed
                                ? "completed-task"
                                : ""
                            }
                          >
                            {task.description}
                          </span>

                          <small>
                            {completed
                              ? "Completed"
                              : "Pending"}
                          </small>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            );
          })}
        </>
      )}
    </>
  );
}

// ======================================================
// MAIN APP
// ======================================================

function App() {
  const [page, setPage] =
    useState("dashboard");

  const [classes, setClasses] =
    useState([]);

  const [students, setStudents] =
    useState([]);

  const [subjects, setSubjects] =
    useState([]);

  const [tasks, setTasks] =
    useState([]);

  const [studentTasks, setStudentTasks] =
    useState([]);

  const [className, setClassName] =
    useState("");

  const [studentName, setStudentName] =
    useState("");

  const [subjectName, setSubjectName] =
    useState("");

  const [selectedClass, setSelectedClass] =
    useState("");

  const [selectedSubject, setSelectedSubject] =
    useState("");

  const [selectedStudent, setSelectedStudent] =
    useState("");

  const [taskText, setTaskText] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  // ==================================================
  // LOAD DATA
  // ==================================================

  const loadClasses = async () => {
    try {
      const response =
        await axios.get(
          `${API}/classes`
        );

      setClasses(response.data);
    } catch (error) {
      console.error(
        "Classes error:",
        error
      );
    }
  };

  const loadStudents = async () => {
    try {
      const response =
        await axios.get(
          `${API}/students`
        );

      setStudents(response.data);
    } catch (error) {
      console.error(
        "Students error:",
        error
      );
    }
  };

  const loadSubjects = async () => {
    try {
      const response =
        await axios.get(
          `${API}/subjects`
        );

      setSubjects(response.data);
    } catch (error) {
      console.error(
        "Subjects error:",
        error
      );
    }
  };

  const loadTasks = async () => {
    try {
      const response =
        await axios.get(
          `${API}/tasks`
        );

      setTasks(response.data);
    } catch (error) {
      console.error(
        "Tasks error:",
        error
      );
    }
  };

  const loadStudentTasks = async (
    studentId
  ) => {
    if (!studentId) {
      setStudentTasks([]);
      return;
    }

    try {
      const response =
        await axios.get(
          `${API}/students/${studentId}/tasks`
        );

      setStudentTasks(response.data);
    } catch (error) {
      console.error(
        "Student tasks error:",
        error
      );

      setStudentTasks([]);
    }
  };

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    loadClasses();
    loadStudents();
    loadSubjects();
    loadTasks();
  }, []);

  useEffect(() => {
    loadStudentTasks(selectedStudent);
  }, [selectedStudent]);

  // ==================================================
  // ADD CLASS
  // ==================================================

  const addClass = async () => {
    setMessage("");

    const name =
      className.trim();

    if (!name) {
      setMessage(
        "Please enter a class name."
      );
      return;
    }

    try {
      const response =
        await axios.post(
          `${API}/classes`,
          {
            name: name,
          }
        );

      console.log(
        "Class added:",
        response.data
      );

      setClassName("");

      await loadClasses();

      setMessage(
        `Class "${name}" added successfully.`
      );
    } catch (error) {
      console.error(
        "Add class error:",
        error
      );

      console.error(
        "Server response:",
        error.response?.data
      );

      setMessage(
        "Could not add class."
      );
    }
  };

  // ==================================================
  // DELETE CLASS
  // ==================================================

  const deleteClass = async (classId) => {
  try {
    await axios.delete(`${API}/classes/${classId}`);

    // Clear selections belonging to deleted class
    if (String(selectedClass) === String(classId)) {
      setSelectedClass("");
      setSelectedSubject("");
    }

    // Refresh all related data
    await loadClasses();
    await loadStudents();
    await loadSubjects();
    await loadTasks();

    setMessage("Class deleted successfully.");
  } catch (error) {
    console.error("Delete class error:", error);

    setMessage(
      error.response?.data?.detail ||
      "Could not delete class."
    );
  }
};
  // ==================================================
  // ADD STUDENT
  // ==================================================

  const addStudent = async () => {
    setMessage("");

    if (!selectedClass) {
      setMessage(
        "Please select a class."
      );
      return;
    }

    const name =
      studentName.trim();

    if (!name) {
      setMessage(
        "Please enter a student name."
      );
      return;
    }

    const classId =
      Number(selectedClass);

    if (!Number.isInteger(classId)) {
      setMessage(
        "Invalid class selected."
      );
      return;
    }

    try {
      console.log(
        "Adding student:",
        {
          name,
          class_id: classId,
        }
      );

      const response =
        await axios.post(
          `${API}/students`,
          {
            name: name,
            class_id: classId,
          }
        );

      console.log(
        "Student added:",
        response.data
      );

      setStudentName("");

      await loadStudents();

      setMessage(
        `${name} added successfully.`
      );
    } catch (error) {
      console.error(
        "Add student error:",
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Server response:",
        error.response?.data
      );

      setMessage(
        error.response?.data?.detail ||
        "Could not add student."
      );
    }
  };

  // ==================================================
  // DELETE STUDENT
  // ==================================================

 const deleteStudent = async (studentId) => {
  try {
    await axios.delete(`${API}/students/${studentId}`);

    if (String(selectedStudent) === String(studentId)) {
      setSelectedStudent("");
      setStudentTasks([]);
    }

    await loadStudents();

    setMessage("Student deleted successfully.");
  } catch (error) {
    console.error("Delete student error:", error);

    setMessage(
      error.response?.data?.detail ||
      "Could not delete student."
    );
  }
};
  // ==================================================
  // ADD SUBJECT
  // ==================================================

  const addSubject = async () => {
    setMessage("");

    if (!selectedClass) {
      setMessage(
        "Please select a class."
      );
      return;
    }

    const name =
      subjectName.trim();

    if (!name) {
      setMessage(
        "Please enter a subject name."
      );
      return;
    }

    try {
      await axios.post(
        `${API}/subjects`,
        {
          name: name,
          class_id: Number(selectedClass),
        }
      );

      setSubjectName("");

      await loadSubjects();

      setMessage(
        `${name} added successfully.`
      );
    } catch (error) {
      console.error(
        "Add subject error:",
        error
      );

      console.error(
        error.response?.data
      );

      setMessage(
        error.response?.data?.detail ||
        "Could not add subject."
      );
    }
  };

  // ==================================================
  // DELETE SUBJECT
  // ==================================================

 const deleteSubject = async (subjectId) => {
  try {
    await axios.delete(`${API}/subjects/${subjectId}`);

    await loadSubjects();
    await loadTasks();

    if (selectedStudent) {
      await loadStudentTasks(selectedStudent);
    }

    setMessage("Subject deleted successfully.");
  } catch (error) {
    console.error("Delete subject error:", error);

    setMessage(
      error.response?.data?.detail ||
      "Could not delete subject."
    );
  }
};
  // ==================================================
  // ADD TASKS
  // ==================================================

  const addTasks = async () => {
    setMessage("");

    if (!selectedClass) {
      setMessage(
        "Please select a class."
      );
      return;
    }

    if (!selectedSubject) {
      setMessage(
        "Please select a subject."
      );
      return;
    }

    const lines =
      taskText
        .split("\n")
        .map((line) =>
          line.trim()
        )
        .filter(
          (line) =>
            line !== ""
        );

    if (lines.length === 0) {
      setMessage(
        "Please enter at least one task."
      );
      return;
    }

    setLoading(true);

    try {
      for (const line of lines) {
        await axios.post(
          `${API}/tasks`,
          {
            description: line,
            subject_id:
              Number(selectedSubject),
          }
        );
      }

      setTaskText("");

      await loadTasks();

      setMessage(
        `${lines.length} task(s) added successfully.`
      );
    } catch (error) {
      console.error(
        "Add tasks error:",
        error
      );

      setMessage(
        error.response?.data?.detail ||
        "Could not add tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // DELETE TASK
  // ==================================================

  const deleteTask = async (taskId) => {
  try {
    await axios.delete(`${API}/tasks/${taskId}`);

    await loadTasks();

    if (selectedStudent) {
      await loadStudentTasks(selectedStudent);
    }

    setMessage("Task deleted successfully.");
  } catch (error) {
    console.error("Delete task error:", error);

    setMessage(
      error.response?.data?.detail ||
      "Could not delete task."
    );
  }
};
  // ==================================================
  // UPDATE TASK STATUS
  // ==================================================

  const updateTaskStatus = async (
    studentTaskId,
    completed
  ) => {
    try {
      await axios.put(
        `${API}/student-tasks/${studentTaskId}`,
        {
          completed:
            completed,
        }
      );

      await loadStudentTasks(
        selectedStudent
      );
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );
    }
  };

  // ==================================================
  // PAGE RENDERING
  // ==================================================

  const renderPage = () => {
    if (page === "classes") {
      return (
        <Classes
          classes={classes}
          className={className}
          setClassName={setClassName}
          addClass={addClass}
          deleteClass={deleteClass}
          message={message}
        />
      );
    }

    if (page === "students") {
      return (
        <Students
          classes={classes}
          students={students}
          selectedClass={selectedClass}
          setSelectedClass={
            setSelectedClass
          }
          studentName={studentName}
          setStudentName={
            setStudentName
          }
          addStudent={addStudent}
          deleteStudent={
            deleteStudent
          }
          message={message}
        />
      );
    }

    if (page === "subjects") {
      return (
        <Subjects
          classes={classes}
          subjects={subjects}
          tasks={tasks}
          selectedClass={selectedClass}
          setSelectedClass={
            setSelectedClass
          }
          subjectName={subjectName}
          setSubjectName={
            setSubjectName
          }
          addSubject={addSubject}
          deleteSubject={
            deleteSubject
          }
          message={message}
        />
      );
    }

    if (page === "tasks") {
      return (
        <Tasks
          classes={classes}
          subjects={subjects}
          tasks={tasks}
          selectedClass={selectedClass}
          setSelectedClass={
            setSelectedClass
          }
          selectedSubject={
            selectedSubject
          }
          setSelectedSubject={
            setSelectedSubject
          }
          taskText={taskText}
          setTaskText={
            setTaskText
          }
          addTasks={addTasks}
          deleteTask={deleteTask}
          loading={loading}
          message={message}
        />
      );
    }

    if (page === "progress") {
      return (
        <Progress
          students={students}
          classes={classes}
          subjects={subjects}
          tasks={tasks}
          studentTasks={
            studentTasks
          }
          selectedStudent={
            selectedStudent
          }
          setSelectedStudent={
            setSelectedStudent
          }
          updateTaskStatus={
            updateTaskStatus
          }
        />
      );
    }

    return (
      <Dashboard
        classes={classes}
        students={students}
        subjects={subjects}
        tasks={tasks}
        setPage={setPage}
      />
    );
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="app">

      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">
            T
          </div>

          <div>
            <h2>Tuition</h2>
            <span>Manager</span>
          </div>
        </div>

        <nav>

          <button
            className={
              page === "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setPage("dashboard")
            }
          >
            🏠 Dashboard
          </button>

          <button
            className={
              page === "classes"
                ? "active"
                : ""
            }
            onClick={() =>
              setPage("classes")
            }
          >
            🏫 Classes
          </button>

          <button
            className={
              page === "students"
                ? "active"
                : ""
            }
            onClick={() =>
              setPage("students")
            }
          >
            👨‍🎓 Students
          </button>

          <button
            className={
              page === "subjects"
                ? "active"
                : ""
            }
            onClick={() =>
              setPage("subjects")
            }
          >
            📚 Subjects
          </button>

          <button
            className={
              page === "tasks"
                ? "active"
                : ""
            }
            onClick={() =>
              setPage("tasks")
            }
          >
            📝 Syllabus
          </button>

          <button
            className={
              page === "progress"
                ? "active"
                : ""
            }
            onClick={() =>
              setPage("progress")
            }
          >
            📊 Progress
          </button>

        </nav>

        <div className="sidebar-footer">
          Tuition Manager

          <small>
            Phase 2
          </small>
        </div>

      </aside>

      <main className="main">

        <header className="topbar">

          <h3>
            Tuition Management
          </h3>

          <div className="connection">
            <span></span>
            Backend Connected
          </div>

        </header>

        <section className="content">
          {renderPage()}
        </section>

      </main>

    </div>
  );
}

export default App;