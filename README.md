# NexaSoul Weekly Challenge Platform

Interactive web platform for NexaSoul's weekly engagement initiatives — starting with the **Week 1 Frontend Trivia Challenge**.

## Recent UX Improvements

- **Auto-hiding navbar** — hides on scroll down, reappears smoothly on scroll up
- **Quiz auto-advance** — moves to the next question 400ms after selecting an answer
- **20-minute timer** — fixed top-right during quiz, warns at 5 minutes, auto-submits at 0:00
- **Educational quiz UI** — clean indigo/teal palette, focused distraction-free layout
- **MongoDB Atlas** — configure via `MONGODB_URI` in `server/.env`

## Features

- **Quiz Landing Page** — NexaSoul blue-green branding, scoring rules, top performers preview
- **Quiz Registration** — Name, UID, Email, Mobile, Department, Year
- **Quiz Engine** — 20 MCQs with progress bar, question transitions (Framer Motion)
- **Timer System** — 20-minute global timer + per-question speed bonus tracking
- **Scoring** — +10 correct, +5 bonus (≤5s), +3 bonus (≤10s)
- **Results Page** — Score, accuracy, time, correct/wrong, rank + confetti
- **Learning Feature** — "Why is this answer correct?" expandable explanations
- **Leaderboard** — Top 10 participants
- **Admin Dashboard** — Create/edit quizzes, manage questions, activate/deactivate, set deadlines
- **Analytics** — Participants, average/highest score, question-wise accuracy
- **Export** — CSV and Excel downloads

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React, Vite, Tailwind CSS, Framer Motion |
| Backend  | Node.js, Express.js                 |
| Database | MongoDB                             |

## Project Structure

```
/client          → React frontend
/server          → Express API
/database        → Reserved for migrations/scripts
/server/seed     → Sample question seeder
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment

Copy `server/.env.example` to `server/.env`.

**MongoDB Atlas (recommended for production):**

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user and allow your IP in Network Access
3. Copy the connection string and set it in `server/.env`:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/nexasoul-quiz?retryWrites=true&w=majority
```

**Local development:**

```
MONGODB_URI=mongodb://127.0.0.1:27017/nexasoul-quiz
```

### 3. Seed sample questions

```bash
cd server && npm run seed
```

This creates the Week 1 quiz with **20 frontend development MCQs**.

### 4. Start the servers

```bash
# Terminal 1 — API
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000

### Admin Access

Go to `/admin` and use the secret from `ADMIN_SECRET` in `.env` (default: `nexasoul-admin-2026`).

## Deployment

- **Frontend:** Vercel — set `VITE_API_URL` to your Render API URL
- **Backend:** Render — set `MONGODB_URI`, `CLIENT_URL`, `ADMIN_SECRET`
- **Database:** MongoDB Atlas

## Future Scope

Frontend Debug Challenge, Design Challenge, Build-in-One-Hour, Mini Coding Contest, Hackathon Registrations, Certificates, Badges, and more.
