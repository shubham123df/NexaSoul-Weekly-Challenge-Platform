# 🚀 Render Deployment Guide - Quick Start

## Option 1: MongoDB (Recommended - Fast & Easy)

### Deploy in 30 Minutes

#### **Step 1: Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/nexasoul-quiz.git
git push -u origin main
```

#### **Step 2: Create MongoDB Atlas Database**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create new cluster (M0 Free tier)
4. Create database user (username + password)
5. Whitelist IP: `0.0.0.0/0` (allow all)
6. Get connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/nexasoul-quiz
   ```

#### **Step 3: Deploy Backend on Render**
1. Go to https://render.com
2. Sign up with GitHub
3. **New → Web Service**
4. Connect your repository
5. Configure:
   - **Name:** `nexasoul-quiz-api`
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     ```
     NODE_ENV = production
     PORT = 10000
     MONGODB_URI = mongodb+srv://user:pass@cluster0.../nexasoul-quiz
     ADMIN_SECRET = nexasoul-admin-2026
     CLIENT_URL = https://your-frontend-domain.com
     ```
6. Click **Create Web Service**
7. Wait 2-3 minutes for deployment
8. Copy your backend URL: `https://nexasoul-quiz-api.onrender.com`

#### **Step 4: Deploy Frontend on Vercel**
1. Go to https://vercel.com
2. Sign up with GitHub
3. **New Project** → Import your repo
4. Configure:
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:**
     ```
     VITE_API_URL = https://nexasoul-quiz-api.onrender.com/api
     ```
5. Click **Deploy**
6. Copy your frontend URL

#### **Step 5: Update Backend**
1. Go back to Render dashboard
2. Edit `CLIENT_URL` environment variable
3. Set it to your Vercel frontend URL
4. Save and redeploy

#### **Step 6: Seed Database**
1. Go to Render → Your service → Shell
2. Run:
   ```bash
   npm run seed
   ```
3. Verify: Visit `/api/health` endpoint

---

## Option 2: PostgreSQL (Advanced - Requires Migration)

See `MIGRATION_PLAN.md` for complete details.

### Quick Overview:
1. **Migrate locally first** (8-10 hours)
2. **Test everything**
3. **Deploy to Render** using `render.yaml`
4. **Run migrations** on Render
5. **Seed database**

---

## 📋 Environment Variables Reference

### Backend (Render)
```env
NODE_ENV=production
PORT=10000

# For MongoDB:
MONGODB_URI=mongodb+srv://user:pass@cluster0.../nexasoul-quiz

# For PostgreSQL (after migration):
DATABASE_URL=postgresql://user:pass@host:5432/nexasoul_quiz

ADMIN_SECRET=your-secure-secret
CLIENT_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```env
VITE_API_URL=https://nexasoul-quiz-api.onrender.com/api
```

---

## 🔍 Testing Deployment

### 1. Health Check
```
GET https://your-api.onrender.com/api/health
Expected: {"status":"ok","message":"NexaSoul Quiz API"}
```

### 2. Get Active Quiz
```
GET https://your-api.onrender.com/api/quiz/active
Expected: Quiz data (without correct answers)
```

### 3. Get Leaderboard
```
GET https://your-api.onrender.com/api/leaderboard/active/top?limit=10
Expected: Array of top performers
```

---

## ⚠️ Common Issues

### 1. CORS Errors
- Make sure `CLIENT_URL` is set correctly on Render
- Check it matches your frontend URL exactly

### 2. Database Connection Failed
- **MongoDB:** Check IP whitelist (should be `0.0.0.0/0`)
- **PostgreSQL:** Check `DATABASE_URL` format

### 3. "No active quiz" Error
- Run seed script in Render Shell: `npm run seed`

### 4. Admin Login Fails
- Verify `ADMIN_SECRET` environment variable is set
- Must match exactly (case-sensitive)

---

## 💡 Pro Tips

1. **Use MongoDB Atlas** for easier setup
2. **Enable Render auto-deploy** on git push
3. **Use Vercel for frontend** (faster, better optimized)
4. **Set up custom domains** (optional)
5. **Monitor logs** in Render dashboard
6. **Keep free tier limits** in mind

---

## 🆘 Need Help?

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas:** https://www.mongodb.com/docs/atlas/

---

**Ready to deploy? Start with Option 1 (MongoDB) for fastest results!** 🚀
