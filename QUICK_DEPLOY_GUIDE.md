# 🚀 Quick Deploy Guide - HealthMate

## ⚡ Deploy in 3 Steps (15 minutes)

### Step 1: MongoDB Atlas (5 min)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up → Create FREE M0 cluster
3. Database Access → Add User:
   - Username: `healthmate_admin`
   - Password: (generate strong password)
4. Network Access → Add IP: `0.0.0.0/0`
5. Connect → Get connection string:
   ```
   mongodb+srv://healthmate_admin:PASSWORD@cluster.mongodb.net/healthmate?retryWrites=true&w=majority
   ```
   **SAVE THIS!** ⚠️

---

### Step 2: Push to GitHub (3 min)
```bash
cd "c:\Users\samud\OneDrive\Desktop\FEDF PROJECT\HealthMate-Symptom-Checker"
git init
git add .
git commit -m "Deploy HealthMate"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/healthmate-app.git
git push -u origin main
```

---

### Step 3: Deploy on Render (7 min)
1. Go to https://render.com → Sign up with GitHub
2. New + → Web Service → Connect your repo
3. Configure:
   - **Name**: `healthmate-app`
   - **Build Command**: 
     ```
     npm install && cd backend && npm install && cd ../frontend && npm install && npm run build
     ```
   - **Start Command**: 
     ```
     node backend/server.js
     ```
   - **Environment Variables**:
     ```
     NODE_ENV=production
     PORT=10000
     MONGODB_URI=<your-mongodb-connection-string>
     JWT_SECRET=healthmate_secret_xyz_2024
     JWT_EXPIRE=7d
     WEATHER_API_KEY=ec4c02871dde552956e03c82be46dad2
     ```
4. Click **Create Web Service**
5. Wait 5-10 minutes for deployment

---

## ✅ Done!

Your app will be live at:
**`https://healthmate-app.onrender.com`**

### Default Login (after running resetDatabase.js):
- Email: `admin@healthmate.com`
- Password: `Admin@123`

Or create a new account through the signup page!

---

## 🔄 Update Your App

```bash
git add .
git commit -m "Update"
git push
```
Render auto-deploys! 🎉

---

## 🐛 Troubleshooting

**Build fails?**
- Check Render logs
- Verify all environment variables

**Database error?**
- Check MongoDB URI
- Verify IP whitelist (0.0.0.0/0)

**App slow on first load?**
- Normal! Free tier sleeps after 15 min
- Takes ~30 sec to wake up

---

## 📱 Share Your App

Send friends: `https://your-app-name.onrender.com`

They can:
- Create accounts
- Track health
- Manage medications
- Upload prescriptions

---

**Need detailed help?** See `DEPLOY_INSTRUCTIONS.md`
