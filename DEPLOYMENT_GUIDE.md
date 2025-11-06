# HealthMate Deployment Guide

This guide will help you deploy both the frontend and backend of HealthMate so your friends can access it online.

## 📋 Prerequisites

- [x] Netlify CLI installed (already done!)
- [ ] GitHub account
- [ ] Netlify account (free)
- [ ] Render account (free) or MongoDB Atlas account
- [ ] Your project pushed to GitHub

## 🚀 Deployment Steps

### Step 1: Push Your Code to GitHub

1. Create a new repository on GitHub
2. Push your code:
```bash
cd "c:\Users\samud\OneDrive\Desktop\FEDF PROJECT\HealthMate-Symptom-Checker"
git init
git add .
git commit -m "Initial commit - HealthMate"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy Backend to Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: healthmate-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `MONGODB_URI` = Your MongoDB connection string (see below)
   - `JWT_SECRET` = Generate a random secure string
   - `JWT_EXPIRE` = `7d`
   - `WEATHER_API_KEY` = `ec4c02871dde552956e03c82be46dad2`
   - `FRONTEND_URL` = (Leave blank for now, will update after frontend deployment)

6. Click "Create Web Service"
7. **IMPORTANT**: Copy your backend URL (e.g., `https://healthmate-backend.onrender.com`)

### Step 3: Set Up MongoDB Atlas (Free Database)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free tier
3. Create a new cluster (M0 Free tier)
4. Create a database user with username and password
5. Whitelist all IPs: Add `0.0.0.0/0` to IP Access List
6. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/healthmate`)
7. Update the `MONGODB_URI` environment variable in Render with this connection string

### Step 4: Deploy Frontend to Netlify

1. Update the backend URL in `.env.production`:
```bash
# In frontend/.env.production
REACT_APP_API_URL=https://healthmate-backend.onrender.com
```
Replace with your actual Render backend URL from Step 2.

2. Build and deploy:
```bash
cd frontend
npm run build
netlify deploy --prod
```

3. Follow the prompts:
   - Authorize Netlify CLI (opens browser)
   - Create & configure a new site
   - Choose a site name (e.g., healthmate-symptom-checker)
   - Publish directory: `build`

4. **IMPORTANT**: Copy your frontend URL (e.g., `https://healthmate-symptom-checker.netlify.app`)

### Step 5: Update Backend CORS Settings

1. Go back to Render dashboard
2. Update the `FRONTEND_URL` environment variable with your Netlify URL
3. The backend will automatically restart

## ✅ Testing Your Deployment

1. Visit your Netlify URL
2. Create a new account
3. Test all features:
   - Symptom checker
   - Medicine reminders
   - Prescription upload
   - Diet tracking
   - Dashboard

## 🔧 Troubleshooting

### Backend Issues
- **500 errors**: Check Render logs for database connection issues
- **CORS errors**: Ensure `FRONTEND_URL` is set correctly in Render

### Frontend Issues
- **API not connecting**: Verify `REACT_APP_API_URL` in `.env.production`
- **Build fails**: Run `npm run build` locally to check for errors

### Database Issues
- **Connection timeout**: Check MongoDB Atlas IP whitelist
- **Authentication failed**: Verify username/password in connection string

## 📱 Share with Friends

Once deployed, share your Netlify URL with your friends:
```
https://your-site-name.netlify.app
```

They can:
- Create their own accounts
- Track symptoms and medications
- Upload prescriptions
- Monitor their health data

## 🔄 Updating Your App

To deploy updates:

**Frontend:**
```bash
cd frontend
npm run build
netlify deploy --prod
```

**Backend:**
Just push to GitHub - Render will auto-deploy!

## 💡 Tips

- **Free tier limits**: 
  - Render: 750 hours/month (enough for 24/7)
  - Netlify: 100GB bandwidth/month
  - MongoDB Atlas: 512MB storage

- **Custom domain**: Both Netlify and Render support custom domains in free tier

- **HTTPS**: Both platforms provide free SSL certificates automatically

## 🆘 Need Help?

If you encounter issues:
1. Check the logs in Render dashboard
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
