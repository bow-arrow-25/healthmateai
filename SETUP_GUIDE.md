# HealthMate Setup Guide

## Quick Start (5 Minutes)

### Step 1: Install MongoDB
**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install with default settings
3. MongoDB will run automatically as a service

**Or use MongoDB Atlas (Cloud - Free):**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a cluster
4. Get connection string and use it in `.env`

### Step 2: Backend Setup
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env file with your settings (optional - works with defaults)
# For Windows: notepad .env
# For VS Code: code .env

# Start backend server
npm run dev
```

Backend will run on: `http://localhost:5000`

### Step 3: Frontend Setup
Open a NEW terminal window:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

Frontend will open automatically at: `http://localhost:3000`

## ✅ Verification

1. Backend running: Visit `http://localhost:5000/api/health-check`
   - Should see: `{"status":"OK","message":"HealthMate API is running"}`

2. Frontend running: Visit `http://localhost:3000`
   - Should see the HealthMate homepage

## 🎯 First Steps

1. **Sign Up**: Click "Get Started Free" or "Sign Up"
2. **Create Account**: Fill in your details
3. **Try Symptom Checker**: Works without login!
4. **After Login**: Access full dashboard with all features

## 📝 Environment Variables (Optional)

### Backend `.env` Configuration

```env
# Server
PORT=5000

# Database (use one of these)
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/healthmate

# OR MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthmate

# Security
JWT_SECRET=your_secret_key_change_this_in_production
JWT_EXPIRE=7d

# Weather API (Optional - works without it)
WEATHER_API_KEY=get_from_openweathermap.org

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## 🔧 Troubleshooting

### MongoDB Connection Error
**Error**: `MongooseServerSelectionError`

**Solution**:
1. Check if MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   ```
2. Or use MongoDB Atlas (cloud) instead

### Port Already in Use
**Error**: `Port 5000 is already in use`

**Solution**: Change PORT in backend `.env` to 5001 or any available port

### Frontend Can't Connect to Backend
**Error**: `Network Error` or `CORS Error`

**Solution**:
1. Make sure backend is running on port 5000
2. Check `proxy` in `frontend/package.json` points to `http://localhost:5000`

### Module Not Found
**Error**: `Cannot find module`

**Solution**: Delete `node_modules` and reinstall:
```bash
rm -rf node_modules
npm install
```

## 🚀 Production Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables in hosting platform
2. Ensure MongoDB Atlas connection string is set
3. Deploy backend code

### Frontend (Vercel/Netlify)
1. Build the app: `npm run build`
2. Deploy the `build` folder
3. Set environment variable for backend API URL

## 📱 Features to Test

1. **Symptom Checker** (No login required)
   - Add symptoms like "headache", "fever"
   - Set severity and duration
   - Get instant recommendations

2. **User Registration & Login**
   - Create account
   - Login with credentials

3. **Dashboard** (After login)
   - View health score
   - See recent activity
   - Get personalized insights

4. **Medicines**
   - Add medicines with reminders
   - Set custom times
   - Track active medications

5. **Prescriptions**
   - Upload prescription photo
   - View extracted medicines
   - Add to medicine list

6. **Diet Tracking**
   - Log meals and water intake
   - View nutrition analysis
   - Get dietary recommendations

7. **Profile**
   - Update personal information
   - Add existing conditions
   - Manage allergies

## 🎨 Customization

### Change Theme Colors
Edit `frontend/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color',
        // ...
      }
    }
  }
}
```

### Add New Symptoms
Edit `backend/routes/symptoms.js` - `symptomDatabase` object

### Add New Medicines
Edit `backend/routes/medicines.js` - `medicineDatabase` object

## 📚 API Documentation

### Public Endpoints
- `POST /api/symptoms/check` - Check symptoms (no auth)
- `GET /api/symptoms/suggestions` - Get symptom suggestions
- `GET /api/weather/current` - Get weather data

### Protected Endpoints (Require JWT Token)
- `GET /api/health/dashboard` - User dashboard
- `GET /api/medicines` - Get user medicines
- `POST /api/medicines` - Add medicine
- `POST /api/prescriptions/upload` - Upload prescription
- `GET /api/diet` - Get diet logs
- `POST /api/diet` - Add diet log

## 🔐 Security Notes

1. **Change JWT_SECRET** in production
2. **Use HTTPS** in production
3. **Enable CORS** only for trusted domains
4. **Validate all inputs** on backend
5. **Use MongoDB Atlas** with IP whitelist

## 💡 Tips

1. **Development**: Use `npm run dev` for auto-restart on changes
2. **Testing**: Create test accounts with different health profiles
3. **Data**: MongoDB Compass is great for viewing database
4. **Debugging**: Check browser console and backend terminal for errors

## 📞 Need Help?

Common issues and solutions are in the main README.md file.

---

**Happy Health Tracking! 🏥💊🥗**
