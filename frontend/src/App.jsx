import React  from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage"
import Login from './pages/signupPage';
import SignIn from './pages/SignInPage';
import ContactPage from './pages/contactPage';


function App() {
  return (
    <Router>
      <Routes>
       <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/contact" element={<ContactPage />} />

      </Routes>
    </Router>
  );
}

export default App;
