# 🎓 Online Learning & Course Recommendation Platform

## 📌 Project Overview

The **Online Learning & Course Recommendation Platform** is a full-stack EdTech web application that allows learners to browse courses, enroll in courses, track their learning progress, and receive personalized course recommendations based on their interests, skills, enrolled courses, and learning behavior.

This project demonstrates complete **Full Stack Development**, including:

* Frontend Development
* Backend API Development
* Database Design
* Authentication & Authorization
* Recommendation System Logic
* Progress Tracking
* REST API Integration
* Search & Filtering
* GitHub Project Documentation

---

# 🚀 Objective

The main objective of this project is to build an industry-oriented EdTech platform that helps learners discover relevant courses and improve learning engagement through personalized recommendations.

---

# ❓ Problem Statement

Many learners struggle to find the right courses among thousands of options available online. Traditional learning platforms often fail to provide personalized learning experiences.

This project solves that problem by:

* Recommending courses based on skills and interests
* Suggesting similar courses
* Tracking learning progress
* Improving course discovery
* Increasing learner engagement

---

# 🌍 Industry Relevance

This project is highly relevant for:

* MOOCs
* Universities
* Corporate Learning Platforms
* Bootcamps
* HR Upskilling Platforms
* Career Path Recommendation Systems

Modern EdTech companies use recommendation systems to improve:

* Course enrollments
* User retention
* Course completion rates
* Personalized learning experiences

---

# ✨ Features

## 👤 Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes

## 📚 Course Management

* Browse Courses
* Course Details Page
* Search Courses
* Filter Courses

## 🎯 Recommendation System

* Recommend courses based on:

  * User interests
  * Skills
  * Course tags
  * Enrolled courses
* Similar course recommendations
* Skill-gap recommendations

## 📈 Progress Tracking

* Track lesson progress
* Completion percentage
* Enrolled courses dashboard

## 🧠 Recommendation Logic

Hybrid recommendation approach:

* Content-Based Filtering
* Collaborative Filtering
* Skill Matching
* Tag Matching

---

# 🏗️ Project Architecture

## Frontend

* React.js / Next.js
* Tailwind CSS
* Axios
* React Router

## Backend

* Node.js
* Express.js / NestJS
* JWT Authentication
* REST APIs

## Recommendation Service

* FastAPI
* Python
* Scikit-learn
* TF-IDF Similarity

## Database

* MongoDB / PostgreSQL
* Prisma ORM / Mongoose

## Search Engine

* Meilisearch

## Cache & Queue

* Redis

---

# 🔄 Workflow

```text
User Registration
        ↓
Profile Creation
        ↓
Select Skills & Interests
        ↓
Browse Courses
        ↓
Recommendation Engine
        ↓
Enroll in Courses
        ↓
Watch Lessons
        ↓
Track Progress
        ↓
Get Personalized Recommendations
```

---

# 🧱 Tech Stack

## Frontend

* React.js
* Next.js
* Tailwind CSS
* Axios

## Backend

* Node.js
* Express.js
* NestJS

## Database

* MongoDB
* PostgreSQL

## Recommendation Engine

* FastAPI
* Python
* Scikit-learn
* TF-IDF

## Authentication

* JWT Authentication

## DevOps

* Docker
* Docker Compose

---

# 📂 Folder Structure

```bash
Online-Learning-Course-Recommendation-Platform/
│
├── apps/
│   ├── web/          # Frontend
│   ├── api/          # Backend API
│   ├── reco/         # Recommendation Engine
│
├── infra/            # Docker & Infrastructure
├── docs/             # Documentation & Screenshots
├── README.md
└── .gitignore
```

---

# 🗄️ Database Collections / Tables

## User

* name
* email
* password
* role
* interests
* skills

## Course

* title
* description
* category
* tags
* level
* lessons

## Enrollment

* userId
* courseId
* enrollmentStatus

## Progress

* enrollmentId
* lessonId
* completionPercentage

## Interaction

* userId
* courseId
* eventType

---

# 🔌 API Endpoints

## Authentication

```bash
POST /auth/register
POST /auth/login
```

## Courses

```bash
GET /courses
GET /courses/:id
POST /courses
```

## Enrollment

```bash
POST /enrollments
GET /enrollments/user/:id
```

## Progress

```bash
POST /progress/update
GET /progress/:userId
```

## Recommendations

```bash
GET /recommend/user
GET /recommend/similar
POST /recommend/skillgap
```

---

# 🧠 Recommendation System

The recommendation engine works using:

## 1️⃣ Content-Based Filtering

Matches:

* Course tags
* Skills
* Categories
* Descriptions

## 2️⃣ Collaborative Filtering

Recommends courses based on:

* User interactions
* Similar learner behavior
* Enrollment history

## 3️⃣ Skill-Gap Recommendations

Suggests courses to fill missing skills for target career paths.

---

