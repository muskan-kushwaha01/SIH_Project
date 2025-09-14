import React, { useEffect, useState } from "react";

const PigRiskResultPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animateRecommendations, setAnimateRecommendations] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getRiskConfig = (riskLevel) => {
    const configs = {
      Low: {
        value: 25,
        color: "#22c55e",
        bgColor: "bg-green-500",
        textColor: "text-green-600",
        icon: "✓",
        title: "Low Risk",
        subtitle: "Your pig farm shows good health indicators",
        recommendations: [
          { icon: "🛡️", text: "Maintain current biosecurity practices and hygiene", priority: "maintain" },
          { icon: "🧹", text: "Regularly clean pens and water troughs", priority: "maintain" },
          { icon: "💉", text: "Continue scheduled vaccination and deworming", priority: "maintain" },
          { icon: "👁️", text: "Monitor animal health and record daily observations", priority: "maintain" }
        ]
      },
      Medium: {
        value: 50,
        color: "#f59e0b",
        bgColor: "bg-yellow-500",
        textColor: "text-yellow-600",
        icon: "⚠",
        title: "Medium Risk",
        subtitle: "Some areas need attention",
        recommendations: [
          { icon: "🧽", text: "Improve farm sanitation (disinfect pens more frequently)", priority: "urgent" },
          { icon: "🏥", text: "Isolate new or sick pigs to avoid spread", priority: "urgent" },
          { icon: "🌾", text: "Provide balanced feed and clean water to boost immunity", priority: "important" },
          { icon: "👥", text: "Train workers on basic biosecurity protocols", priority: "important" },
          { icon: "🚫", text: "Limit visitors inside pig housing areas", priority: "important" }
        ]
      },
      High: {
        value: 75,
        color: "#ef4444",
        bgColor: "bg-red-500",
        textColor: "text-red-600",
        icon: "🚨",
        title: "High Risk",
        subtitle: "Immediate action required",
        recommendations: [
          { icon: "📞", text: "Immediate veterinary check-up and disease screening", priority: "critical" },
          { icon: "🛡️", text: "Strengthen biosecurity barriers (footbaths, fencing, controlled entry)", priority: "critical" },
          { icon: "🏠", text: "Quarantine all newly purchased animals", priority: "urgent" },
          { icon: "📉", text: "Consider reducing stocking density to prevent stress", priority: "urgent" },
          { icon: "👨‍⚕️", text: "Seek expert guidance for long-term disease management plans", priority: "urgent" }
        ]
      }
    };
    return configs[riskLevel] || configs.Medium;
  };

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
        
        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }
    
        // First, check if server is running
        try {
          const healthCheck = await fetch('http://127.0.0.1:8000/');
          if (!healthCheck.ok) {
            throw new Error('Server is not responding correctly');
          }
        } catch (serverError) {
          throw new Error('Cannot connect to server. Please make sure the API server is running on port 8000.');
        }
    
        const response = await fetch('http://127.0.0.1:8000/risk/result', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
    
        // Check content type before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const textResponse = await response.text();
          console.error('Non-JSON response:', textResponse);
          throw new Error('Server returned HTML instead of JSON. Check server logs.');
        }
    
        if (response.ok) {
          const data = await response.json();
          setResult(data.prediction);
          setError(null);
    
          // Trigger staggered recommendation animations with slide-down effect
          setTimeout(() => {
            const recommendations = getRiskConfig(data.prediction.risk_level).recommendations;
            recommendations.forEach((_, index) => {
              setTimeout(() => {
                setAnimateRecommendations(prev => [...prev, index]);
              }, index * (isMobile ? 300 : 400)); // Adjusted for mobile
            });
          }, 1000); // Start animations after speedometer
    
        } else {
          const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
          
          if (response.status === 404) {
            throw new Error('No pig risk analysis found. Please complete the risk assessment first.');
          } else if (response.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
          } else {
            throw new Error(errorData.detail || `Server error: ${response.status}`);
          }
        }
        
      } catch (error) {
        console.error('Error fetching results:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, []);

  const Speedometer = ({ value, color, config }) => {
    // Dynamic sizing based on screen size
    const radius = isMobile ? (window.innerWidth < 400 ? 70 : 85) : 120;
    const strokeWidth = isMobile ? (window.innerWidth < 400 ? 8 : 10) : 16;
    const svgSize = isMobile ? (window.innerWidth < 400 ? 180 : 200) : 280;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference * 0.75;
    const strokeDashoffset = strokeDasharray - (value / 100) * strokeDasharray;

    return (
      <div className="flex flex-col items-center w-full">
        <div className={`relative flex items-center justify-center ${
          isMobile ? 'w-48 h-48 xs:w-52 xs:h-52' : 'w-80 h-80'
        }`}>
          <svg 
            width={svgSize} 
            height={svgSize} 
            className="transform -rotate-90"
            viewBox={`0 0 ${svgSize} ${svgSize}`}
          >
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDasharray * 0.125}
            />
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset + strokeDasharray * 0.125}
              style={{ 
                transition: 'stroke-dashoffset 2s ease-in-out 0.5s',
                filter: `drop-shadow(0 0 8px ${color}40)`
              }}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
            <div className={`${
              isMobile 
                ? 'text-2xl xs:text-3xl' 
                : 'text-5xl lg:text-6xl'
            } font-bold mb-1 ${config.textColor}`}>
              {value}%
            </div>
            <div className={`${
              isMobile ? 'text-sm xs:text-base' : 'text-xl'
            } font-semibold text-gray-700 mb-1 px-1`}>
              {config.title}
            </div>
            <div className={`${
              isMobile ? 'text-xs' : 'text-sm'
            } text-gray-500 uppercase tracking-wider`}>
              Risk Level
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RecommendationCard = ({ recommendation, isVisible, index }) => {
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'critical': return 'border-red-200 bg-red-50 shadow-red-100';
        case 'urgent': return 'border-orange-200 bg-orange-50 shadow-orange-100';
        case 'important': return 'border-yellow-200 bg-yellow-50 shadow-yellow-100';
        case 'maintain': return 'border-green-200 bg-green-50 shadow-green-100';
        default: return 'border-gray-200 bg-gray-50 shadow-gray-100';
      }
    };

    const getPriorityBadge = (priority) => {
      switch (priority) {
        case 'critical': return { text: 'Critical', bg: 'bg-red-500' };
        case 'urgent': return { text: 'Urgent', bg: 'bg-orange-500' };
        case 'important': return { text: 'Important', bg: 'bg-yellow-500' };
        case 'maintain': return { text: 'Maintain', bg: 'bg-green-500' };
        default: return { text: 'Action', bg: 'bg-blue-500' };
      }
    };

    const badge = getPriorityBadge(recommendation.priority);

    return (
      <div
        className={`${getPriorityColor(recommendation.priority)} border-2 rounded-xl p-3 xs:p-4 mb-3 shadow-lg transform transition-all duration-700 ease-out ${
          isVisible 
            ? 'translate-y-0 opacity-100 scale-100' 
            : '-translate-y-4 opacity-0 scale-95'
        }`}
        style={{
          transitionDelay: isVisible ? `${index * (isMobile ? 100 : 150)}ms` : '0ms'
        }}
      >
        <div className="flex items-start gap-3">
          <div className={`${
            isMobile ? 'text-xl xs:text-2xl' : 'text-3xl'
          } mt-1 transform transition-transform duration-300 hover:scale-110 flex-shrink-0`}>
            {recommendation.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2 xs:px-3 py-1 rounded-full text-white ${badge.bg} shadow-md transform transition-transform duration-200 hover:scale-105`}>
                {badge.text}
              </span>
            </div>
            <p className={`text-gray-800 font-medium leading-relaxed ${
              isMobile ? 'text-sm xs:text-base' : 'text-base'
            } tracking-wide break-words hyphens-auto`}>
              {recommendation.text}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-3 xs:p-4">
        <div className="text-center bg-white rounded-2xl p-6 xs:p-8 shadow-2xl max-w-xs xs:max-w-sm w-full mx-2">
          <div className={`${
            isMobile ? 'w-10 h-10 xs:w-12 xs:h-12' : 'w-16 h-16'
          } border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4 xs:mb-6 mx-auto`}></div>
          <p className={`text-gray-700 font-semibold ${
            isMobile ? 'text-sm xs:text-base' : 'text-lg'
          } animate-pulse`}>Analyzing your farm data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-3 xs:p-4">
        <div className="text-center bg-white rounded-2xl p-6 xs:p-8 shadow-2xl max-w-sm w-full mx-2">
          <div className={`text-red-500 ${
            isMobile ? 'text-4xl xs:text-5xl' : 'text-7xl'
          } mb-4 xs:mb-6 animate-bounce`}>⚠️</div>
          <p className={`text-gray-700 mb-4 xs:mb-6 font-medium ${
            isMobile ? 'text-sm xs:text-base' : 'text-lg'
          } leading-relaxed`}>{error}</p>
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => window.location.reload()}
              className={`w-full px-4 xs:px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${
                isMobile ? 'text-sm xs:text-base' : 'text-base'
              }`}
            >
              Retry Analysis
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className={`w-full px-4 xs:px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${
                isMobile ? 'text-sm xs:text-base' : 'text-base'
              }`}
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center p-3 xs:p-4">
        <div className="text-center bg-white rounded-2xl p-6 xs:p-8 shadow-2xl max-w-xs xs:max-w-sm w-full mx-2">
          <p className={`text-gray-700 mb-4 xs:mb-6 font-medium ${
            isMobile ? 'text-sm xs:text-base' : 'text-lg'
          }`}>No results available</p>
          <button
            onClick={() => window.location.href = '/'}
            className={`w-full px-6 xs:px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${
              isMobile ? 'text-sm xs:text-base' : 'text-base'
            }`}
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const riskConfig = getRiskConfig(result.risk_level);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-4 xs:py-6 md:py-8 lg:py-12 px-2 xs:px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-6 xs:mb-8 md:mb-12">
          <h1 className={`${
            isMobile 
              ? 'text-xl xs:text-2xl leading-tight' 
              : 'text-3xl md:text-4xl lg:text-5xl'
          } font-bold text-gray-800 mb-2 xs:mb-3 md:mb-4 animate-fade-pop-in tracking-tight px-2`}>
            Pig Farm Risk Assessment Report
          </h1>
          <p className={`text-gray-600 animate-fade-in ${
            isMobile ? 'text-sm xs:text-base' : 'text-lg lg:text-xl'
          } font-medium px-3`} style={{animationDelay: '0.3s'}}>
            Comprehensive analysis results for your pig farm
          </p>
          
          {/* Confidence Levels */}
          {result.confidence && (
            <div className={`mt-3 xs:mt-4 md:mt-6 ${
              isMobile ? 'text-xs' : 'text-sm'
            } text-gray-500 animate-fade-in bg-white rounded-lg p-3 xs:p-4 shadow-md mx-2 xs:mx-4`} 
            style={{animationDelay: '0.6s'}}>
              <p className="font-medium">
                <span className="font-bold text-gray-700">Confidence Levels:</span>
                <div className={`mt-2 ${isMobile ? 'space-y-1' : 'space-x-4'} ${isMobile ? 'flex flex-col' : 'flex flex-wrap justify-center'}`}>
                  <span className={`${isMobile ? 'block' : 'inline-block'}`}>
                    Low: <span className="text-green-600 font-semibold">{(result.confidence.Low * 100).toFixed(1)}%</span>
                  </span>
                  <span className={`${isMobile ? 'block' : 'inline-block'}`}>
                    Medium: <span className="text-yellow-600 font-semibold">{(result.confidence.Medium * 100).toFixed(1)}%</span>
                  </span>
                  <span className={`${isMobile ? 'block' : 'inline-block'}`}>
                    High: <span className="text-red-600 font-semibold">{(result.confidence.High * 100).toFixed(1)}%</span>
                  </span>
                </div>
              </p>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className={`${
          isMobile ? 'flex flex-col space-y-6' : 'grid lg:grid-cols-2 gap-8 lg:gap-16'
        } mb-6 xs:mb-8 md:mb-12 lg:mb-16`}>
          
          {/* Speedometer Section */}
          <div className="flex items-center justify-center order-1">
            <div className={`animate-slide-in-left bg-white rounded-2xl xs:rounded-3xl p-3 xs:p-4 md:p-6 lg:p-8 shadow-2xl w-full ${
              isMobile ? 'max-w-sm' : 'max-w-md'
            }`}>
              <Speedometer
                value={riskConfig.value}
                color={riskConfig.color}
                config={riskConfig}
              />
              <div className={`text-center ${isMobile ? 'mt-3 xs:mt-4' : 'mt-6 lg:mt-8'}`}>
                <h2 className={`${
                  isMobile ? 'text-lg xs:text-xl' : 'text-2xl sm:text-3xl'
                } font-bold text-gray-800 mb-1 xs:mb-2 animate-fade-in-delayed`}>
                  {riskConfig.title}
                </h2>
                <p className={`text-gray-600 ${
                  isMobile ? 'text-sm xs:text-base' : 'text-lg'
                } font-medium animate-fade-in-more-delayed px-2`}>
                  {riskConfig.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="space-y-2 xs:space-y-3 order-2">
            <h3 className={`${
              isMobile ? 'text-lg xs:text-xl' : 'text-2xl sm:text-3xl'
            } font-bold text-gray-800 mb-3 xs:mb-4 md:mb-6 lg:mb-8 animate-slide-in-right text-center ${
              !isMobile ? 'lg:text-left' : ''
            }`}>
              Recommended Actions
            </h3>
            
            {riskConfig.recommendations.map((rec, index) => (
              <RecommendationCard
                key={index}
                recommendation={rec}
                isVisible={animateRecommendations.includes(index)}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`${
          isMobile ? 'flex flex-col space-y-3' : 'flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center'
        } animate-fade-in-up px-2 xs:px-4`}>
          <button
            onClick={() => window.location.href = '/'}
            className={`w-full ${
              !isMobile ? 'sm:w-auto' : ''
            } px-4 xs:px-6 lg:px-10 py-3 xs:py-4 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 font-semibold ${
              isMobile ? 'text-sm xs:text-base' : 'text-base sm:text-lg'
            } shadow-lg hover:shadow-xl transform hover:scale-105`}
          >
            ← Back to Home
          </button>
          <button
            onClick={() => window.location.href = '/new-analysis'}
            className={`w-full ${
              !isMobile ? 'sm:w-auto' : ''
            } px-4 xs:px-6 lg:px-10 py-3 xs:py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold ${
              isMobile ? 'text-sm xs:text-base' : 'text-base sm:text-lg'
            } shadow-lg hover:shadow-xl transform hover:scale-105`}
          >
            🔄 New Analysis
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-pop-in {
          0% { opacity: 0; transform: scale(0.8) translateY(30px); }
          60% { transform: scale(1.05) translateY(-10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .animate-fade-pop-in {
          animation: fade-pop-in 1s ease-out 0.2s both;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out both;
        }

        .animate-fade-in-delayed {
          animation: fade-in 0.8s ease-out 1.2s both;
        }

        .animate-fade-in-more-delayed {
          animation: fade-in 0.8s ease-out 1.4s both;
        }

        .animate-slide-in-left {
          animation: slideInLeft 1s ease-out 0.5s both;
        }

        .animate-slide-in-right {
          animation: slideInRight 1s ease-out 0.8s both;
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out 1.6s both;
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Mobile-specific adjustments */
        @media (max-width: 640px) {
          .animate-slide-in-left,
          .animate-slide-in-right {
            animation-name: fade-in;
          }
        }

        /* Extra small devices */
        @media (max-width: 475px) {
          .xs\\:text-xs { font-size: 0.75rem; }
          .xs\\:text-sm { font-size: 0.875rem; }
          .xs\\:text-base { font-size: 1rem; }
          .xs\\:text-lg { font-size: 1.125rem; }
          .xs\\:text-xl { font-size: 1.25rem; }
          .xs\\:text-2xl { font-size: 1.5rem; }
          .xs\\:text-3xl { font-size: 1.875rem; }
          .xs\\:p-4 { padding: 1rem; }
          .xs\\:p-8 { padding: 2rem; }
          .xs\\:px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
          .xs\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
          .xs\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
          .xs\\:py-4 { padding-top: 1rem; padding-bottom: 1rem; }
          .xs\\:py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
          .xs\\:mb-3 { margin-bottom: 0.75rem; }
          .xs\\:mb-4 { margin-bottom: 1rem; }
          .xs\\:mb-6 { margin-bottom: 1.5rem; }
          .xs\\:mb-8 { margin-bottom: 2rem; }
          .xs\\:mt-4 { margin-top: 1rem; }
          .xs\\:mt-6 { margin-top: 1.5rem; }
          .xs\\:space-y-3 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 0.75rem;
          }
          .xs\\:w-12 { width: 3rem; }
          .xs\\:h-12 { width: 3rem; }
          .xs\\:w-52 { width: 13rem; }
          .xs\\:h-52 { height: 13rem; }
          .xs\\:max-w-sm { max-width: 24rem; }
          .xs\\:rounded-3xl { border-radius: 1.5rem; }
        }

        /* Text wrapping and hyphenation for better mobile readability */
        .hyphens-auto {
          hyphens: auto;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
      `}</style>
    </div>
  );
};

export default PigRiskResultPage;