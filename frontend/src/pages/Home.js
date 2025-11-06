import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Activity, 
  Pill, 
  FileText, 
  Bell, 
  Apple, 
  Cloud, 
  Shield,
  ArrowRight,
  Scale,
  Info
} from 'lucide-react';

const Home = () => {
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Activity,
      title: 'Symptom Checker',
      description: 'Get instant analysis of your symptoms with AI-powered recommendations',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Pill,
      title: 'Medicine Reminders',
      description: 'Never miss a dose with smart medication reminders and tracking',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: FileText,
      title: 'Prescription OCR',
      description: 'Upload prescription photos and automatically extract medicine details',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Apple,
      title: 'Diet Tracking',
      description: 'Monitor your nutrition and get personalized dietary recommendations',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Cloud,
      title: 'Weather Insights',
      description: 'Health recommendations based on current weather conditions',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: Shield,
      title: 'Health Dashboard',
      description: 'Comprehensive view of your health metrics and trends',
      color: 'from-teal-500 to-green-500'
    },
    {
      icon: Scale,
      title: 'BMI Calculator',
      description: 'Calculate your Body Mass Index and track your health goals',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Modern Design */}
      <section 
        className="relative min-h-[600px] flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
        }}
      >
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-300 opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900 opacity-20"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            Your Personal Health Companion
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-lg">
            Take control of your well-being with AI-powered health tools, BMI tracking, and personalized insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
            >
              Explore Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/symptom-checker"
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all shadow-lg"
            >
              Check Symptoms
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Health Dashboard Preview Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Health Dashboard
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage your health in one place
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Ongoing Health Problems Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Ongoing Health Problems</h3>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-600 mb-4">Track your symptoms and health conditions in real-time</p>
              <Link 
                to="/symptom-checker"
                className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center"
              >
                Check Symptoms <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </motion.div>

            {/* Medication Log Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Medication Log</h3>
                <Pill className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-gray-600 mb-4">Never miss a dose with smart reminders and tracking</p>
              <Link 
                to="/medicines"
                className="text-purple-600 font-semibold hover:text-purple-700 inline-flex items-center"
              >
                Manage Medicines <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </motion.div>

            {/* Track Your Metrics Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Track Your Metrics</h3>
                <Apple className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600 mb-4">Monitor diet, water intake, and nutrition goals</p>
              <Link 
                to="/diet"
                className="text-green-600 font-semibold hover:text-green-700 inline-flex items-center"
              >
                View Diet Tracker <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </motion.div>

            {/* BMI Calculator Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">BMI Calculator</h3>
                <Scale className="w-8 h-8 text-pink-600" />
              </div>
              <p className="text-gray-600 mb-4">Calculate your Body Mass Index and understand your health</p>
              <Link 
                to="/bmi-calculator"
                className="text-pink-600 font-semibold hover:text-pink-700 inline-flex items-center"
              >
                Calculate BMI <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </motion.div>

            {/* Health Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Know Your Health</h3>
                <Info className="w-8 h-8 text-indigo-600" />
              </div>
              <p className="text-gray-600 mb-4">Learn about health metrics, tips, and wellness information</p>
              <Link 
                to="/health-info"
                className="text-indigo-600 font-semibold hover:text-indigo-700 inline-flex items-center"
              >
                Learn More <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need for Better Health
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive health management tools designed to keep you healthy and informed
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card-hover bg-white rounded-2xl p-8 shadow-lg"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How HealthMate Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, intuitive, and powerful health management in three steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                title: 'Sign Up & Set Profile',
                description: 'Create your account and add your existing health conditions, allergies, and medications'
              },
              {
                step: '2',
                title: 'Track Your Health',
                description: 'Log symptoms, upload prescriptions, track diet, and monitor your health metrics'
              },
              {
                step: '3',
                title: 'Get Insights',
                description: 'Receive personalized recommendations, reminders, and health insights based on your data'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-3xl font-bold flex items-center justify-center mx-auto mb-6 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust HealthMate for their daily health management
            </p>
            <Link
              to="/signup"
              className="btn-hover inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Start Your Health Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
