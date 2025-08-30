import React  from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage"
import Login from './pages/signupPage';
import SignIn from './pages/SignInPage';
import ContactPage from './pages/contactPage';
import FarmBirdForm from './pages/riskAnalysisForm';


function App() {
  return (
    <Router>
      <Routes>
       <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/risk-form" element={<FarmBirdForm />} />

      </Routes>
    </Router>
  );
}

export default App;
