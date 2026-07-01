# 🚀 Render Deployment Guide - Single Service (Frontend + Backend)

## ✅ **What's Been Done:**

Your code is now configured to serve **both frontend and backend from a single Render service!**

**Changes Made:**
- ✅ Backend now serves frontend static files in production
- ✅ All non-API routes redirect to React app (for client-side routing)
- ✅ render.yaml updated for single service deployment
- ✅ One URL serves everything!

---

## 📋 **Complete Deployment Steps**

### **Step 1: Push Updated Code to GitHub**

```powershell
cd "c:\Users\krish\OneDrive\Desktop\NexaSoul Weekly Challenge Platform"
git add .
git commit -m "feat: Configure single service deployment for Render"
git -c http.sslVerify=false push origin master
```

---

### **Step 2: Create PostgreSQL Database on Render**

1. Go to **https://dashboard.render.com**
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name:** `nexasoul-db`
   - **Database:** `nexasoul_quiz`
   - **Region:** Oregon (or closest to you)
   - **Plan:** Free
4. Click **"Create PostgreSQL"**
5. **Wait 2-3 minutes** for it to be ready
6. **Copy the Internal Connection String** (you'll need it later)

---

### **Step 3: Deploy Web Service**

1. Go to **https://dashboard.render.com**
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `shubham123df/NexaSoul-Weekly-Challenge-Platform`
4. Configure:
   - **Name:** `nexasoul-quiz-app`
   - **Root Directory:** `.` (leave as root)
   - **Build Command:** `cd client && npm install && npm run build && cd ../server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Instance Type:** Free
   - **Branch:** `master`

5. **Add Environment Variables:**
   ```
   NODE_ENV = production
   PORT = 10000
   ADMIN_SECRET = nexasoul-admin-2026
   ```

6. **Link PostgreSQL Database:**
   - Scroll down to "Databases" section
   - Click "Add Database"
   - Select `nexasoul-db`
   - The `DATABASE_URL` will be automatically added

7. Click **"Create Web Service"**
8. **Wait 5-7 minutes** for deployment (it needs to build frontend + backend)

---

### **Step 4: Verify Deployment**

Test the API health check:
```
GET https://nexasoul-quiz-app.onrender.com/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "message": "NexaSoul Quiz API - PostgreSQL"
}
```

Test the frontend:
```
GET https://nexasoul-quiz-app.onrender.com/
```

**Expected:** Your React app loads!

---

### **Step 5: Seed the Database**

After deployment is successful:

1. Go to your Web Service on Render Dashboard
2. Click **"Shell"** (in the top menu)
3. Run the migration and seed commands:

```bash
# First, run migrations (if any)
npm run db:migrate

# Then seed the database with quiz questions
npm run seed
```

**Expected output:**
```
Connecting to PostgreSQL...
Clearing existing data...
Creating quiz...
Created quiz: NexaSoul Frontend Trivia Challenge – Week 1 (ID: xxx)
Adding questions...
✅ Seeded quiz with 20 questions
```

---

### **Step 6: Test Full Application**

1. **Visit your app URL:**
   ```
   https://nexasoul-quiz-app.onrender.com
   ```

2. **Test the flow:**
   - ✅ Landing page loads
   - ✅ Click "Start Quiz" → Registration page
   - ✅ Register with your details
   - ✅ Read instructions
   - ✅ Take the quiz (20 questions)
   - ✅ Submit quiz
   - ✅ View results
   - ✅ Check leaderboard

3. **Test Admin Panel:**
   ```
   https://nexasoul-quiz-app.onrender.com/admin
   ```
   - Password: `nexasoul-admin-2026`
   - View submissions
   - Check analytics
   - Export data

---

## 📊 **Environment Variables Reference**

### **Required Environment Variables:**

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://... (auto-provided by Render)
ADMIN_SECRET=nexasoul-admin-2026
```

**Note:** You don't need `CLIENT_URL` anymore since frontend and backend are on the same domain!

---

## 🎯 **URL Structure**

**Single Service - One URL:**
```
https://nexasoul-quiz-app.onrender.com/                    → Frontend
https://nexasoul-quiz-app.onrender.com/api/health          → Backend API
https://nexasoul-quiz-app.onrender.com/api/quiz/active     → Quiz endpoint
https://nexasoul-quiz-app.onrender.com/admin               → Admin panel
```

---

## ⚠️ **Troubleshooting**

### **Issue: "Failed to connect to PostgreSQL"**

**Solution:**
- Check that PostgreSQL service is running
- Verify `DATABASE_URL` is set in environment variables
- Check PostgreSQL connection string format

### **Issue: "No active quiz available"**

**Solution:**
```bash
# In Render Shell
npm run seed
```

### **Issue: Frontend shows blank page**

**Solution:**
- Check browser console for errors
- Verify build completed successfully
- Check Render logs: `Dashboard → Your Service → Logs`

### **Issue: "Cannot find module '../client/dist/index.html'"**

**Solution:**
- Frontend build failed
- Check build logs for errors
- Rebuild: `Dashboard → Your Service → Manual Deploy → Deploy latest commit`

---

## 💰 **Render Free Tier Limits**

### **PostgreSQL (Free):**
- ✅ 1 GB storage
- ✅ 90-day retention (data deleted after 90 days)
- ✅ Shared CPU

### **Web Service (Free):**
- ✅ 750 hours/month
- ✅ 512 MB RAM
- ⚠️ Spins down after 15 min inactivity (30s cold start)

### **Upgrade Path:**
- **PostgreSQL Standard:** $7/month (no 90-day deletion)
- **Web Service Standard:** $7/month (no spin-down)

---

## 🔄 **Auto-Deploy on Git Push**

Render automatically deploys when you push to GitHub!

```powershell
# Make changes
git add .
git commit -m "feat: Add new feature"
git push origin master

# Render will automatically:
# 1. Detect the push
# 2. Run build command
# 3. Deploy new version
```

**Monitor deployment:**
- Dashboard → Your Service → Deploys
- View real-time logs

---

## 📈 **Monitoring & Logs**

### **View Logs:**
1. Go to Render Dashboard
2. Click your Web Service
3. Click **"Logs"** tab
4. See real-time application logs

### **Check Health:**
```
GET https://nexasoul-quiz-app.onrender.com/api/health
```

### **Database Metrics:**
- PostgreSQL Dashboard → Metrics
- View connections, queries, storage

---

## 🆘 **Need Help?**

- **Render Docs:** https://render.com/docs
- **PostgreSQL on Render:** https://render.com/docs/databases
- **Node.js Guide:** https://render.com/docs/deploy-node-express-app

---

## ✅ **Success Indicators**

Your deployment is successful when:

1. ✅ Backend health check returns `{"status":"ok"}`
2. ✅ Frontend loads at root URL
3. ✅ Can register for quiz
4. ✅ Can take quiz and submit
5. ✅ Leaderboard shows data
6. ✅ Admin panel works
7. ✅ Analytics export works
8. ✅ All routes work (no 404 errors)

---

## 🎉 **You're Done!**

Your app is now live at:
```
https://nexasoul-quiz-app.onrender.com
```

**Share this URL with users!**

---

## 📝 **Quick Reference Commands**

### **In Render Shell:**

```bash
# Check database connection
npm run db:migrate

# Seed database
npm run seed

# View logs (automatic in Render dashboard)

# Restart service
# Click "Manual Deploy" → "Deploy latest commit"
```

### **Local Development:**

```powershell
# Build frontend
cd client
npm run build

# Start backend (serves frontend)
cd ../server
npm run dev

# Visit http://localhost:5000
```

---

**Your single service is ready to deploy!** 🚀
