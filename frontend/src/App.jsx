import React,{useState} from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage"
import Login from './pages/signupPage';
import SignIn from './pages/SignInPage';
import ContactPage from './pages/contactPage';
import FarmBirdForm from './pages/riskAnalysisForm';
import ScrollToTop from './components/ScrollToTop'; 
import PigFarmForm from './pages/pigRiskForm';
import RiskResultPage from './pages/PigRiskResultPage';
import { ToastContainer } from "react-toastify";
import Training from './pages/trainingPage';
import PigPolicies from './pages/policyPage';
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
        <Route path="/risk-form" element={<FarmBirdForm />} />
        <Route path="/pig-risk-form" element={<PigFarmForm />} />
        <Route path="/risk-result" element={<RiskResultPage />} />
        <Route path="/training" element={<Training />} />
        <Route path="/guidelines" element={<PigPolicies />} />

      </Routes>
    </Router>
    <ToastContainer position="top-right" autoClose={4000} />
    </>
  );
}


export default App;
