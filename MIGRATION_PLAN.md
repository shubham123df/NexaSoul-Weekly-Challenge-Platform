# PostgreSQL Migration & Render Deployment Plan

## 📋 Overview

This document outlines the step-by-step migration from MongoDB to PostgreSQL and deployment on Render.

---

## 🎯 Phase 1: Database Schema Design (PostgreSQL)

### Current MongoDB Structure → PostgreSQL Relational Schema

#### **Table 1: quizzes**
```sql
- id: UUID (Primary Key)
- title: VARCHAR(255) NOT NULL
- description: TEXT
- duration_minutes: INTEGER DEFAULT 20
- is_active: BOOLEAN DEFAULT FALSE
- submission_deadline: TIMESTAMP
- leaderboard_enabled: BOOLEAN DEFAULT TRUE
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()
```

#### **Table 2: questions**
```sql
- id: UUID (Primary Key)
- quiz_id: UUID (Foreign Key → quizzes.id, ON DELETE CASCADE)
- question_number: INTEGER NOT NULL
- question_text: TEXT NOT NULL
- option_a: VARCHAR(500) NOT NULL
- option_b: VARCHAR(500) NOT NULL
- option_c: VARCHAR(500) NOT NULL
- option_d: VARCHAR(500) NOT NULL
- correct_answer: INTEGER NOT NULL (0-3, representing A-D)
- explanation: TEXT
- created_at: TIMESTAMP DEFAULT NOW()
```

#### **Table 3: submissions**
```sql
- id: UUID (Primary Key)
- quiz_id: UUID (Foreign Key → quizzes.id, ON DELETE CASCADE)
- name: VARCHAR(255) NOT NULL
- uid: VARCHAR(50) NOT NULL
- email: VARCHAR(255) NOT NULL
- mobile: VARCHAR(20) NOT NULL
- department: VARCHAR(100) NOT NULL
- year: VARCHAR(50) NOT NULL
- total_score: INTEGER DEFAULT 0
- correct_count: INTEGER DEFAULT 0
- wrong_count: INTEGER DEFAULT 0
- accuracy: INTEGER DEFAULT 0
- time_taken_seconds: INTEGER DEFAULT 0
- completed_at: TIMESTAMP DEFAULT NOW()
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()

Indexes:
- UNIQUE(quiz_id, email)
- UNIQUE(quiz_id, uid)
- INDEX(quiz_id, total_score DESC, time_taken_seconds ASC)
```

#### **Table 4: answers**
```sql
- id: UUID (Primary Key)
- submission_id: UUID (Foreign Key → submissions.id, ON DELETE CASCADE)
- question_index: INTEGER NOT NULL
- selected_option: INTEGER NOT NULL (0-3)
- is_correct: BOOLEAN NOT NULL
- time_taken_seconds: INTEGER NOT NULL
- bonus_points: INTEGER DEFAULT 0
- points_earned: INTEGER DEFAULT 0
```

---

## 🔧 Phase 2: Technology Stack Changes

### Dependencies to ADD:
```json
{
  "pg": "^8.13.0",              // PostgreSQL client
  "drizzle-orm": "^0.36.0",     // Modern TypeScript/JS ORM (like Mongoose)
  "drizzle-kit": "^0.28.0",     // Database migrations
  "@neondatabase/serverless": "^0.10.0"  // For Render PostgreSQL
}
```

### Dependencies to REMOVE:
```json
{
  "mongoose": "^8.9.3"  // No longer needed
}
```

### Why Drizzle ORM?
- ✅ Lightweight and fast (better than Prisma for this use case)
- ✅ SQL-like syntax (you retain control)
- ✅ Type-safe queries
- ✅ Excellent PostgreSQL support
- ✅ Easy migrations
- ✅ Perfect for Render deployment

---

## 📝 Phase 3: Implementation Steps

### **Step 1: Setup PostgreSQL Locally** (30 mins)
- [ ] Install PostgreSQL on Windows
- [ ] Create database: `nexasoul_quiz`
- [ ] Test connection
- [ ] Update `.env` with PostgreSQL connection string

### **Step 2: Install New Dependencies** (5 mins)
- [ ] `npm install pg drizzle-orm @neondatabase/serverless`
- [ ] `npm install -D drizzle-kit`
- [ ] `npm uninstall mongoose`

