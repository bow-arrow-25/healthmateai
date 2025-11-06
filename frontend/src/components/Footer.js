import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-6 h-6 text-blue-400" fill="currentColor" />
              <h3 className="text-xl font-bold text-white">HealthMate</h3>
            </div>
            <p className="text-sm">
              Your personal health companion for symptom checking, medicine reminders, 
              and comprehensive health tracking. Take control of your well-being today.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/symptom-checker" className="hover:text-blue-400 transition">
                  Symptom Checker
                </a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-blue-400 transition">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/medicines" className="hover:text-blue-400 transition">
                  Medicines
                </a>
              </li>
              <li>
                <a href="/diet" className="hover:text-blue-400 transition">
                  Diet Tracker
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>support@healthmate.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>123 Health St, Wellness City</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} HealthMate. All rights reserved.</p>
          <p className="mt-2 text-xs text-gray-500">
            Disclaimer: This tool is for informational purposes only and is not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
