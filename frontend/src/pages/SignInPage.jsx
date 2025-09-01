import React, { useState } from 'react';
import axios from 'axios'; 
import logo from '../assets/images/logo2.jpg';
import Loader from '../components/Loader';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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

const SignIn = ({ setIsLoggedIn }) => {
  const [language, setLanguage] = useState('en');
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        const response = await axios.post("http://localhost:5000/auth/signin", formData); 
        console.log("Backend response:", response.data);
        toast.success("User signed in successfully!");
        setIsLoggedIn(true);
        navigate("/");
        setFormData({ phone: '', password: '' });
      } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error.message);
        toast.error(error.response?.data?.message || "Something went wrong!");
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

<div className="flex items-center  justify-start absolute top-5 left-5 ">
  <div className="w-20 h-12 flex items-center"> 
    <img src={logo} alt="Logo" className="h-11 object-contain" />
  </div>
  <h1 className="text-xl md:text-2xl font-bold">
    <span className="text-green-600">Bio</span>
    <span className="text-blue-900">Raksha</span>
  </h1>
</div>


          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mt-15 mb-6">{t.signIn}</h2>

          {/* Phone Number */}
          <div className="mb-4 text-left">
            <label className="block mb-2 text-gray-600 font-medium text-sm sm:text-base">{t.phoneNumber}</label>
            <input
              type="tel"
              name="phone"
              placeholder='Enter your phone no.'
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
              placeholder='Enter your password'
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