### **Step 3: Create Database Schema** (1 hour)
- [ ] Create `server/db/schema.js` (Drizzle schema definitions)
- [ ] Create `server/db/index.js` (Database connection)
- [ ] Create `drizzle.config.js` (Migration config)
- [ ] Generate first migration
- [ ] Run migration to create tables

### **Step 4: Update Models** (2 hours)
- [ ] Delete `server/models/Quiz.js`
- [ ] Delete `server/models/Submission.js`
- [ ] Create `server/models/quizQueries.js` (Quiz database operations)
- [ ] Create `server/models/submissionQueries.js` (Submission operations)

### **Step 5: Update Route Files** (3 hours)
- [ ] Update `server/routes/quiz.js` (All queries)
- [ ] Update `server/routes/admin.js` (All queries)
- [ ] Update `server/routes/leaderboard.js` (All queries)
- [ ] Update `server/routes/analytics.js` (All queries)

### **Step 6: Update Seed Script** (30 mins)
- [ ] Rewrite `server/seed/seedQuestions.js` for PostgreSQL
- [ ] Test seeding with new schema
- [ ] Verify data integrity

### **Step 7: Update Server Entry** (15 mins)
- [ ] Update `server/index.js` (Remove MongoDB connection)
- [ ] Add PostgreSQL connection test
- [ ] Update CORS if needed

### **Step 8: Test Everything** (1 hour)
- [ ] Test user registration flow
- [ ] Test quiz submission
- [ ] Test leaderboard
- [ ] Test admin panel
- [ ] Test analytics export
- [ ] Test all edge cases

---

## 🚀 Phase 4: Render Deployment Blueprint

### **Project Structure for Render**
```
NexaSoul Weekly Challenge Platform/
├── client/                  # Frontend (deploy separately)
├── server/                  # Backend (deploy to Render)
│   ├── db/
│   │   ├── index.js        # PostgreSQL connection
│   │   └── schema.js       # Drizzle schema
│   ├── models/             # Database queries
│   ├── routes/             # API routes
│   ├── middleware/         # Admin auth
│   ├── seed/               # Seed script
│   ├── drizzle.config.js   # Migration config
│   ├── package.json
│   ├── index.js
│   └── render.yaml         # Render config
└── README.md
```

### **Render Configuration Files**

#### **1. `server/render.yaml`**
```yaml
services:
  - type: web
    name: nexasoul-quiz-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: DATABASE_URL
        fromDatabase:
          name: nexasoul-db
          property: connectionString
      - key: ADMIN_SECRET
        generateValue: true
      - key: CLIENT_URL
        value: https://your-frontend-domain.com

databases:
  - name: nexasoul-db
    databaseName: nexasoul_quiz
    ipAllowList: []  # Allow all (Render internal)
```

