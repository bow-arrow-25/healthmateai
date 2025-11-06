import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, TrendingUp, Info, Activity } from 'lucide-react';

const BMICalculator = () => {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [showInfo, setShowInfo] = useState(true);

  const calculateBMI = () => {
    if (!weight || !height) {
      return;
    }

    let weightInKg = parseFloat(weight);
    let heightInMeters = parseFloat(height);

    // Convert weight to kg
    if (weightUnit === 'lbs') {
      weightInKg = weightInKg * 0.453592;
    } else if (weightUnit === 'pounds') {
      weightInKg = weightInKg * 0.453592;
    }

    // Convert height to meters
    if (heightUnit === 'cm') {
      heightInMeters = heightInMeters / 100;
    } else if (heightUnit === 'ft') {
      heightInMeters = heightInMeters * 0.3048;
    } else if (heightUnit === 'inches') {
      heightInMeters = heightInMeters * 0.0254;
    }

    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    setBmi(bmiValue.toFixed(1));

    // Determine category
    if (bmiValue < 18.5) {
      setCategory('Underweight');
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      setCategory('Normal weight');
    } else if (bmiValue >= 25 && bmiValue < 30) {
      setCategory('Overweight');
    } else {
      setCategory('Obese');
    }
  };

  const getBMIColor = () => {
    if (!bmi) return 'from-gray-400 to-gray-500';
    const bmiNum = parseFloat(bmi);
    if (bmiNum < 18.5) return 'from-blue-400 to-blue-600';
    if (bmiNum < 25) return 'from-green-400 to-green-600';
    if (bmiNum < 30) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-red-600';
  };

  const getBMIDescription = () => {
    if (!category) return '';
    
    const descriptions = {
      'Underweight': 'You may need to gain weight. Consider consulting with a healthcare provider for personalized advice.',
      'Normal weight': 'Great! You\'re in a healthy weight range. Keep up the good work with balanced nutrition and regular exercise.',
      'Overweight': 'You may benefit from losing some weight. A balanced diet and regular physical activity can help.',
      'Obese': 'Consider consulting with a healthcare provider for a personalized weight management plan.'
    };
    
    return descriptions[category] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Scale className="w-12 h-12 text-purple-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              BMI Calculator
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate your Body Mass Index and understand your health status
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* BMI Information Card */}
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8 relative"
            >
              <button
                onClick={() => setShowInfo(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
              
              <div className="flex items-center mb-6">
                <Info className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">What is BMI?</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  <strong>Body Mass Index (BMI)</strong> is a simple calculation using a person's height and weight. 
                  The formula is BMI = kg/m² where kg is a person's weight in kilograms and m² is their height in meters squared.
                </p>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-3 text-gray-900">BMI Categories:</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-blue-500 mr-3"></div>
                      <span><strong>Underweight:</strong> BMI less than 18.5</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
                      <span><strong>Normal weight:</strong> BMI 18.5 - 24.9</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-yellow-500 mr-3"></div>
                      <span><strong>Overweight:</strong> BMI 25 - 29.9</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-red-500 mr-3"></div>
                      <span><strong>Obese:</strong> BMI 30 or greater</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 italic">
                  Note: BMI is a screening tool and does not diagnose body fatness or health. 
                  Consult with a healthcare provider for a comprehensive health assessment.
                </p>
              </div>
            </motion.div>
          )}

          {/* Calculator Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`bg-white rounded-3xl shadow-xl p-8 ${!showInfo ? 'lg:col-span-2 max-w-2xl mx-auto' : ''}`}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Activity className="w-7 h-7 text-purple-600 mr-2" />
              Calculate Your BMI
            </h2>

            <div className="space-y-6">
              {/* Weight Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Weight
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Enter weight"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition"
                  />
                  <select
                    value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition bg-white"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                    <option value="pounds">pounds</option>
                  </select>
                </div>
              </div>

              {/* Height Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Height
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Enter height"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition"
                  />
                  <select
                    value={heightUnit}
                    onChange={(e) => setHeightUnit(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition bg-white"
                  >
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                    <option value="ft">ft</option>
                    <option value="inches">inches</option>
                  </select>
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateBMI}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Calculate BMI
              </button>

              {/* Results */}
              {bmi && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 space-y-4"
                >
                  <div className={`bg-gradient-to-r ${getBMIColor()} rounded-2xl p-8 text-white text-center`}>
                    <p className="text-sm font-semibold uppercase tracking-wide mb-2 opacity-90">
                      Your BMI
                    </p>
                    <p className="text-6xl font-bold mb-2">{bmi}</p>
                    <p className="text-2xl font-semibold">{category}</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                    <div className="flex items-start">
                      <TrendingUp className="w-6 h-6 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">What does this mean?</h3>
                        <p className="text-gray-700 leading-relaxed">
                          {getBMIDescription()}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* BMI Chart Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-white rounded-3xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            BMI Range Chart
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Underweight</h3>
              <p className="text-sm text-gray-700">BMI &lt; 18.5</p>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Normal</h3>
              <p className="text-sm text-gray-700">BMI 18.5 - 24.9</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-100 to-orange-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Overweight</h3>
              <p className="text-sm text-gray-700">BMI 25 - 29.9</p>
            </div>
            <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-red-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Obese</h3>
              <p className="text-sm text-gray-700">BMI ≥ 30</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BMICalculator;
