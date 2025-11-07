# 🔧 HealthMate Troubleshooting Guide

## 🐛 Login/Signup Not Working

### Quick Fixes

#### 1. Check Render Logs
1. Go to Render Dashboard: https://dashboard.render.com
2. Click on your service (`healthmate-app`)
3. Click **"Logs"** tab
4. Look for errors

**Common errors to look for:**
- `MongoDB Connection Error` - Database issue
- `CORS error` - Cross-origin issue (should be fixed now)
- `JWT_SECRET is not defined` - Missing environment variable
- `Cannot POST /api/auth/register` - Route not found

---

#### 2. Verify Environment Variables

Go to Render Dashboard → Your Service → Environment

**Required variables:**
```
✅ NODE_ENV=production
✅ PORT=10000
✅ MONGODB_URI=mongodb+srv://2410030087_db_user:poPUH975zejJkazB@cluster0.rchvzyc.mongodb.net/healthmate?retryWrites=true&w=majority&appName=Cluster0
✅ JWT_SECRET=healthmate_secure_secret_key_2024_xyz_production
✅ JWT_EXPIRE=7d
✅ WEATHER_API_KEY=ec4c02871dde552956e03c82be46dad2
```

**If any are missing:**
1. Click "Environment" tab
2. Add the missing variable
3. Service will auto-redeploy

---

#### 3. Test API Endpoint

Open your browser and go to:
```
https://your-app-name.onrender.com/api/health-check
```

**Expected response:**
```json
{
  "status": "OK",
  "message": "HealthMate API is running"
}
```

**If you get 404:** API routes aren't working
**If you get CORS error:** CORS configuration issue (should be fixed)
**If page loads normally:** API is being caught by React router

---

#### 4. Check MongoDB Connection

**In Render Logs, look for:**
```
✅ MongoDB Connected
```

**If you see:**
```
❌ MongoDB Connection Error
```

**Possible causes:**
1. **Wrong connection string** - Verify MONGODB_URI
2. **IP not whitelisted** - Check MongoDB Atlas
3. **Wrong password** - Check credentials

**Fix MongoDB Issues:**
1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Click "Network Access"
3. Verify `0.0.0.0/0` is in the IP Access List
4. If not, click "Add IP Address" → "Allow Access from Anywhere"

---

#### 5. Browser Console Errors

**Open browser console (F12):**

**Common errors:**

**Error:** `Failed to fetch` or `Network Error`
- **Cause:** API not responding
- **Fix:** Check Render logs, verify service is running

**Error:** `401 Unauthorized`
- **Cause:** Invalid credentials
- **Fix:** Check email/password, try signup instead

**Error:** `500 Internal Server Error`
- **Cause:** Backend error
- **Fix:** Check Render logs for details

**Error:** `CORS policy blocked`
- **Cause:** CORS configuration (should be fixed now)
- **Fix:** Redeploy with latest code

---

## 🔄 Redeploy with Fixes

I've just fixed the CORS issue. To deploy the fix:

### Option 1: Automatic (Recommended)
```bash
git add .
git commit -m "Fix CORS and add logging for production"
git push
```
Render will auto-redeploy in 5-10 minutes.

### Option 2: Manual Redeploy
1. Go to Render Dashboard
2. Click your service
3. Click "Manual Deploy" → "Deploy latest commit"

---

## 🧪 Test After Redeployment

1. **Wait for deployment** to complete (status shows "Live")
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Try signup** with a new email
4. **Check Render logs** for any errors

---

## 📊 What Was Fixed

### CORS Configuration
**Before:**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

**After:**
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? true : (process.env.FRONTEND_URL || 'http://localhost:3000'),
  credentials: true
}));
```

This allows all origins in production since frontend and backend are on the same domain.

### Added Request Logging
Now you can see all API requests in Render logs:
```
2024-11-07T10:12:00.000Z - POST /api/auth/register
2024-11-07T10:12:01.000Z - POST /api/auth/login
```

### Added Startup Logging
Shows configuration on startup:
```
🚀 Server running on port 10000
📝 Environment: production
🔗 MongoDB: Connected
🌐 CORS: All origins allowed
```

---

## 🔍 Debugging Steps

### Step 1: Check Service Status
- Go to Render Dashboard
- Service should show **"Live"** in green

### Step 2: Check Logs
Look for these messages:
```
✅ MongoDB Connected
🚀 Server running on port 10000
📝 Environment: production
```

### Step 3: Test Health Check
Visit: `https://your-app.onrender.com/api/health-check`

### Step 4: Test Signup
1. Open app in browser
2. Go to Signup page
3. Fill in details
4. Click "Sign Up"
5. Check browser console (F12) for errors
6. Check Render logs for backend errors

### Step 5: Check Request in Logs
You should see:
```
2024-11-07T10:12:00.000Z - POST /api/auth/register
```

If you don't see this, the request isn't reaching the backend.

---

## 🆘 Still Not Working?

### Collect This Information:

1. **Render Service URL:**
   - Example: `https://healthmate-app.onrender.com`

2. **Error Message:**
   - From browser console (F12)
   - From Render logs

3. **What happens when you try to signup:**
   - Button does nothing?
   - Shows error message?
   - Page refreshes?
   - Loading forever?

4. **Render Logs:**
   - Copy last 50 lines from logs
   - Look for errors in red

5. **Environment Variables:**
   - Verify all 6 are set correctly
   - Check for typos in MONGODB_URI

---

## 💡 Common Solutions

### Issue: "Cannot read property 'token' of undefined"
**Solution:** Backend returned error, check Render logs

### Issue: Button does nothing
**Solution:** JavaScript error, check browser console

### Issue: "User already exists"
**Solution:** Email already registered, try login or different email

### Issue: Page keeps loading
**Solution:** API timeout, check MongoDB connection

### Issue: 404 on API calls
**Solution:** Routes not registered, redeploy

---

## 🔄 Fresh Start (Nuclear Option)

If nothing works:

1. **Delete and recreate service on Render**
2. **Verify all environment variables**
3. **Wait for fresh deployment**
4. **Test with new account**

---

## ✅ Success Indicators

When everything works, you should see:

**In Render Logs:**
```
✅ MongoDB Connected
🚀 Server running on port 10000
📝 Environment: production
🔗 MongoDB: Connected
🌐 CORS: All origins allowed
2024-11-07T10:12:00.000Z - POST /api/auth/register
```

**In Browser:**
- Signup form submits
- Redirects to dashboard
- User is logged in
- No console errors

**In MongoDB Atlas:**
- New user appears in `users` collection
- Database shows activity

---

## 📞 Next Steps

1. **Push the fixes** to GitHub
2. **Wait for Render** to redeploy
3. **Test signup/login** again
4. **Check logs** if still failing

The CORS fix should resolve most login/signup issues! 🎉
