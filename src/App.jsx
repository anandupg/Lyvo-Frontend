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
import RoomOwnerDashboard from "./pages/owner/RoomOwnerDashboard";
// Import owner pages and components
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerProperties from "./pages/owner/Properties";
import OwnerProfile from "./pages/owner/Profile";
// Import admin pages and components
import AdminDashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import AdminProperties from "./pages/admin/Properties";
import Settings from "./pages/admin/Settings";
import AdminNotFound from "./pages/admin/NotFound";

// Protected Route Component for Admin
const ProtectedAdminRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');

      if (token && user) {
        try {
          const userData = JSON.parse(user);
          // Check if user has admin role (role === 2)
          if (userData.role === 2) {
            setIsAuthorized(true);
          } else {
            // Redirect to login if not admin
            window.location.href = '/login';
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          window.location.href = '/login';
        }
      } else {
        // Redirect to login if no token
        window.location.href = '/login';
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? children : null;
};

// Protected Route Component for Owner
const ProtectedOwnerRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');

      if (token && user) {
        try {
          const userData = JSON.parse(user);
          // Check if user has owner role (role === 3)
          if (userData.role === 3) {
            setIsAuthorized(true);
          } else {
            // Redirect to login if not owner
            window.location.href = '/login';
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          window.location.href = '/login';
        }
      } else {
        // Redirect to login if no token
        window.location.href = '/login';
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? children : null;
};

function AppRoutesWithLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Check if current route is an admin or owner route
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOwnerRoute = location.pathname.startsWith('/owner');

  return (
    <>
      {loading && <Loader />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Main site routes */}
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
          <Route path="/room-owner-dashboard" element={<RoomOwnerDashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Owner routes - protected with role-based authentication */}
          <Route path="/owner-dashboard" element={
            <ProtectedOwnerRoute>
              <OwnerDashboard />
            </ProtectedOwnerRoute>
          } />
          <Route path="/owner-properties" element={
            <ProtectedOwnerRoute>
              <OwnerProperties />
            </ProtectedOwnerRoute>
          } />
          <Route path="/owner-profile" element={
            <ProtectedOwnerRoute>
              <OwnerProfile />
            </ProtectedOwnerRoute>
          } />

          {/* Admin routes - protected with role-based authentication */}
          <Route path="/admin-dashboard" element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin-users" element={
            <ProtectedAdminRoute>
              <Users />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin-properties" element={
            <ProtectedAdminRoute>
              <AdminProperties />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin-settings" element={
            <ProtectedAdminRoute>
              <Settings />
            </ProtectedAdminRoute>
          } />

          {/* Admin 404 - catch all admin routes that don't match */}
          <Route path="/admin/*" element={<AdminNotFound />} />

          {/* Main site 404 - catch all other routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function AppContent() {
  const location = useLocation();

  // Check if current route is an admin or owner route
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOwnerRoute = location.pathname.startsWith('/owner');

  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
      {/* Only render main Navbar and Footer for non-admin and non-owner routes */}
      {!isAdminRoute && !isOwnerRoute && <Navbar />}
      <AppRoutesWithLoader />
      {!isAdminRoute && !isOwnerRoute && <Footer />}
      {/* Only render Chatbot for non-admin and non-owner routes */}
      {!isAdminRoute && !isOwnerRoute && <Chatbot />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App; 