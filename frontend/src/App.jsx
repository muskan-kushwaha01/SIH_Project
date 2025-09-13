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
import DynamicGuidelines from './pages/dynamicPolicypage'; // New dynamic component
import DynamicRiskAnalysis from './pages/dynamicRiskAnalysisPage'; // New dynamic component
import "react-toastify/dist/ReactToastify.css";
import PoultryRiskResultPage from './pages/poultryResultPage';
import Vaccination from './pages/pigVaccination';
import AppointmentPage from './pages/appointment';
import PoultryVaccinationDashboard from './pages/poultryVaccination';
import DynamicVaccination from './pages/dynamicVaccinePage';
import PigPolicies from './pages/policyPage';
import Policies from './pages/poultryPolicypage';


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
        <Route path="/poultry-result" element={<PoultryRiskResultPage />} />
        <Route path="/vaccination" element={<Vaccination />} />
        <Route path="/training" element={<Training />} />
        <Route path="/appointment" element={<AppointmentPage />} />
        
        {/* ✅ NEW: Dynamic routes based on farm type */}
        <Route path="/guidelines" element={<DynamicGuidelines />} />
        <Route path="/risk-analysis" element={<DynamicRiskAnalysis />} />
        
        {/* ✅ Keep individual routes for direct access/backward compatibility */}
        <Route path="/poultry-risk-form" element={<FarmBirdForm />} />
        <Route path="/pig-risk-form" element={<PigFarmForm />} />
        <Route path="/pig-guidelines" element={<PigPolicies />} />
        <Route path="/poultry-guidelines" element={<Policies />} />
        <Route path="/poultry-vaccination" element={<PoultryVaccinationDashboard />} />
        <Route path="/dynamic-vaccination" element={<DynamicVaccination />} />


      </Routes>
    </Router>
    <ToastContainer position="top-right" autoClose={4000} />
    </>
  );
}

export default App;