🌀 Spin the Wheel – Quiz Game Web Application

A full-stack Django REST Framework + React project

📌 Overview

This project is a web-based interactive quiz game where players test their knowledge by spinning a wheel.
The wheel randomly selects a question and a difficulty level, while the user chooses the subject.

Players earn points based on difficulty and compete on a global leaderboard.

This document defines the project scope, architecture, stack, models, views, and workflow clearly.

🎮 Core Concept

The user logs in or registers for an account

The user selects a subject

The wheel spins and randomly selects:

A question

A difficulty level (Easy, Medium, Hard)

User answers the question

Score updates based on correctness and difficulty

A global leaderboard ranks all players by total score

🧩 Key Features
1. Authentication

User registration (username, email, password)

Login/logout

Token or JWT-based authentication

2. Gameplay

User chooses a subject

Wheel animation spins

Backend randomly sends a question & difficulty

User submits the answer

Score is updated instantly

3. Scoring
Difficulty	Points
Easy	10
Medium	20
Hard	30
4. Leaderboard

Ranks users by total score

Shows username + points

Global and accessible to anyone

🏗 Final Tech Stack
Backend – Django REST Framework (DRF)

Django 5

Django REST Framework

PostgreSQL

Django CORS

TokenAuth / JWT

Gunicorn (production)

Nginx (reverse proxy)

Frontend – React

React 18

Vite

Axios (API calls)

Zustand (state management)

Framer Motion (wheel animation)

Tailwind CSS (styling)

Deployment

Backend → Render / DigitalOcean / Railway

Frontend → Vercel / Netlify

DB → PostgreSQL (managed service)

🗂 Backend Data Models
User

Uses Django's built-in User model.

Subject
Field	Type	Notes
id	AutoField	PK
name	CharField	e.g., Algorithms, Networking
description	TextField	optional
Question
Field	Type	Notes
id	AutoField	PK
subject	FK → Subject	One-to-many
text	TextField	Question statement
difficulty	CharField	Easy / Medium / Hard
answer	CharField	Correct answer
UserScore
Field	Type	Notes
user	OneToOne → User	each user has 1 score
score	IntegerField	total points
GameSession (optional, useful for analytics)

Tracks each question answered.

Field	Type
user	FK → User
question	FK → Question
is_correct	Boolean
points_awarded	Integer
timestamp	DateTime
🚀 Backend Endpoints (REST API)
Method	Endpoint	Purpose
POST	/api/auth/register/	Create user
POST	/api/auth/login/	Login and return token
GET	/api/subjects/	List subjects
GET	/api/questions/random/?subject=ID	Get random question & difficulty
POST	/api/submit/	Submit answer, update score
GET	/api/leaderboard/	Fetch global ranking
🎨 Frontend Page Structure
1. Login / Register Page

Form for username/password

Sends API requests to backend

2. Home / Game Dashboard

Shows available subjects

“Start Game” button

3. Subject Selection

User picks one of the subjects

4. Wheel Page

Wheel animation

After spinning → fetch random question

5. Question Page

Displays question text

Shows difficulty badge

Input field for answer

Submit button

6. Leaderboard Page

List of top players

Displays usernames + scores

🎯 Gameplay Flow (Backend + Frontend)

User logs in

User selects a subject

Frontend calls: /api/questions/random/?subject=ID

Backend picks a random question + difficulty

Frontend shows the question

User submits answer → /api/submit/

Backend checks correctness → awards points

Score is updated in UserScore

User can check leaderboard anytime

🧠 Why Django + DRF?

Built-in authentication

Admin panel for managing questions & subjects

Safe and stable for production

DRF makes it easy to create APIs for React

⚠️ Important Development Notes

Always validate user answers on the backend

Never send correct answers to the frontend

Use server-side randomness for question selection

Protect score updates with backend logic only

Use pagination for leaderboard to prevent heavy load

📦 Folder Structure
Backend
backend/
  manage.py
  core/
  api/
    serializers.py
    views.py
    urls.py
  subjects/
  questions/
  users/
  scores/

Frontend
frontend/
  src/
    components/
    screens/
    store/
    utils/

🏁 Conclusion

This project will deliver a fully interactive quiz experience using a modern full-stack architecture. With Django powering the backend and React handling animations and UI, the system remains scalable, maintainable, and deployable in real production environments.