#### **2. `server/.env.production`**
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://user:password@host:5432/nexasoul_quiz
ADMIN_SECRET=your-secure-secret-key
CLIENT_URL=https://your-frontend-domain.com
```

#### **3. `client/.env.production`**
```env
VITE_API_URL=https://nexasoul-quiz-api.onrender.com/api
```

### **Render Deployment Steps**

#### **Step 1: Prepare Repository** (30 mins)
- [ ] Initialize Git (if not already)
- [ ] Create `.gitignore` with proper exclusions
- [ ] Add `render.yaml` to server directory
- [ ] Push to GitHub

#### **Step 2: Create PostgreSQL Database on Render** (10 mins)
- [ ] Go to Render Dashboard → New PostgreSQL
- [ ] Name: `nexasoul-db`
- [ ] Region: Choose closest to users (India if available)
- [ ] Copy connection string

#### **Step 3: Deploy Backend API** (15 mins)
- [ ] New Web Service on Render
- [ ] Connect GitHub repository
- [ ] Root Directory: `server`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Add Environment Variables:
  - `DATABASE_URL` (from Step 2)
  - `ADMIN_SECRET` (generate secure key)
  - `CLIENT_URL` (your frontend URL)
  - `NODE_ENV=production`

#### **Step 4: Run Database Migrations** (10 mins)
- [ ] SSH into Render service or use console
- [ ] Run: `npm run db:migrate`
- [ ] Run: `npm run seed` (seed initial quiz data)

#### **Step 5: Deploy Frontend** (15 mins)
- [ ] Option A: Vercel (recommended for React)
  - Connect GitHub
  - Root Directory: `client`
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Add Environment Variable: `VITE_API_URL`
  
- [ ] Option B: Render Static Site
  - Same steps as above
  - Update `CLIENT_URL` on backend

#### **Step 6: Test Production** (30 mins)
- [ ] Verify API health endpoint
- [ ] Test full user flow
- [ ] Test admin panel
- [ ] Check database connection
- [ ] Monitor logs

---

## 💰 Render Pricing (Free Tier)

### **Free Tier Includes:**
- ✅ **PostgreSQL**: 1 GB storage, 90-day retention
- ✅ **Web Service**: 750 hours/month (enough for 1 service)
- ✅ **Static Sites**: Unlimited (for frontend)
- ✅ **Bandwidth**: 100 GB/month

### **Limitations:**
- ⚠️ Web services spin down after 15 mins inactivity (30s cold start)
- ⚠️ PostgreSQL deletes after 90 days on free tier
- ⚠️ Limited to 1 GB database storage

### **Upgrade Path (if needed):**
- **PostgreSQL Standard**: $7/month (10 GB, no auto-delete)
- **Web Service Standard**: $7/month (no spin-down)

---

## 📊 Migration Complexity & Timeline

### **Estimated Time: 8-10 hours**

| Phase | Task | Time |
|-------|------|------|
| 1 | Schema Design | 1 hour |
| 2 | Install Dependencies | 30 mins |
| 3 | Create Schema & Migrations | 1.5 hours |
| 4 | Update Models | 2 hours |
| 5 | Update Routes | 3 hours |
| 6 | Update Seed Script | 30 mins |
| 7 | Testing | 1 hour |
| 8 | Render Deployment | 2 hours |

### **Difficulty Level: Medium-High**
- Requires understanding of SQL vs NoSQL
- Need to rewrite all queries
- Must handle relational data properly
- Testing is critical

---

## ⚠️ Important Considerations

### **Breaking Changes:**
1. **Object IDs → UUIDs**: All MongoDB `_id` fields become UUIDs
2. **Nested Arrays → Separate Tables**: Questions and answers normalized
3. **Query Syntax**: All Mongoose queries become SQL via Drizzle
4. **Data Types**: Some type conversions needed

### **Performance Improvements:**
- ✅ Better complex queries (JOINs, aggregations)
- ✅ ACID compliance
- ✅ Stronger data integrity
- ✅ Better for relational data

### **Potential Issues:**
- ⚠️ JSON queries more complex in SQL
- ⚠️ Need to handle migrations carefully
- ⚠️ Learning curve for SQL/Drizzle

---

## 🔄 Alternative: Keep MongoDB + Deploy on Render

If PostgreSQL migration seems too complex, you can:

### **Option: MongoDB Atlas + Render**
- ✅ Keep existing code (no migration)
- ✅ MongoDB Atlas free tier (512 MB)
- ✅ Deploy backend on Render
- ✅ Much faster deployment (1-2 hours total)
- ✅ No risk of breaking changes

**This might be better if:**
- You need to deploy quickly
- Current MongoDB setup works well
- No specific PostgreSQL requirements

---

## ✅ Decision Checklist

**Choose PostgreSQL if:**
- [ ] You need complex relational queries
- [ ] You want ACID compliance
- [ ] You prefer SQL over NoSQL
- [ ] You're willing to invest 8-10 hours
- [ ] You want to learn PostgreSQL/Drizzle

**Keep MongoDB if:**
- [ ] You need fast deployment
- [ ] Current system works fine
- [ ] You prefer document-based storage
- [ ] You want to avoid migration risks
- [ ] Time is a constraint

---

## 📞 Next Steps

1. **Review this plan carefully**
2. **Decide: PostgreSQL OR Keep MongoDB**
3. **If PostgreSQL:**
   - Install PostgreSQL locally
   - Confirm ready to start migration
   - I'll begin step-by-step implementation
4. **If MongoDB:**
   - I'll create Render deployment guide for MongoDB
   - Much simpler and faster

**What would you like to proceed with?** 🚀
