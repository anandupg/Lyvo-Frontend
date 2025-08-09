import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RoomOwnerSignup from "./pages/RoomOwnerSignup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import DebugLogout from "./pages/DebugLogout";
import Loader from "./components/Loader";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RoomOwnerDashboard from "./pages/owner/RoomOwnerDashboard";

function AppRoutesWithLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {loading && <Loader />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/room-owner-signup" element={<RoomOwnerSignup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/debug-logout" element={<DebugLogout />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/room-owner-dashboard" element={<RoomOwnerDashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
      <BrowserRouter>
        <Navbar />
        <AppRoutesWithLoader />
        <Footer />
        <Chatbot />
      </BrowserRouter>
    </div>
  );
}

export default App; 