# ⚙️ Installation Guide

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/Online-Learning-Course-Recommendation-Platform.git
```

---

## 2️⃣ Install Frontend Dependencies

```bash
cd apps/web
npm install
```

---

## 3️⃣ Install Backend Dependencies

```bash
cd apps/api
npm install
```

---

## 4️⃣ Install Recommendation Service Dependencies

```bash
cd apps/reco
pip install -r requirements.txt
```

---

# 🔐 Environment Variables

## Backend `.env`

```env
PORT=3001
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

## Frontend `.env`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

# ▶️ Running the Project

## Start Backend

```bash
cd apps/api
npm run start
```

## Start Frontend

```bash
cd apps/web
npm run dev
```

## Start Recommendation Service

```bash
cd apps/reco
uvicorn app:app --reload
```

---

# 🌐 Localhost URLs

| Service            | URL                   |
| ------------------ | --------------------- |
| Frontend           | http://localhost:3000 |
| Backend API        | http://localhost:3001 |
| Recommendation API | http://localhost:8000 |

---

# 🧪 Virtual Simulation

## Sample Workflow

### Step 1

Create learner account

### Step 2

Select interests:

* AI
* Web Development
* Data Science
* Cybersecurity

### Step 3

Browse courses

### Step 4

Receive recommended courses

### Step 5

Enroll in course

### Step 6

Watch lessons & update progress

### Step 7

Track completion percentage

---

# 📸 Screenshots to Capture

* Register Page
* Login Page
* Home Dashboard
* Course Listing Page
* Course Details Page
* Recommendation Section
* Enrolled Courses Page
* Progress Tracking Dashboard
* MongoDB Collections
* API Testing
* GitHub Repository

---

# 📤 GitHub Upload Steps

## Create Repository

Recommended Repository Name:

```bash
Online-Learning-Course-Recommendation-Platform
```

## Git Commands

```bash
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_LINK
git push -u origin main
```

---

# 🏷️ GitHub Topics / Tags

```text
mern-stack
edtech
learning-platform
course-recommendation
reactjs
nodejs
mongodb
fastapi
recommendation-system
fullstack-project
```

---

# ⚠️ Important Notes

✅ Never upload `.env`

✅ Use `.env.example`

✅ Add screenshots inside `/docs`

✅ Keep commit history clean

---

# 📅 Proof Building Strategy

## Day 1

Frontend setup

### Commit

```bash
Frontend setup with React and Tailwind
```

---

## Day 2

Backend setup

### Commit

```bash
Backend API setup using Express and MongoDB
```

---

## Day 3

Database models

### Commit

```bash
Added database schemas and models
```

---

## Day 4

Authentication

### Commit

```bash
Implemented JWT authentication
```

---

## Day 5

Course module

### Commit

```bash
Added course listing and details pages
```

---

## Day 6

Recommendation system

### Commit

```bash
Implemented recommendation engine
```

---

## Day 7

Enrollment & progress tracking

### Commit

```bash
Added enrollment and progress tracking
```

---

## Day 8

Documentation & GitHub polish

### Commit

```bash
Added README, screenshots, and documentation
```

---

# 🎯 Learning Outcomes

By building this project, I learned:

* Full Stack Development
* REST API Development
* JWT Authentication
* Database Design
* Recommendation Systems
* Frontend & Backend Integration
* Search & Filtering
* Docker Basics
* Git & GitHub Workflow
* Industry-Level Project Structure

---

# 💼 Career Relevance

This project is useful for:

* Full Stack Developer Roles
* MERN Stack Developer Roles
* Frontend Developer Roles
* Backend Developer Roles
* Software Engineer Roles
* EdTech Product Developer Roles

---

# 🎤 Interview Questions

## 1️⃣ Explain your project.

### Answer:

I built a full-stack Online Learning & Course Recommendation Platform where users can browse courses, enroll in courses, track progress, and receive personalized recommendations based on their interests, skills, and course interactions. The project demonstrates frontend development, backend APIs, authentication, database design, and recommendation system implementation.

---

## 2️⃣ What recommendation logic did you use?

### Answer:

I used a hybrid recommendation system combining content-based filtering and collaborative filtering. The system recommends courses using user interests, course tags, skills, and user interaction history.

---

## 3️⃣ Why did you use JWT?

### Answer:

JWT provides secure authentication and allows protected API access without storing session data on the server.

---

## 4️⃣ What challenges did you face?

### Answer:

Frontend-backend integration, recommendation logic, protected routes, and progress tracking were the main challenges.

---

# 🚀 Future Enhancements

* AI-based recommendations
* Video streaming
* Payment gateway integration
* Live classes
* Admin dashboard
* Instructor dashboard
* Certificates
* Notifications
* Real-time chat
* Mobile app support

---

# 👨‍💻 Author

## D Karthikeyan

Student | Full Stack Developer | MERN Stack Learner

### College

JBIET

---

# ⭐ Final Note

This project demonstrates industry-level Full Stack Development with recommendation systems and modern EdTech architecture. It can serve as a strong proof-of-work project for internships, placements, GitHub portfolios, and software engineering interviews.
