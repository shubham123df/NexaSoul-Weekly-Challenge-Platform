# 🏗️ NexaSoul Quiz Platform - Architecture & Deployment Blueprint

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│                   (Mobile/Desktop)                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTPS
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  FRONTEND (Vercel)                           │
│                                                              │
│  React + Vite + Tailwind CSS + Framer Motion                │
│  URL: https://nexasoul-quiz.vercel.app                      │
│                                                              │
│  Pages:                                                      │
│  ├─ Landing Page (/)                                        │
│  ├─ Registration (/register)                                │
│  ├─ Instructions (/instructions)                            │
│  ├─ Quiz (/quiz)                                            │
│  ├─ Results (/results)                                      │
│  ├─ Review (/review)                                        │
│  ├─ Leaderboard (/leaderboard)                              │
│  └─ Admin Panel (/admin)                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ REST API (Axios)
                       │ CORS Enabled
                       │
┌──────────────────────▼──────────────────────────────────────┐
│               BACKEND API (Render)                           │
│                                                              │
│  Node.js + Express.js                                       │
│  URL: https://nexasoul-quiz-api.onrender.com               │
│                                                              │
│  Routes:                                                     │
│  ├─ /api/quiz/*          (Quiz operations)                  │
│  ├─ /api/admin/*         (Admin panel)                      │
│  ├─ /api/leaderboard/*   (Rankings)                         │
│  ├─ /api/analytics/*     (Data export)                      │
│  └─ /api/health          (Health check)                     │
│                                                              │
│  Middleware:                                                 │
│  ├─ CORS (Client URL whitelist)                             │
│  ├─ Admin Auth (Secret key)                                 │
│  └─ Error Handling                                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Database Connection
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    DATABASE                                  │
│                                                              │
│  Option 1: MongoDB Atlas (Recommended)                      │
│  ├─ Free Tier: 512 MB                                       │
│  ├─ Collections: quizzes, submissions                       │
│  └─ URL: mongodb+srv://.../nexasoul-quiz                   │
│                                                              │
│  Option 2: PostgreSQL (After Migration)                     │
│  ├─ Render PostgreSQL Free Tier                             │
│  ├─ Tables: quizzes, questions, submissions, answers        │
│  └─ URL: postgresql://.../nexasoul_quiz                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Project Structure

```
NexaSoul Weekly Challenge Platform/
│
├── 📁 client/                          # Frontend Application
│   ├── public/                         # Static assets
│   ├── src/
│   │   ├── api/                        # API client (Axios)
│   │   │   └── client.js              # API configuration
│   │   ├── components/                 # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Timer.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── ...
│   │   ├── context/                    # React Context
│   │   │   └── QuizContext.jsx        # Global quiz state
│   │   ├── pages/                      # Route pages
│   │   │   ├── Landing.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Quiz.jsx
│   │   │   ├── Admin.jsx
│   │   │   └── ...
│   │   ├── App.jsx                     # Router setup
│   │   ├── main.jsx                    # Entry point
│   │   └── index.css                   # Global styles
│   ├── .env                            # Environment variables
│   ├── vite.config.js                  # Vite configuration
│   ├── package.json
│   └── tailwind.config.js
│
├── 📁 server/                          # Backend Application
│   ├── db/                             # Database (after migration)
│   │   ├── index.js                   # PostgreSQL connection
│   │   └── schema.js                  # Drizzle ORM schema
│   ├── models/                         # Database models/queries
│   │   ├── Quiz.js                    # MongoDB model (current)
│   │   ├── Submission.js              # MongoDB model (current)
│   │   ├── quizQueries.js             # PostgreSQL (after migration)
│   │   └── submissionQueries.js       # PostgreSQL (after migration)
│   ├── routes/                         # API routes
│   │   ├── quiz.js                    # Quiz endpoints
│   │   ├── admin.js                   # Admin endpoints
│   │   ├── leaderboard.js             # Leaderboard endpoints
│   │   └── analytics.js               # Analytics endpoints
│   ├── middleware/
│   │   └── adminAuth.js               # Admin authentication
│   ├── seed/
│   │   └── seedQuestions.js           # Database seeder
│   ├── .env                            # Environment variables
│   ├── index.js                        # Server entry point
│   ├── package.json
│   └── render.yaml                     # Render deployment config
│
├── 📄 MIGRATION_PLAN.md                # PostgreSQL migration guide
├── 📄 DEPLOYMENT_GUIDE.md              # Render deployment steps
├── 📄 ARCHITECTURE.md                  # This file
├── 📄 render.yaml                      # Render infrastructure config
└── 📄 README.md                        # Project documentation
```

---

## 🔄 Data Flow

### User Takes Quiz Flow:
```
1. User visits /register
   ↓
2. Frontend validates email via POST /api/quiz/active/check-email
   ↓
3. Backend checks MongoDB/PostgreSQL for existing submission
   ↓
4. If valid, navigate to /instructions
   ↓
5. User starts quiz → /quiz
   ↓
6. Frontend fetches quiz via GET /api/quiz/active
   ↓
7. Timer starts (20 minutes)
   ↓
8. User answers 20 questions (auto-advance)
   ↓
9. Submit answers via POST /api/quiz/:id/submit
   ↓
10. Backend calculates:
    ├─ Score (10 points per correct)
    ├─ Bonus points (fast answers)
    ├─ Accuracy percentage
    └─ Rank on leaderboard
    ↓
11. Save to database
    ↓
12. Return results → /results page
    ↓
13. User can review answers → /review
```

### Admin Panel Flow:
```
1. Admin visits /admin
   ↓
2. Login with secret key
   ↓
3. Backend validates x-admin-secret header
   ↓
4. Access admin dashboard:
   ├─ View all quizzes
   ├─ Create/edit quizzes
   ├─ View submissions
   ├─ View Top Performers
   ├─ Delete submissions
   └─ Export analytics (CSV/Excel)
```

---

## 🌐 Deployment Architecture

### Production Setup:

```
┌──────────────────────────────────────────────────────┐
│                    GitHub Repository                  │
│         github.com/username/nexasoul-quiz            │
└──────────┬───────────────────────────┬──────────────┘
           │                           │
           │ Push to main              │ Push to main
           │                           │
           ▼                           ▼
┌─────────────────────┐     ┌────────────────────────┐
│   Vercel (Frontend) │     │  Render (Backend)      │
│                     │     │                        │
│ Auto-deploy on push │     │ Auto-deploy on push    │
│                     │     │                        │
│ Build: npm run build│     │ Build: npm install     │
│ Output: dist/       │     │ Start: npm start       │
│                     │     │                        │
│ Env Vars:           │     │ Env Vars:              │
│ VITE_API_URL        │◄───►│ ADMIN_SECRET           │
│                     │     │ CLIENT_URL ────────────┼──┐
└─────────────────────┘     │ DATABASE_URL/MONGODB_URI│  │
                            └──────────┬──────────────┘  │
                                       │                 │
                                       │ Connect         │
                                       ▼                 │
                            ┌──────────────────────┐    │
                            │ MongoDB Atlas OR     │    │
                            │ Render PostgreSQL    │    │
                            │                      │    │
                            │ Free Tier            │    │
                            └──────────────────────┘    │
                                                        │
                            ┌──────────────────────┐    │
                            │  Render PostgreSQL   │    │
                            │  (After Migration)   │────┘
                            └──────────────────────┘
```

---

## 🔐 Security Measures

### Frontend:
- ✅ Environment variables for API URL
- ✅ No hardcoded secrets
- ✅ HTTPS only (Vercel)
- ✅ Admin route hidden from UI

### Backend:
- ✅ CORS whitelist (CLIENT_URL)
- ✅ Admin secret key authentication
- ✅ Input validation (email, mobile)
- ✅ Duplicate submission prevention
- ✅ Error handling (no sensitive data leaks)

### Database:
- ✅ MongoDB: IP whitelist, username/password
- ✅ PostgreSQL: Connection string with credentials
- ✅ No public access (internal network only on Render)

---

## 📈 Scaling Considerations

### Current (Free Tier):
- ✅ Up to 100 concurrent users
- ✅ 512 MB - 1 GB database
- ✅ 100 GB bandwidth/month
- ✅ 750 hours server time/month

### When to Upgrade:
- 📊 **Database > 70% full** → Upgrade to paid tier ($7/mo)
- 🚀 **Slow response times** → Upgrade server ($7/mo)
- 👥 **> 500 daily users** → Consider paid plans
- 💾 **Need long-term data** → PostgreSQL paid (no 90-day delete)

### Upgrade Path:
```
Free Tier → Standard ($7/mo each)
├─ Render Web Service: $7/mo (no spin-down)
├─ Render PostgreSQL: $7/mo (10 GB, no deletion)
├─ MongoDB Atlas: $9/mo (M10 shared cluster)
└─ Total: ~$14-23/month
```

---

## 🎯 Performance Optimization

### Frontend:
- ✅ Code splitting (Vite)
- ✅ Lazy loading routes
- ✅ Optimized images
- ✅ Tailwind CSS (minimal bundle)
- ✅ CDN delivery (Vercel Edge)

### Backend:
- ✅ Database indexing (quizId, score, time)
- ✅ Selective field queries (exclude correct answers)
- ✅ Connection pooling
- ✅ Gzip compression (Express)
- ✅ Health check endpoint

### Database:
- ✅ Indexes on frequently queried fields
- ✅ Separate tables for normalized data (PostgreSQL)
- ✅ Efficient sorting (score DESC, time ASC)

---

## 🛠️ Development Workflow

### Local Development:
```bash
# Terminal 1: Backend
cd server
npm run dev          # Runs on http://localhost:5000

# Terminal 2: Frontend
cd client
npm run dev          # Runs on http://localhost:5173

# Database:
# MongoDB: Local instance or Atlas
# PostgreSQL: (after migration) Local instance

# Seed Data:
cd server
npm run seed
```

### Production Deployment:
```bash
# 1. Commit and push
git add .
git commit -m "Update feature"
git push origin main

# 2. Vercel auto-deploys frontend (~1 min)
# 3. Render auto-deploys backend (~2-3 min)
# 4. Test production URLs
```

---

## 📝 Environment Variables Complete List

### Backend (.env)
```env
# Required
PORT=5000                          # Local: 5000, Render: 10000
ADMIN_SECRET=nexasoul-admin-2026   # Admin panel password
CLIENT_URL=http://localhost:5173   # Frontend URL

# Choose ONE database:
MONGODB_URI=mongodb://...          # For MongoDB
DATABASE_URL=postgresql://...      # For PostgreSQL (after migration)

# Optional
NODE_ENV=development               # Local: development, Render: production
```

### Frontend (.env)
```env
# Required
VITE_API_URL=http://localhost:5000/api    # Local
# VITE_API_URL=https://your-api.onrender.com/api  # Production
```

---

## 🎓 Learning Resources

### Technologies Used:
- **React**: https://react.dev/learn
- **Vite**: https://vitejs.dev/guide/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Express.js**: https://expressjs.com/
- **MongoDB**: https://www.mongodb.com/docs/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Drizzle ORM**: https://orm.drizzle.team/docs/overview
- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs

---

## 📞 Support & Troubleshooting

### Common Issues:
1. **CORS errors** → Check CLIENT_URL matches exactly
2. **Database connection failed** → Verify connection string & IP whitelist
3. **Admin login fails** → Check ADMIN_SECRET (case-sensitive)
4. **No active quiz** → Run `npm run seed`
5. **Port in use** → Kill process or change port in .env

### Getting Help:
- Check `MIGRATION_PLAN.md` for PostgreSQL migration
- Check `DEPLOYMENT_GUIDE.md` for deployment steps
- Review server logs on Render dashboard
- Check browser console for frontend errors

---

**This blueprint provides a complete overview of the system architecture, deployment strategy, and scaling path.** 🚀
