# 🚀 Quick Backend Deployment Guide

## Step 1: Create GitHub Repository (Required for Render)

1. Go to: https://github.com/new
2. Repository name: `HealthMate-Symptom-Checker`
3. Make it **Public**
4. **DO NOT** check any boxes
5. Click "Create repository"

## Step 2: Push Code to GitHub

Run these commands:
```bash
git remote set-url origin https://github.com/bow-arrow-25/HealthMate-Symptom-Checker.git
git push -u origin main
```

## Step 3: Set Up MongoDB Atlas (Free Database)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (use Google/GitHub for faster signup)
3. Create FREE M0 cluster:
   - Cloud Provider: AWS
   - Region: Choose closest to you
   - Cluster Name: HealthMate
4. Create Database User:
   - Username: `healthmate`
   - Password: Generate secure password (SAVE THIS!)
5. Network Access:
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm
6. Get Connection String:
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `myFirstDatabase` with `healthmate`
   - Example: `mongodb+srv://healthmate:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/healthmate`

## Step 4: Deploy Backend to Render

1. Go to: https://render.com/
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Click "Connect account" to connect GitHub
5. Select your `HealthMate-Symptom-Checker` repository
6. Configure:
   - **Name**: `healthmate-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

7. Add Environment Variables (click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV = production
   PORT = 10000
   MONGODB_URI = [paste your MongoDB connection string from Step 3]
   JWT_SECRET = [generate random string, e.g., healthmate2024secret]
   JWT_EXPIRE = 7d
   WEATHER_API_KEY = ec4c02871dde552956e03c82be46dad2
   FRONTEND_URL = [leave blank for now]
   ```

8. Click "Create Web Service"
9. Wait 5-10 minutes for deployment
10. **COPY YOUR BACKEND URL** (e.g., `https://healthmate-backend.onrender.com`)

## Step 5: Update Frontend with Backend URL

1. Edit `frontend/.env.production`:
   ```
   REACT_APP_API_URL=https://YOUR-BACKEND-URL.onrender.com
   ```

2. Rebuild and redeploy:
   ```bash
   cd frontend
   npm run build
   netlify deploy --prod --dir=build
   ```

## Step 6: Update Backend with Frontend URL

1. Go back to Render dashboard
2. Find your backend service
3. Go to "Environment"
4. Update `FRONTEND_URL` with your Netlify URL
5. Service will auto-restart

## ✅ Done!

Your app is now fully deployed and accessible to your friends!

**Frontend URL**: Your Netlify URL
**Backend URL**: Your Render URL

Share the frontend URL with your friends!
