# SkillGap — A Placement Readiness Analyzer

SkillGap is a full-stack web application designed to help users identify their skills, explore job opportunities, and understand how well their skills match job requirements. It provides a dashboard for viewing skill information and job-match results.

## Features

- **User Authentication:** Login functionality using JWT-based authentication.
- **Dashboard:** View relevant skill and job-matching information.
- **Skill Detection:** Identify skills from supported input sources.
- **My Skills:** View and manage identified skills.
- **Job Listings:** Explore job-related information.
- **Skill Matching:** Compare user skills with job requirements and view match scores.
- **Analytics:** Use data analysis to summarize relevant skill and job-matching information.

## Tech Stack

| Category          | Technologies                          |
| ----------------- | ------------------------------------- |
| Frontend          | React.js, JavaScript, HTML, CSS       |
| UI Styling        | Tailwind CSS                          |
| Backend           | Python, Django, Django REST Framework |
| Authentication    | JWT                                   |
| Database          | MySQL                                 |
| Data Analytics    | Pandas                                |
| API Communication | REST APIs                             |
| Development Tools | VS Code, Git, GitHub, Vite            |

## Project Structure

```text
SkillGap/
├── backend/
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── ...
│   ├── core/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── services.py
│   │   ├── extractor.py
│   │   ├── analytics.py
│   │   └── ...
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── api.js
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the project:

- Python
- Node.js and npm
- MySQL Server
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/VaishaliGaikwad16/SkillGap.git
cd SkillGap
```

### 2. Configure the MySQL database

Ensure MySQL Server is running.

Create a database for the project using MySQL Workbench or the MySQL command line. For example:

```sql
CREATE DATABASE skillgap_db;
```

Configure the database connection in the Django backend according to the settings used by your local project.

**Important:** Use your own database credentials and configuration. Never commit passwords, API keys, or other secrets to GitHub.

### 3. Set up the backend

Open a terminal in the project root:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

Configure the required database settings and environment variables for your installation.

Apply database migrations:

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

The backend will normally be available at:

`http://127.0.0.1:8000/`

### 4. Set up the frontend

Open a second terminal in the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal. It is commonly:

`http://localhost:5173/`

Ensure the frontend API configuration points to the running Django backend.

## Running the Application

1. Start MySQL Server.
2. Start the Django backend.
3. Start the React frontend in a separate terminal.
4. Open the frontend URL in your browser.
5. Log in and explore the available dashboard, skills, jobs, and matching features.

## Learning Outcomes

This project provides practical experience with:

- Full-stack web application development.
- Designing and consuming REST APIs.
- Database integration and data modeling.
- Authentication and frontend-backend integration.
- Python-based skill extraction and data analytics.
- Version control using Git and GitHub.

## Future Enhancements

- Improve skill-matching accuracy.
- Add more job-market insights and analytics.
- Expand automated testing.
- Deploy the application to a production environment.

## Author

**Vaishali Sanjay Gaikwad**

GitHub: [VaishaliGaikwad16](https://github.com/VaishaliGaikwad16)
