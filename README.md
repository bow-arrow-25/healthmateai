# HealthMate - Symptom Checker & Health Dashboard

A comprehensive health management application built with React, Express, MongoDB, and TailwindCSS. HealthMate helps users track symptoms, manage medications, upload prescriptions, monitor diet, and receive personalized health recommendations.

## 🌟 Features

### Core Features
- **Symptom Checker**: AI-powered symptom analysis with medicine recommendations
- **Medicine Reminders**: Smart medication tracking with daily reminders
- **Prescription OCR**: Upload prescription photos and automatically extract medicine details using Tesseract.js
- **Diet Tracking**: Monitor nutrition and get personalized dietary recommendations
- **Weather Integration**: Health recommendations based on current weather conditions
- **Health Dashboard**: Comprehensive view of health metrics, trends, and insights

### User Features
- **Authentication**: Secure JWT-based login and signup
- **User Profiles**: Manage existing conditions, allergies, and health information
- **Personalized Insights**: AI-driven health recommendations based on user data
- **Responsive Design**: Modern UI with parallax effects and smooth animations

## 🚀 Tech Stack

### Frontend
- React 18
- React Router v6
- TailwindCSS
- Framer Motion (animations)
- Axios
- Lucide React (icons)
- React Hot Toast (notifications)

### Backend
- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- Bcrypt.js
- Multer (file uploads)
- Tesseract.js (OCR)
- Node-cron (scheduled tasks)
- Axios (API calls)

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthmate
JWT_SECRET=your_secret_key_here
WEATHER_API_KEY=your_openweathermap_api_key
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🔑 API Keys

### OpenWeatherMap API (Optional)
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Add it to your `.env` file as `WEATHER_API_KEY`

**Note**: The app works without API keys using mock data for demonstration.

## 📱 Usage

### For Non-Logged-In Users
- Access the symptom checker without authentication
- Get instant health insights and medicine recommendations
- View weather-based health tips

### For Logged-In Users
- Full access to all features
- Personalized health dashboard
- Medicine reminder system
- Prescription upload and management
- Diet tracking and analysis
- Health insights based on your profile

## 🎯 Key Functionalities

### 1. Symptom Checker
- Enter multiple symptoms with severity levels
- Specify symptom duration
- Get possible conditions with probability scores
- Receive medicine recommendations
- Doctor visit recommendations for serious symptoms

### 2. Medicine Management
- Add medicines with dosage and frequency
- Set custom reminder times
- Track active medications
- Link medicines to prescriptions

### 3. Prescription OCR
- Upload prescription photos
- Automatic text extraction using OCR
- Extract medicine names, dosages, and frequencies
- Add extracted medicines to your list with one click

### 4. Diet Tracking
- Log daily meals and water intake
- View nutrition analysis (calories, protein, carbs, fats)
- Get personalized dietary recommendations
- Track vitamins and nutrients

### 5. Health Dashboard
- Overall health score calculation
- Recent symptom history
- Active medicines overview
- Personalized health insights
- Condition-specific recommendations

## 🏗️ Project Structure

```
HealthMate-Symptom-Checker/
├── backend/
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── services/        # Business logic
│   ├── uploads/         # Uploaded files
│   ├── server.js        # Entry point
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context
│   │   ├── pages/       # Page components
│   │   ├── App.js
│   │   └── index.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Input validation
- Secure file uploads

## 🎨 UI/UX Features

- Modern gradient designs
- Parallax scrolling effects
- Smooth animations with Framer Motion
- Responsive design for all devices
- Intuitive navigation
- Toast notifications for user feedback

## 📊 Database Models

- **User**: User profiles with health information
- **Medicine**: Medication tracking
- **Prescription**: Uploaded prescriptions
- **SymptomLog**: Symptom check history
- **DietLog**: Nutrition tracking
- **Reminder**: Medicine reminders

## 🚧 Future Enhancements

- Email/SMS notifications for reminders
- Integration with wearable devices
- Telemedicine consultation booking
- Health report generation (PDF)
- Multi-language support
- Social features (health communities)
- Advanced analytics and visualizations

## ⚠️ Disclaimer

This application is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## 📄 License

MIT License - feel free to use this project for learning and development purposes.

## 👨‍💻 Author

Created with ❤️ for better health management

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Note**: Make sure MongoDB is running before starting the backend server. For local development, you can use MongoDB Compass or the MongoDB CLI.
