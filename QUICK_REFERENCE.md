# HealthMate - Quick Reference Card

## 🚀 Quick Start Commands

### First Time Setup
```bash
# Run the setup script (Windows)
START_HERE.bat

# OR manually:
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
App opens at: `http://localhost:3000`

## 📁 Project Structure

```
HealthMate-Symptom-Checker/
├── backend/           # Express API server
├── frontend/          # React application
├── README.md          # Full documentation
├── SETUP_GUIDE.md     # Detailed setup instructions
├── PROJECT_SUMMARY.md # Feature overview
└── START_HERE.bat     # Windows quick start
```

## 🔑 Key Features

| Feature | Description | Login Required |
|---------|-------------|----------------|
| Symptom Checker | Check symptoms & get recommendations | ❌ No |
| Dashboard | Health overview & insights | ✅ Yes |
| Medicines | Track medications & reminders | ✅ Yes |
| Prescriptions | Upload & OCR extraction | ✅ Yes |
| Diet Tracker | Nutrition monitoring | ✅ Yes |
| Profile | Manage health information | ✅ Yes |

## 🌐 API Endpoints

### Public
- `POST /api/auth/register` - Sign up
- `POST /api/auth/login` - Sign in
- `POST /api/symptoms/check` - Check symptoms
- `GET /api/weather/current` - Get weather

### Protected (Requires JWT)
- `GET /api/health/dashboard` - Dashboard data
- `GET /api/medicines` - Get medicines
- `POST /api/medicines` - Add medicine
- `POST /api/prescriptions/upload` - Upload prescription
- `GET /api/diet` - Get diet logs
- `POST /api/diet` - Add diet log

## 🔧 Configuration Files

### Backend `.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthmate
JWT_SECRET=your_secret_key
WEATHER_API_KEY=optional
```

### Frontend `package.json`
```json
{
  "proxy": "http://localhost:5000"
}
```

## 🎨 Tech Stack

**Frontend:**
- React 18
- React Router v6
- TailwindCSS
- Framer Motion
- Axios
- Lucide React

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JWT & Bcrypt
- Tesseract.js (OCR)
- Node-cron
- Multer

## 📊 Database Collections

1. `users` - User accounts
2. `medicines` - Medications
3. `prescriptions` - Uploaded prescriptions
4. `symptomlogs` - Symptom history
5. `dietlogs` - Diet tracking
6. `reminders` - Medicine reminders

## 🐛 Common Issues & Fixes

### MongoDB Not Running
```bash
# Windows
net start MongoDB

# Or use MongoDB Atlas (cloud)
```

### Port Already in Use
Change `PORT` in `backend/.env` to 5001

### Dependencies Error
```bash
# Delete and reinstall
rm -rf node_modules
npm install
```

### CORS Error
Ensure backend is running on port 5000

## 📱 User Flow

1. **Visit Homepage** → See features
2. **Try Symptom Checker** → No login needed
3. **Sign Up** → Create account
4. **Dashboard** → View health overview
5. **Add Medicines** → Set reminders
6. **Upload Prescription** → Auto-extract medicines
7. **Track Diet** → Get recommendations
8. **Update Profile** → Add conditions

## 🎯 Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend opens in browser
- [ ] Can access symptom checker
- [ ] Can sign up new user
- [ ] Can login
- [ ] Dashboard loads
- [ ] Can add medicine
- [ ] Can upload prescription
- [ ] Can log diet
- [ ] Can update profile

## 🔐 Security Notes

- ✅ Passwords are hashed
- ✅ JWT tokens expire in 7 days
- ✅ Protected routes require authentication
- ✅ File uploads are validated
- ⚠️ Change JWT_SECRET in production
- ⚠️ Use HTTPS in production

## 📞 Support

- Check `README.md` for detailed docs
- See `SETUP_GUIDE.md` for installation help
- Review `PROJECT_SUMMARY.md` for features

## 🎨 Color Codes

- **Primary Blue**: `#3b82f6`
- **Primary Purple**: `#9333ea`
- **Success Green**: `#10b981`
- **Warning Yellow**: `#f59e0b`
- **Error Red**: `#ef4444`

## 📝 Default Credentials (After Signup)

Create your own account - no default credentials provided for security.

## 🚀 Deployment Checklist

- [ ] Set production environment variables
- [ ] Use MongoDB Atlas for database
- [ ] Change JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Build frontend: `npm run build`
- [ ] Deploy backend to Heroku/Railway/Render
- [ ] Deploy frontend to Vercel/Netlify

---

**Quick Tip**: Keep both terminal windows open while developing. Backend changes auto-reload with nodemon, frontend with React hot reload.

**Health Tip**: Remember, this app is for informational purposes only. Always consult healthcare professionals for medical advice! 🏥
