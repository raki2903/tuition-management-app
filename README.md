# Tuition Management App

A local desktop application designed to help tuition teachers organize student records, subjects, syllabus tasks, and student progress in one place.

## About the Project

Managing tuition students and tracking their syllabus progress manually can become difficult.

The Tuition Management App aims to simplify this process by allowing teachers to organize subjects, divide syllabuses into individual tasks, and track each student's completion status.

The application is designed to work locally on a computer.

## Features

- **Student Management:** Organize student records.
- **Subject Management:** Create and manage subjects.
- **Syllabus Management:** Enter a syllabus and organize it into individual tasks.
- **Progress Tracking:** Track whether each student has completed or still has pending tasks.
- **Desktop Application:** Uses Electron to provide a desktop application experience.
- **Local Database:** Uses SQLite to store application data locally.

## Tech Stack

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| FastAPI | Backend API |
| SQLAlchemy | Database interaction |
| SQLite | Local database |
| React | Frontend user interface |
| Vite | Frontend development and build tool |
| Electron | Desktop application framework |
| JavaScript | Frontend and Electron programming |
| CSS | User interface styling |

## Project Structure

```text
tuition-management-app/
│
├── backend/
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── run_server.py
│   ├── schemas.py
│   └── tuition-backend.spec
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── electron.js
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Technologies and Architecture

The application follows a frontend-backend architecture:

1. **Frontend:** React provides the user interface.
2. **Backend:** FastAPI handles application logic and API requests.
3. **Database:** SQLite stores the application data.
4. **ORM:** SQLAlchemy connects Python code with the database.
5. **Desktop Layer:** Electron provides the desktop application environment.


## Version Control

This project uses **Git** for version control and **GitHub** for hosting its remote repository.

Repository: https://github.com/raki2903/tuition-management-app

## Project Status

The initial version of the project has been committed and pushed to GitHub. Development and improvements can continue through future commits.

---

**Built as a practical project to simplify tuition management and student progress tracking.**
