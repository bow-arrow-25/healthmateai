import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Apple, Plus, TrendingUp, Droplet } from 'lucide-react';

const Diet = () => {
  const [dietLogs, setDietLogs] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [mealRecommendations, setMealRecommendations] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [formData, setFormData] = useState({
    meals: [{ type: 'breakfast', items: [''], calories: 0 }],
    waterIntake: 0
  });
  const [waterUnit, setWaterUnit] = useState('ml'); // 'ml' or 'liters'
  const [waterValue, setWaterValue] = useState('');

  const handleWaterChange = (value, unit) => {
    setWaterValue(value);
    setWaterUnit(unit);
    // Convert to ml for storage
    const mlValue = unit === 'liters' ? parseFloat(value) * 1000 : parseFloat(value);
    setFormData({ ...formData, waterIntake: mlValue || 0 });
  };

  useEffect(() => {
    fetchDietLogs();
    fetchAnalysis();
  }, []);

  const fetchMealRecommendations = async (mealType) => {
    try {
      const res = await axios.get(`/api/diet/meal-recommendations?mealType=${mealType}`);
      setMealRecommendations(res.data.recommendations);
      setSelectedMealType(mealType);
      setShowRecommendations(true);
    } catch (error) {
      console.error('Error fetching meal recommendations:', error);
      toast.error('Error loading recommendations');
    }
  };

  const fetchDietLogs = async () => {
    try {
      const res = await axios.get('/api/diet?limit=7');
      setDietLogs(res.data.dietLogs || []);
    } catch (error) {
      console.error('Error fetching diet logs:', error);
    }
  };

  const fetchAnalysis = async () => {
    try {
      const res = await axios.get('/api/diet/analysis?days=7');
      setAnalysis(res.data);
    } catch (error) {
      console.error('Error fetching analysis:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/diet', formData);
      toast.success('Diet log added!');
      setShowAddForm(false);
      setFormData({
        meals: [{ type: 'breakfast', items: [''], calories: 0 }],
        waterIntake: 0
      });
      setWaterValue('');
      setWaterUnit('ml');
      fetchDietLogs();
      fetchAnalysis();
    } catch (error) {
      toast.error('Error adding diet log');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Diet Tracker</h1>
              <p className="text-xl text-gray-600">Monitor your nutrition and get personalized recommendations</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Log Meal
            </button>
          </div>

          {/* Meal Recommendations Section */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🍽️ Personalized Meal Recommendations</h2>
            <p className="text-gray-600 mb-4">Get meal suggestions based on your health conditions</p>
            
            <div className="flex flex-wrap gap-3 mb-6">
              {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => (
                <button
                  key={mealType}
                  onClick={() => fetchMealRecommendations(mealType)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${
                    selectedMealType === mealType && showRecommendations
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </button>
              ))}
            </div>

            {/* Meal Recommendations Display */}
            {showRecommendations && mealRecommendations && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-6"
              >
                {/* Meal Cards */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended {selectedMealType} options:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mealRecommendations.meals?.map((meal, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition"
                      >
                        <h4 className="font-bold text-gray-900 mb-2">{meal.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-blue-600 font-medium">{meal.calories} cal</span>
                          <span className="text-green-600">✓ {meal.benefits}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Health Tips */}
                {mealRecommendations.healthTips && mealRecommendations.healthTips.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Health Tips</h3>
                    <div className="space-y-2">
                      {mealRecommendations.healthTips.map((tip, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <span className="text-xl">{tip.icon}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{tip.tip}</p>
                            <p className="text-xs text-gray-600">{tip.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Foods to Avoid */}
                {mealRecommendations.avoidFoods && mealRecommendations.avoidFoods.length > 0 && (
                  <div className="bg-red-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">⚠️ Foods to Avoid</h3>
                    <div className="space-y-2">
                      {mealRecommendations.avoidFoods.map((item, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <span className="text-xl">{item.icon}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.food}</p>
                            <p className="text-xs text-gray-600">{item.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Analysis Cards */}
          {analysis && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Avg Calories</span>
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{analysis.analysis?.averageDailyCalories || 0}</p>
                <p className="text-sm text-gray-600 mt-1">per day</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Protein</span>
                  <Apple className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{analysis.analysis?.averageDailyProtein || 0}g</p>
                <p className="text-sm text-gray-600 mt-1">per day</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Water</span>
                  <Droplet className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{analysis.analysis?.averageDailyWater || 0}ml</p>
                <p className="text-sm text-gray-600 mt-1">per day</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Days Tracked</span>
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{analysis.analysis?.daysAnalyzed || 0}</p>
                <p className="text-sm text-gray-600 mt-1">last week</p>
              </motion.div>
            </div>
          )}

          {/* Recommendations */}
          {analysis?.recommendations && analysis.recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nutrition Recommendations</h2>
              <div className="space-y-4">
                {analysis.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      rec.type === 'warning'
                        ? 'bg-red-50 border-red-500'
                        : rec.type === 'caution'
                        ? 'bg-yellow-50 border-yellow-500'
                        : rec.type === 'info'
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-green-50 border-green-500'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{rec.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{rec.category}</h3>
                        <p className="text-gray-700 text-sm">{rec.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Add Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Log Today's Meals</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Water Intake
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="number"
                      value={waterValue}
                      onChange={(e) => handleWaterChange(e.target.value, waterUnit)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={waterUnit === 'ml' ? 'e.g., 2000' : 'e.g., 2'}
                      step={waterUnit === 'ml' ? '100' : '0.1'}
                    />
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => {
                          const newUnit = 'ml';
                          if (waterUnit === 'liters' && waterValue) {
                            setWaterValue((parseFloat(waterValue) * 1000).toString());
                          }
                          setWaterUnit(newUnit);
                        }}
                        className={`px-4 py-2 rounded-md font-medium transition ${
                          waterUnit === 'ml'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        ml
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newUnit = 'liters';
                          if (waterUnit === 'ml' && waterValue) {
                            setWaterValue((parseFloat(waterValue) / 1000).toFixed(2));
                          }
                          setWaterUnit(newUnit);
                        }}
                        className={`px-4 py-2 rounded-md font-medium transition ${
                          waterUnit === 'liters'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        L
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {waterUnit === 'ml' ? 'Milliliters' : 'Liters'} - Current: {formData.waterIntake}ml
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Save Log
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Recent Logs */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Recent Logs</h2>
            {dietLogs.map((log, index) => (
              <motion.div
                key={log._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">
                    {new Date(log.date).toLocaleDateString()}
                  </h3>
                  <div className="flex items-center text-blue-600">
                    <Droplet className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">{log.waterIntake}ml</span>
                  </div>
                </div>
                {log.meals && log.meals.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {log.meals.map((meal, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900 capitalize">{meal.type}</p>
                        <p className="text-sm text-gray-600">{meal.items.join(', ')}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {dietLogs.length === 0 && !showAddForm && (
            <div className="text-center py-16">
              <Apple className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No diet logs yet</h3>
              <p className="text-gray-600 mb-6">Start tracking your nutrition today</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                Log Your First Meal
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Diet;
