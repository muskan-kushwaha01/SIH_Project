// AppointmentPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import robotImage from "../assets/images/robot.png";
import BioBuddyChatbot from "../components/Chatbot"; 
import { Calendar, Clock, User, Phone, MessageCircle, Plus } from 'lucide-react';

const AppointmentPage = () => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Farmer');

  // Get user info from localStorage
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
    
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <p className="text-gray-600 text-center">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      {/* Main Content */}
      <div className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">
              My Appointments
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Book consultations with veterinary experts and advisors
            </p>
          </motion.div>

          {/* Quick Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 sm:mb-12"
          >
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">0</p>
                  <p className="text-xs sm:text-sm text-gray-500">Total Appointments</p>
                </div>
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">0</p>
                  <p className="text-xs sm:text-sm text-gray-500">Completed</p>
                </div>
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600">0</p>
                  <p className="text-xs sm:text-sm text-gray-500">Upcoming</p>
                </div>
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              </div>
            </div>
          </motion.div>

          {/* No Appointments Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 text-center"
          >
            {/* Animated Icon */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center"
            >
              <Calendar className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-blue-600" />
            </motion.div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
              No Appointments Yet
            </h2>
            
            <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-md mx-auto px-2">
              Hello! You haven't scheduled any appointments yet. 
              Book your first consultation with our experts.
            </p>

            {/* Features List - Fixed centering issue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-start space-x-3 text-left px-4 sm:px-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 text-sm sm:text-base">Expert Veterinarians</span>
              </div>
              <div className="flex items-center justify-start space-x-3 text-left px-4 sm:px-0">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                <span className="text-gray-700 text-sm sm:text-base">Phone & Video Calls</span>
              </div>
              <div className="flex items-center justify-start space-x-3 text-left px-4 sm:px-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                <span className="text-gray-700 text-sm sm:text-base">Flexible Timing</span>
              </div>
              <div className="flex items-center justify-start space-x-3 text-left px-4 sm:px-0">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" />
                <span className="text-gray-700 text-sm sm:text-base">Free Consultation</span>
              </div>
            </div>

            {/* Book Appointment Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 
                         text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl shadow-lg 
                         hover:shadow-xl transition-all duration-300 text-sm sm:text-base md:text-lg font-semibold
                         w-full sm:w-auto max-w-xs mx-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Book Your First Appointment</span>
            </motion.button>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-12"
          >
            {/* Expert Consultation Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 sm:p-6 border border-green-200">
              <div className="flex items-center mb-3 sm:mb-4">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mr-2 sm:mr-3 flex-shrink-0" />
                <h3 className="text-lg sm:text-xl font-semibold text-green-800">Expert Consultation</h3>
              </div>
              <p className="text-green-700 mb-3 sm:mb-4 text-sm sm:text-base">
                Get advice from qualified veterinarians and experts about your livestock and farm management.
              </p>
              <ul className="text-xs sm:text-sm text-green-600 space-y-1 sm:space-y-2">
                <li>• Disease diagnosis and treatment</li>
                <li>• Vaccination schedules</li>
                <li>• Feed management advice</li>
                <li>• Biosecurity guidance</li>
              </ul>
            </div>

            {/* Emergency Support Card */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 sm:p-6 border border-red-200">
              <div className="flex items-center mb-3 sm:mb-4">
                <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 mr-2 sm:mr-3 flex-shrink-0" />
                <h3 className="text-lg sm:text-xl font-semibold text-red-800">Emergency Support</h3>
              </div>
              <p className="text-red-700 mb-3 sm:mb-4 text-sm sm:text-base">
                24/7 emergency helpline for urgent situations affecting your livestock health and farm operations.
              </p>
              <div className="bg-red-200 rounded-lg p-2 sm:p-3">
                <p className="text-red-800 font-semibold text-center text-xs sm:text-sm md:text-base">
                  Emergency Hotline: 1800-XXX-XXXX
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Chatbot positioned properly for mobile */}
      <div className="fixed bottom-4 right-4 z-50">
        <BioBuddyChatbot robotImage={robotImage} />
      </div>
    </div>
  );
};

export default AppointmentPage;