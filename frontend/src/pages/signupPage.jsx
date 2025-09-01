import React, { useState } from "react";
import axios from "axios"; 
import logo from "../assets/images/logo2.jpg"; 
import { toast } from "react-toastify";

const SignUp = () => {
  const [language, setLanguage] = useState("en");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    farmType: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const translations = {
    en: {
      logo: "BioRaksha",
      heading: "Sign Up",
      name: "Name",
      phone: "Phone Number",
      email: "Email",
      password: "Password",
      farmType: "Farm Type",
      selectFarm: "Select Farm",
      pigFarm: "Pig Farm",
      poultryFarm: "Poultry Farm",
      submit: "Sign Up",
      loading: "Processing...",
      errors: {
        name: "Name is required",
        phone: "Phone Number is required",
        password: "Password is required",
      },
    },
    hi: {
      logo: "बायोरक्षा",
      heading: "साइन अप करें",
      name: "नाम",
      phone: "फ़ोन नंबर",
      email: "ईमेल",
      password: "पासवर्ड",
      farmType: "फार्म का प्रकार",
      selectFarm: "फार्म चुनें",
      pigFarm: "सूअर फार्म",
      poultryFarm: "पोल्ट्री फार्म",
      submit: "साइन अप करें",
      loading: "प्रोसेस हो रहा है...",
      errors: {
        name: "नाम आवश्यक है",
        phone: "फ़ोन नंबर आवश्यक है",
        password: "पासवर्ड आवश्यक है",
      },
    },
  };

  const t = translations[language];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    let newErrors = {};
    if (!formData.name) newErrors.name = t.errors.name;
    if (!formData.phone) newErrors.phone = t.errors.phone;
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = language === "en"
          ? "Please enter a valid email"
          : "कृपया एक मान्य ईमेल दर्ज करें";
      }
    }
    if (!formData.password) newErrors.password = t.errors.password;
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:5000/auth/signup", formData); 
        console.log("Backend response:", response.data);
        toast.success("User signed in successfully!");
        setFormData({ name: "", phone: "", email: "", password: "", farmType: "" });
      } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error.message);
        toast.error(error.response?.data?.detail || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans px-4 sm:px-6 lg:px-8">
      <form
        className="relative bg-white w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-xl"
        onSubmit={handleSubmit}
      >
        {/* Language Toggle */}
        <div className="absolute top-4 right-4">
          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition"
          >
            {language === "en" ? "हिंदी" : "English"}
          </button>
        </div>
{/* Logo + Title */}
<div className="flex items-center  justify-start absolute top-5 left-5 ">
  <div className="w-20 h-12 flex items-center"> 
    <img src={logo} alt="Logo" className="h-11 object-contain" />
  </div>
  <h1 className="text-xl md:text-2xl font-bold">
    <span className="text-green-600">Bio</span>
    <span className="text-blue-900">Raksha</span>
  </h1>
</div>

        <h2 className="text-xl sm:text-2xl text-center font-semibold text-gray-700 mt-18 mb-6">{t.heading}</h2>

        {/* Inputs */}
        <div className="space-y-4 text-left">
          {/* Name */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium">{t.name}</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium">{t.phone}</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone no."
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium">{t.email}</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your mail id. (optional)"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium">{t.password}</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Farm Type */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium">{t.farmType}</label>
            <select
              name="farmType"
              value={formData.farmType}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="" disabled>{t.selectFarm || "Select Farm"}</option>
              <option value="pig farm">{t.pigFarm}</option>
              <option value="poultry farm">{t.poultryFarm}</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-lg font-semibold transition flex justify-center items-center"
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              {t.loading}
            </span>
          ) : (
            t.submit
          )}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
