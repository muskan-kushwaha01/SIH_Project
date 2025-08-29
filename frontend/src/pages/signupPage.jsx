import React, { useState } from "react";
import logo from "../assets/images/logo.jpg"; 

const Login = () => {
  const [language, setLanguage] = useState("en");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    farmType: "pig farm",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loader state

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
        email: "Email is required",
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
        email: "ईमेल आवश्यक है",
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
    let newErrors = {};
    if (!formData.name) newErrors.name = t.errors.name ;
    if (!formData.phone) newErrors.phone = t.errors.phone;
    if (!formData.email) newErrors.email = t.errors.email;
    if (!formData.password) newErrors.password = t.errors.password ;
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true); // Show loader
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        alert("Form submitted successfully!");
        setFormData({ name: "", phone: "", email: "", password: "", farmType: "pig farm" });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Hide loader
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

    {/* Logo + BioRaksha */}
    <div className="mb-6 flex items-center justify-center space-x-3">
      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
        <img
          src={logo}
          alt="Logo"
          className="w-full h-full object-cover scale-200 object-top"
        />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">{t.logo}</h1>
    </div>

    <h2 className="text-xl sm:text-2xl text-center font-semibold text-gray-700 mb-6">{t.heading}</h2>

    {/* Inputs */}
    <div className="space-y-4 text-left">
      {/* Name */}
      <div>
        <label className="block mb-1 text-gray-600 font-medium">{t.name}</label>
        <input
          type="text"
          name="name"
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
        >
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

export default Login;
