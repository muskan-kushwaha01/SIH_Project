import React, { useState } from "react";
import logo from "../assets/images/logo.jpg";

const ContactPage = () => {
  const [language, setLanguage] = useState("en"); // en = English, hi = Hindi
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    issueType: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  // Labels for English & Hindi
  const labels = {
    en: {
      title: "Contact Us",
      name: "Name",
      email: "Email (Optional)",
      location: "Location",
      issueType: "Issue Type",
      selectIssue: "Select an issue",
      vaccination: "Vaccination",
      health: "Health Problem",
      feeding: "Feeding & Nutrition",
      training: "Training Support",
      others: "Others",
      description: "Description",
      placeholderDesc: "Describe your issue...",
      submit: "Submit",
    },
    hi: {
      title: "संपर्क करें",
      name: "नाम",
      email: "ईमेल (वैकल्पिक)",
      location: "स्थान",
      issueType: "समस्या का प्रकार",
      selectIssue: "समस्या चुनें",
      vaccination: "टीकाकरण",
      health: "स्वास्थ्य समस्या",
      feeding: "खुराक और पोषण",
      training: "प्रशिक्षण सहायता",
      others: "अन्य",
      description: "विवरण",
      placeholderDesc: "अपनी समस्या का विवरण लिखें...",
      submit: "जमा करें",
    },
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validation
  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim())
      tempErrors.name = language === "en" ? "Name is required" : "नाम आवश्यक है";
    if (!formData.location.trim())
      tempErrors.location =
        language === "en" ? "Location is required" : "स्थान आवश्यक है";
    if (!formData.issueType)
      tempErrors.issueType =
        language === "en" ? "Please select an issue" : "कृपया समस्या चुनें";
    if (!formData.description.trim() || formData.description.length < 10)
      tempErrors.description =
        language === "en"
          ? "Description must be at least 10 characters"
          : "विवरण कम से कम 10 अक्षरों का होना चाहिए";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted:", formData);
      alert(
        language === "en"
          ? "Thank you! Your issue has been submitted."
          : "धन्यवाद! आपकी समस्या दर्ज की गई है।"
      );
      setFormData({
        name: "",
        email: "",
        location: "",
        issueType: "",
        description: "",
      });
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-8">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="px-3 py-1 text-sm bg-blue-200 rounded-lg hover:bg-blue-300"
          >
            {language === "en" ? "हिंदी" : "English"}
          </button>
        </div>
<div className="mb-6 flex flex-col sm:flex-row items-center justify-center sm:space-x-3 space-y-3 sm:space-y-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
            <img src={logo} alt="Logo" className="w-full h-full object-cover scale-150 object-top" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">BioRaksha</h1>
        </div>
        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {labels[language].title}
        </h2>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {labels[language].name}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={
                language === "en" ? "Enter your name" : "अपना नाम दर्ज करें"
              }
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {labels[language].email}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={
                language === "en"
                  ? "Enter your email (optional)"
                  : "अपना ईमेल दर्ज करें (वैकल्पिक)"
              }
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {labels[language].location}
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder={
                language === "en"
                  ? "Enter your location"
                  : "अपना स्थान दर्ज करें"
              }
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          {/* Issue Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {labels[language].issueType}
            </label>
            <select
              name="issueType"
              value={formData.issueType}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{labels[language].selectIssue}</option>
              <option value="vaccination">{labels[language].vaccination}</option>
              <option value="health">{labels[language].health}</option>
              <option value="feeding">{labels[language].feeding}</option>
              <option value="training">{labels[language].training}</option>
              <option value="others">{labels[language].others}</option>
            </select>
            {errors.issueType && (
              <p className="text-red-500 text-sm mt-1">{errors.issueType}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {labels[language].description}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={labels[language].placeholderDesc}
              rows="4"
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {labels[language].submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
