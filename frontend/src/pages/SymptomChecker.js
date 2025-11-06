import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, AlertCircle, Pill, Calendar, ThermometerSun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Common symptoms for quick selection
const COMMON_SYMPTOMS = [
  { name: 'headache', icon: '🤕', color: 'from-red-400 to-pink-500' },
  { name: 'fever', icon: '🌡️', color: 'from-orange-400 to-red-500' },
  { name: 'cough', icon: '😷', color: 'from-blue-400 to-cyan-500' },
  { name: 'sore throat', icon: '🗣️', color: 'from-purple-400 to-pink-500' },
  { name: 'fatigue', icon: '😴', color: 'from-indigo-400 to-purple-500' },
  { name: 'nausea', icon: '🤢', color: 'from-green-400 to-teal-500' },
  { name: 'dizziness', icon: '😵', color: 'from-yellow-400 to-orange-500' },
  { name: 'chest pain', icon: '💔', color: 'from-red-500 to-rose-600' }
];

const SymptomChecker = () => {
  const { isAuthenticated } = useAuth();
  const [symptoms, setSymptoms] = useState([]);
  const [symptomInput, setSymptomInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [duration, setDuration] = useState({ value: '', unit: 'days' });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const res = await axios.get('/api/weather/current?city=Default');
      setWeather(res.data.weather);
    } catch (error) {
      console.error('Weather fetch error:', error);
    }
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(`/api/symptoms/suggestions?query=${query}`);
      setSuggestions(res.data.suggestions || []);
    } catch (error) {
      console.error('Suggestions error:', error);
    }
  };

  const handleSymptomInputChange = (e) => {
    const value = e.target.value;
    setSymptomInput(value);
    setShowSuggestions(true);
    fetchSuggestions(value);
  };

  const addSymptomFromPill = (symptomName) => {
    if (!symptoms.find(s => s.name === symptomName)) {
      setSymptoms([...symptoms, { name: symptomName, severity: 'moderate' }]);
      toast.success(`Added ${symptomName}`);
    }
  };

  const addSymptom = (symptomName) => {
    if (symptomName && !symptoms.find(s => s.name === symptomName)) {
      setSymptoms([...symptoms, { name: symptomName, severity: 'moderate' }]);
      setSymptomInput('');
      setSuggestions([]);
      setShowSuggestions(false);
      toast.success(`Added ${symptomName}`);
    }
  };

  const removeSymptom = (index) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const updateSeverity = (index, severity) => {
    const updated = [...symptoms];
    updated[index].severity = severity;
    setSymptoms(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (symptoms.length === 0) {
      toast.error('Please add at least one symptom');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('/api/symptoms/check', {
        symptoms,
        duration: duration.value ? duration : null
      });

      setResults(res.data);

      if (res.data.isUrgent) {
        toast.error('⚠️ Urgent symptoms detected! Please seek immediate medical attention.');
      } else if (res.data.needsDoctorVisit) {
        toast('⚕️ Consider consulting a doctor for these symptoms', { icon: '⚠️' });
      }
    } catch (error) {
      toast.error('Error checking symptoms');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Symptom Checker
            </h1>
            <p className="text-xl text-gray-600">
              Enter your symptoms to get instant health insights
            </p>
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg inline-block">
              <p className="text-sm text-red-600 font-medium">
                ⚠️ Disclaimer: This tool is for informational purposes only and is not a substitute for professional medical advice.
              </p>
            </div>
          </div>

          {/* Weather Card */}
          {weather && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <ThermometerSun className="w-12 h-12 text-orange-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Current Weather</h3>
                    <p className="text-gray-600">{weather.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">{weather.temperature}°C</p>
                  <p className="text-sm text-gray-600">Humidity: {weather.humidity}%</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Common Symptoms - Floating Pills */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Quick Select Common Symptoms
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {COMMON_SYMPTOMS.map((symptom, index) => (
                <motion.button
                  key={symptom.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addSymptomFromPill(symptom.name)}
                  className={`floating-pill px-6 py-3 rounded-full text-white font-medium shadow-lg bg-gradient-to-r ${symptom.color}`}
                >
                  <span className="mr-2">{symptom.icon}</span>
                  {symptom.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Symptom Input Form - Liquid Glass */}
          <div className="glass-dark rounded-3xl shadow-2xl p-8 mb-8 border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Symptom Input */}
              <div>
                <label className="block text-lg font-semibold text-white mb-3">
                  Ask anything. Type @ for mentions.
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                  <input
                    type="text"
                    value={symptomInput}
                    onChange={handleSymptomInputChange}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSymptom(symptomInput);
                      }
                    }}
                    className="glass-input w-full pl-12 pr-4 py-4 rounded-2xl text-white placeholder-gray-400 focus:outline-none"
                    placeholder="Type a symptom or search..."
                  />
                  
                  {/* Suggestions Dropdown - Glass Style */}
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 w-full mt-2 glass-dark rounded-2xl shadow-2xl max-h-64 overflow-y-auto border border-white/10"
                    >
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => addSymptom(suggestion.name)}
                          className="w-full text-left px-4 py-3 text-white hover:bg-white/10 transition flex items-center space-x-3 border-b border-white/5 last:border-0"
                        >
                          <Search className="w-4 h-4 text-cyan-400" />
                          <span>{suggestion.displayName}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Added Symptoms */}
              {symptoms.length > 0 && (
                <div>
                  <label className="block text-lg font-semibold text-white mb-3">
                    Your Symptoms
                  </label>
                  <div className="space-y-3">
                    {symptoms.map((symptom, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between glass-input p-4 rounded-xl border border-white/20"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-white capitalize">{symptom.name}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-sm text-gray-300">Severity:</span>
                            {['mild', 'moderate', 'severe'].map((level) => (
                              <button
                                key={level}
                                type="button"
                                onClick={() => updateSeverity(index, level)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                                  symptom.severity === level
                                    ? level === 'severe'
                                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                                      : level === 'moderate'
                                      ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50'
                                      : 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                }`}
                              >
                                {level}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSymptom(index)}
                          className="ml-4 text-red-400 hover:text-red-300 font-semibold"
                        >
                          Remove
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Duration */}
              <div>
                <label className="block text-lg font-semibold text-white mb-3">
                  How long have you had these symptoms?
                </label>
                <div className="flex space-x-4">
                  <input
                    type="number"
                    value={duration.value}
                    onChange={(e) => setDuration({ ...duration, value: e.target.value })}
                    className="glass-input flex-1 px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none"
                    placeholder="Duration"
                    min="0"
                  />
                  <select
                    value={duration.unit}
                    onChange={(e) => setDuration({ ...duration, unit: e.target.value })}
                    className="glass-input px-4 py-3 rounded-xl text-white focus:outline-none"
                  >
                    <option value="hours" className="bg-gray-800">Hours</option>
                    <option value="days" className="bg-gray-800">Days</option>
                    <option value="weeks" className="bg-gray-800">Weeks</option>
                    <option value="months" className="bg-gray-800">Months</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading || symptoms.length === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/60 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="spinner border-white"></div>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Check Symptoms
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* Results */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Possible Conditions */}
              {results.possibleConditions && results.possibleConditions.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <AlertCircle className="w-8 h-8 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Possible Conditions</h2>
                  </div>
                  <div className="space-y-4">
                    {results.possibleConditions.map((condition, index) => (
                      <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {condition.name}
                        </h3>
                        <p className="text-gray-700">{condition.description}</p>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${condition.probability * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Medicines */}
              {results.suggestedMedicines && results.suggestedMedicines.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Pill className="w-8 h-8 text-green-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Suggested Medicines</h2>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    ⚠️ Always consult a healthcare professional before taking any medication.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.suggestedMedicines.map((medicine, index) => (
                      <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h3 className="font-semibold text-gray-900">{medicine.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Type: {medicine.type} | Dosage: {medicine.dosage}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Doctor Visit Recommendation */}
              {results.needsDoctorVisit && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-6 h-6 text-yellow-600 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                        Medical Consultation Recommended
                      </h3>
                      <p className="text-yellow-800">{results.doctorVisitReason}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contextual Advice */}
              {results.contextualAdvice && (
                <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
                  <p className="text-purple-900">{results.contextualAdvice}</p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SymptomChecker;
