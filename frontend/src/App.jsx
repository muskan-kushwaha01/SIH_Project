import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage"
import Login from './pages/signupPage';
import SignIn from './pages/SignInPage';
import ContactPage from './pages/contactPage';
import FarmBirdForm from './pages/poultryRiskForm';
import ScrollToTop from './components/ScrollToTop'; 
import PigFarmForm from './pages/pigRiskForm';
import RiskResultPage from './pages/PigRiskResultPage';
import { ToastContainer } from "react-toastify";
import Training from './pages/trainingPage';
import DynamicGuidelines from './pages/DynamicGuidelines'; // New dynamic component
import DynamicRiskAnalysis from './pages/DynamicRiskAnalysis'; // New dynamic component
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
    <Router>
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<LandingPage isLoggedIn={isLoggedIn} />} />
        <Route path="/signup" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signin" element={<SignIn setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/training" element={<Training />} />
        <Route path="/risk-result" element={<RiskResultPage />} />
        
        {/* ✅ NEW: Dynamic routes based on farm type */}
        <Route path="/guidelines" element={<DynamicGuidelines />} />
        <Route path="/risk-analysis" element={<DynamicRiskAnalysis />} />
        
        {/* ✅ Keep individual routes for direct access/backward compatibility */}
        <Route path="/poultry-risk-form" element={<FarmBirdForm />} />
        <Route path="/pig-risk-form" element={<PigFarmForm />} />
        <Route path="/pig-guidelines" element={<DynamicGuidelines />} />
        <Route path="/poultry-guidelines" element={<DynamicGuidelines />} />

      </Routes>
    </Router>
    <ToastContainer position="top-right" autoClose={4000} />
    </>
  );
}

export default App;