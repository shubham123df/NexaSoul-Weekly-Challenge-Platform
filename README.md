# NexaSoul Weekly Challenge Platform

Interactive web platform for NexaSoul's weekly engagement initiatives — starting with the **Week 1 Frontend Trivia Challenge**.

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

Copy `server/.env.example` to `server/.env` and set your MongoDB URI:

```
MONGODB_URI=mongodb://127.0.0.1:27017/nexasoul-quiz
ADMIN_SECRET=nexasoul-admin-2026
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
