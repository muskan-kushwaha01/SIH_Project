// BioBuddyChatbot.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BioBuddyChatbot = ({ robotImage }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show chatbot after page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Show tooltip after a delay to grab attention
      setTimeout(() => setShowTooltip(true), 2000);
      // Hide tooltip after showing for 3 seconds
      setTimeout(() => setShowTooltip(false), 10000);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Handle chatbot click
  const handleChatbotClick = () => {
    setIsExpanded(!isExpanded);
    setShowTooltip(false);
  };

  // Floating animation variants
  const floatingAnimation = {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Pulse animation for attention
  const pulseAnimation = {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-50">
         

          {/* Chat Window (when expanded) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl w-80 sm:w-96 h-96 overflow-hidden border border-gray-200"
              >
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1">
                        {robotImage ? (
                          <img 
                            src={robotImage} 
                            alt="BioBuddy" 
                            className="w-full h-full object-contain rounded-full"
                          />
                        ) : (
                          <span className="text-blue-600 text-sm font-bold">🤖</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">BioBuddy</h3>
                        <p className="text-blue-100 text-xs">Your Farming Assistant</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="text-white hover:text-blue-200 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Chat Content */}
                <div className="p-4 h-full flex flex-col justify-center items-center bg-gray-50">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🚧</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Coming Soon!
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      BioBuddy is getting ready to help you with farming advice, risk analysis, and more!
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-blue-700 text-xs">
                        💡 Soon I'll help you with:
                        <br />• Farm risk assessments
                        <br />• Biosecurity tips
                        <br />• Disease prevention
                        <br />• And much more!
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Chatbot Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            variants={floatingAnimation}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            {/* Pulse effect for attention */}
            <motion.div
              variants={showTooltip ? pulseAnimation : {}}
              className="absolute inset-0 bg-blue-500 rounded-full opacity-20"
            />
            
            <button
              onClick={handleChatbotClick}
              className="w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
            >
              {robotImage ? (
                <img 
                  src={robotImage} 
                  alt="BioBuddy" 
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">
                  🤖
                </span>
              )}
            </button>

            {/* Online indicator */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-full h-full bg-green-500 rounded-full"
              />
            </div>
          </motion.div>

          {/* Floating particles effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-300 rounded-full"
                animate={{
                  x: [0, Math.random() * 40 - 20],
                  y: [0, Math.random() * 40 - 20],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BioBuddyChatbot;