# Deployment Instructions

## Deploy to Vercel (Frontend)

### Option 1: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository: `https://github.com/shubham123df/NexaSoul-Weekly-Challenge-Platform`
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   - `VITE_API_URL`: Your backend API URL (e.g., https://your-backend.onrender.com)
6. Click "Deploy"

### Option 2: Via Vercel CLI

If you prefer using CLI, install it first:
```bash
npm install -g vercel
```

Then run:
```bash
cd client
vercel
```

Follow the prompts to deploy.

## Deploy Backend (Render)

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `CLIENT_URL`: Your Vercel frontend URL
   - `ADMIN_SECRET`: nexasoul-admin-2026
6. Click "Deploy Web Service"

## MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP address (0.0.0.0/0 for all IPs)
5. Get your connection string and use it in Render environment variables

## Post-Deployment

1. After both are deployed, update your Vercel environment variable `VITE_API_URL` with your Render backend URL
2. Redeploy Vercel to apply the changes
3. Test the application by visiting your Vercel URL
