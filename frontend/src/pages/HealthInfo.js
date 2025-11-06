import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Activity, 
  Apple, 
  Droplet, 
  Moon, 
  Brain,
  Scale,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

const HealthInfo = () => {
  const healthTopics = [
    {
      icon: Scale,
      title: 'Body Mass Index (BMI)',
      color: 'from-pink-500 to-rose-500',
      description: 'Understanding your body composition',
      content: [
        'BMI is a measure of body fat based on height and weight',
        'Normal BMI range: 18.5 - 24.9',
        'Regular monitoring helps track health progress',
        'Combine with other metrics for complete picture'
      ]
    },
    {
      icon: Heart,
      title: 'Heart Health',
      color: 'from-red-500 to-pink-500',
      description: 'Keeping your cardiovascular system strong',
      content: [
        'Normal resting heart rate: 60-100 beats per minute',
        'Regular exercise strengthens heart muscle',
        'Manage stress to reduce heart disease risk',
        'Monitor blood pressure regularly'
      ]
    },
    {
      icon: Activity,
      title: 'Physical Activity',
      color: 'from-blue-500 to-cyan-500',
      description: 'Move your body for better health',
      content: [
        'Aim for 150 minutes of moderate exercise weekly',
        'Include strength training 2-3 times per week',
        'Even short walks provide health benefits',
        'Find activities you enjoy for consistency'
      ]
    },
    {
      icon: Apple,
      title: 'Nutrition',
      color: 'from-green-500 to-emerald-500',
      description: 'Fuel your body with proper nutrition',
      content: [
        'Eat a variety of colorful fruits and vegetables',
        'Choose whole grains over refined grains',
        'Include lean proteins in your diet',
        'Limit processed foods and added sugars'
      ]
    },
    {
      icon: Droplet,
      title: 'Hydration',
      color: 'from-cyan-500 to-blue-500',
      description: 'Stay properly hydrated',
      content: [
        'Drink 8-10 glasses of water daily',
        'Increase intake during exercise or hot weather',
        'Monitor urine color for hydration status',
        'Limit caffeinated and sugary beverages'
      ]
    },
    {
      icon: Moon,
      title: 'Sleep Quality',
      color: 'from-indigo-500 to-purple-500',
      description: 'Rest and recovery are essential',
      content: [
        'Adults need 7-9 hours of sleep per night',
        'Maintain consistent sleep schedule',
        'Create a relaxing bedtime routine',
        'Avoid screens 1 hour before bed'
      ]
    },
    {
      icon: Brain,
      title: 'Mental Health',
      color: 'from-purple-500 to-pink-500',
      description: 'Mind and body connection',
      content: [
        'Practice stress management techniques',
        'Stay socially connected with others',
        'Seek help when feeling overwhelmed',
        'Practice mindfulness or meditation'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Preventive Care',
      color: 'from-orange-500 to-red-500',
      description: 'Stay ahead of health issues',
      content: [
        'Schedule regular health check-ups',
        'Keep vaccinations up to date',
        'Know your family health history',
        'Screen for common health conditions'
      ]
    }
  ];

  const healthyHabits = [
    {
      icon: CheckCircle,
      title: 'Daily Habits',
      tips: [
        'Start your day with a healthy breakfast',
        'Take regular breaks from sitting',
        'Practice good posture',
        'Wash hands frequently',
        'Limit screen time before bed'
      ]
    },
    {
      icon: AlertCircle,
      title: 'Warning Signs',
      tips: [
        'Unexplained weight changes',
        'Persistent fatigue or weakness',
        'Chronic pain or discomfort',
        'Changes in sleep patterns',
        'Mood changes or anxiety'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Info className="w-12 h-12 text-purple-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Know About Your Health
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Essential health information to help you make informed decisions about your well-being
          </p>
        </motion.div>

        {/* Introduction Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl shadow-xl p-8 mb-12 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Your Health Journey Starts Here</h2>
          <p className="text-lg leading-relaxed mb-4">
            Understanding your health is the first step toward a healthier lifestyle. This guide provides 
            essential information about key health metrics, preventive care, and healthy habits that can 
            improve your quality of life.
          </p>
          <p className="text-lg leading-relaxed">
            Remember: This information is for educational purposes. Always consult with healthcare 
            professionals for personalized medical advice.
          </p>
        </motion.div>

        {/* Health Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {healthTopics.map((topic, index) => {
            const Icon = topic.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{topic.title}</h3>
                <p className="text-sm text-gray-600 mb-4 italic">{topic.description}</p>
                <ul className="space-y-2">
                  {topic.content.map((item, idx) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <span className="text-purple-600 mr-2 mt-1">•</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Healthy Habits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {healthyHabits.map((habit, index) => {
            const Icon = habit.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="flex items-center mb-6">
                  <Icon className={`w-8 h-8 mr-3 ${index === 0 ? 'text-green-600' : 'text-orange-600'}`} />
                  <h3 className="text-2xl font-bold text-gray-900">{habit.title}</h3>
                </div>
                <ul className="space-y-3">
                  {habit.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className={`${index === 0 ? 'text-green-600' : 'text-orange-600'} mr-3 mt-1`}>
                        {index === 0 ? '✓' : '⚠'}
                      </span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </motion.div>

        {/* Quick Health Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl shadow-lg p-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Quick Health Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">🏃</div>
              <h4 className="font-bold text-gray-900 mb-2">Move More</h4>
              <p className="text-sm text-gray-600">Take the stairs, walk during breaks</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">🥗</div>
              <h4 className="font-bold text-gray-900 mb-2">Eat Smart</h4>
              <p className="text-sm text-gray-600">Fill half your plate with vegetables</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">💧</div>
              <h4 className="font-bold text-gray-900 mb-2">Stay Hydrated</h4>
              <p className="text-sm text-gray-600">Carry a water bottle everywhere</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">😴</div>
              <h4 className="font-bold text-gray-900 mb-2">Sleep Well</h4>
              <p className="text-sm text-gray-600">Stick to a consistent schedule</p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-center bg-white rounded-3xl shadow-lg p-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Track Your Health?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Use our tools to monitor your health metrics and stay on top of your wellness goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/bmi-calculator"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              <Scale className="w-5 h-5 mr-2" />
              Calculate BMI
            </a>
            <a
              href="/symptom-checker"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg"
            >
              <Heart className="w-5 h-5 mr-2" />
              Check Symptoms
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HealthInfo;
