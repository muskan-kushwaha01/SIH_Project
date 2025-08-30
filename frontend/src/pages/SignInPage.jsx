import React, { useState } from 'react';
import axios from 'axios'; 
import logo from '../assets/images/logo.jpg';
import Loader from '../components/Loader';

const translations = {
  en: {
    signIn: 'Sign In',
    phoneNumber: 'Phone Number',
    password: 'Password',
    submit: 'Submit',
    toggleLanguage: 'हिंदी',
    errors: {
      phone: 'Phone number must be 10 digits and contain only numbers',
      password: 'Password is required',
    }
  },
  hi: {
    signIn: 'साइन इन करें',
    phoneNumber: 'फ़ोन नंबर',
    password: 'पासवर्ड',
    submit: 'प्रस्तुत',
    toggleLanguage: 'English',
    errors: {
      phone: 'फ़ोन नंबर 10 अंकों का होना चाहिए और केवल अंक होने चाहिए',
      password: 'पासवर्ड आवश्यक है',
    }
  },
};

const SignIn = () => {
  const [language, setLanguage] = useState('en');
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const t = translations[language];
  const toggleLanguage = () => setLanguage(language === 'en' ? 'hi' : 'en');

  const validate = () => {
    const newErrors = {};
    if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = t.errors.phone;
    if (!formData.password) newErrors.password = t.errors.password;
    return newErrors;
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        // Call backend API for sign in
        const response = await axios.post("http://localhost:5000/signin", formData); 
        console.log("Backend response:", response.data);
        alert("User signed in successfully!");
        setFormData({ phone: '', password: '' });
      } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error.message);
        alert(error.response?.data?.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4 sm:px-6 lg:px-8 font-sans">
      {loading ? (
        <Loader />
      ) : (
        <form 
          className="relative bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg text-center"
          onSubmit={handleSubmit}
        >
          {/* Language Toggle */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <button
              type="button"
              onClick={toggleLanguage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition"
            >
              {t.toggleLanguage}
            </button>
          </div>

          {/* Logo + Title */}
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-center sm:space-x-3 space-y-3 sm:space-y-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
              <img src={logo} alt="Logo" className="w-full h-full object-cover scale-150 object-top" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">BioRaksha</h1>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6">{t.signIn}</h2>

          {/* Phone Number */}
          <div className="mb-4 text-left">
            <label className="block mb-2 text-gray-600 font-medium text-sm sm:text-base">{t.phoneNumber}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none text-sm sm:text-base"
            />
            {errors.phone && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Password */}
          <div className="mb-4 text-left">
            <label className="block mb-2 text-gray-600 font-medium text-sm sm:text-base">{t.password}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none text-sm sm:text-base"
            />
            {errors.password && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white w-full py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition"
          >
            {t.submit}
          </button>
        </form>
      )}
    </div>
  );
};

export default SignIn;
