import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Activity, Pill, TrendingUp, AlertCircle, Heart, Calendar, Cloud, Wind, Scale, MapPin } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          fetchWeather(latitude, longitude);
          fetchAirQuality(latitude, longitude);
        },
        (error) => {
          console.error('Location error:', error);
          // Use default location if user denies
          fetchWeather(28.6139, 77.2090); // Delhi as default
          fetchAirQuality(28.6139, 77.2090);
        }
      );
    }
  };

  const fetchWeather = async (lat, lon) => {
    try {
      const res = await api.get(`/api/weather/current?lat=${lat}&lon=${lon}`);
      setWeather(res.data);
    } catch (error) {
      console.error('Weather fetch error:', error);
    }
  };

  const fetchAirQuality = async (lat, lon) => {
    try {
      const res = await api.get(`/api/weather/air-quality?lat=${lat}&lon=${lon}`);
      setAirQuality(res.data);
    } catch (error) {
      console.error('Air quality fetch error:', error);
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/api/health/dashboard');
      setDashboard(res.data.dashboard);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-xl text-gray-600">Here's your health overview</p>
        </motion.div>

        {/* Weather & Air Quality Alerts */}
        {(weather || airQuality) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Weather Card */}
            {weather && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Cloud className="w-8 h-8 mr-3" />
                    <h3 className="text-xl font-bold">Weather in Your Area</h3>
                  </div>
                  <span className="text-3xl font-bold">{Math.round(weather.weather?.temperature)}°C</span>
                </div>
                <p className="text-blue-100 mb-4">
                  {weather.weather?.condition} • Humidity: {weather.weather?.humidity}%
                </p>
                {weather.healthRecommendations && weather.healthRecommendations.length > 0 && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-sm font-semibold mb-2">{weather.healthRecommendations[0].icon} {weather.healthRecommendations[0].title}</p>
                    <p className="text-sm text-blue-50">{weather.healthRecommendations[0].message}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Air Quality Card */}
            {airQuality && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`rounded-2xl shadow-lg p-6 text-white ${
                  airQuality.airQuality?.aqi <= 2
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                    : airQuality.airQuality?.aqi === 3
                    ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                    : 'bg-gradient-to-br from-red-500 to-pink-500'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Wind className="w-8 h-8 mr-3" />
                    <h3 className="text-xl font-bold">Air Quality</h3>
                  </div>
                  <span className="text-2xl font-bold">{airQuality.airQuality?.category}</span>
                </div>
                <p className="text-white/90 mb-4">
                  PM2.5: {airQuality.airQuality?.pm25} • PM10: {airQuality.airQuality?.pm10}
                </p>
                {airQuality.healthRecommendations && airQuality.healthRecommendations.length > 0 && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-sm font-semibold mb-2">{airQuality.healthRecommendations[0].icon} {airQuality.healthRecommendations[0].title}</p>
                    <p className="text-sm text-white/90">{airQuality.healthRecommendations[0].message}</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* BMI Card */}
        {user?.healthMetrics?.bmi && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mr-4">
                  <Scale className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Your BMI</h3>
                  <p className="text-gray-600">Body Mass Index</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-pink-600">{user.healthMetrics.bmi}</div>
                <div className="text-sm text-gray-600 mt-1">{user.healthMetrics.bmiCategory}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              Weight: {user.healthMetrics.weight?.value} {user.healthMetrics.weight?.unit} • Height: {user.healthMetrics.height?.value} {user.healthMetrics.height?.unit}
            </div>
          </motion.div>
        )}

        {/* Health Score Card */}
        {dashboard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Health Score</h2>
                <p className="text-gray-600">Based on your recent activity and health data</p>
              </div>
              <div className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor(dashboard.healthScore)}`}>
                  {dashboard.healthScore}
                </div>
                <div className="text-sm text-gray-600 mt-2">out of 100</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`bg-gradient-to-r ${getScoreBg(dashboard.healthScore)} h-4 rounded-full transition-all duration-500`}
                  style={{ width: `${dashboard.healthScore}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* BMI Quick Stat */}
          {user?.healthMetrics?.bmi && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-pink-600" />
                </div>
                <span className="text-sm text-gray-600">Current</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {user.healthMetrics.bmi}
              </h3>
              <p className="text-gray-600">BMI</p>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Last 7 days</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {dashboard?.recentSymptoms?.length || 0}
            </h3>
            <p className="text-gray-600">Symptom Checks</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Pill className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Active</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {dashboard?.activeMedicines?.length || 0}
            </h3>
            <p className="text-gray-600">Medicines</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">Tracked</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {dashboard?.user?.existingConditions?.length || 0}
            </h3>
            <p className="text-gray-600">Conditions</p>
          </motion.div>
        </div>

        {/* Insights */}
        {dashboard?.insights && dashboard.insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Health Insights</h2>
            <div className="space-y-4">
              {dashboard.insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    insight.type === 'warning'
                      ? 'bg-red-50 border-red-500'
                      : insight.type === 'caution'
                      ? 'bg-yellow-50 border-yellow-500'
                      : insight.type === 'info'
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-green-50 border-green-500'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{insight.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{insight.title}</h3>
                      <p className="text-gray-700 text-sm">{insight.message}</p>
                      <span className="inline-block mt-2 text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded">
                        {insight.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Symptoms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Symptoms</h2>
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            {dashboard?.recentSymptoms && dashboard.recentSymptoms.length > 0 ? (
              <div className="space-y-3">
                {dashboard.recentSymptoms.slice(0, 5).map((log, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {log.symptoms.map(s => s.name).join(', ')}
                      </span>
                      <span className="text-xs text-gray-600">
                        {new Date(log.date).toLocaleDateString()}
                      </span>
                    </div>
                    {log.possibleConditions && log.possibleConditions[0] && (
                      <p className="text-sm text-gray-600">
                        Possible: {log.possibleConditions[0].name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No recent symptom checks</p>
            )}
          </motion.div>

          {/* Active Medicines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Active Medicines</h2>
              <Pill className="w-6 h-6 text-green-600" />
            </div>
            {dashboard?.activeMedicines && dashboard.activeMedicines.length > 0 ? (
              <div className="space-y-3">
                {dashboard.activeMedicines.slice(0, 5).map((medicine, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{medicine.name}</p>
                        <p className="text-sm text-gray-600">{medicine.dosage}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {medicine.frequency}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No active medicines</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
