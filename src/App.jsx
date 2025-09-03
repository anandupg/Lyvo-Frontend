import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
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
import Onboarding from "./pages/Onboarding";
import Loader from "./components/Loader";
import RoomOwnerDashboard from "./pages/owner/RoomOwnerDashboard";
// Import owner pages and components
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerProperties from "./pages/owner/Properties";
import OwnerProfile from "./pages/owner/Profile";
import AddProperty from "./pages/owner/AddProperty";
import Messages from "./pages/owner/Messages";
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
          console.log('ProtectedAdminRoute: User role check:', userData.role);
          
          // Check if user has admin role (role === 2)
          if (userData.role === 2) {
            setIsAuthorized(true);
          } else {
            // Redirect to login if not admin
            console.log('ProtectedAdminRoute: User is not admin, redirecting to login');
            window.location.href = '/login';
            return;
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          window.location.href = '/login';
          return;
        }
      } else {
        // Redirect to login if no token
        console.log('ProtectedAdminRoute: No token or user data, redirecting to login');
        window.location.href = '/login';
        return;
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
          console.log('ProtectedOwnerRoute: User role check:', userData.role);
          
          // Check if user has owner role (role === 3)
          if (userData.role === 3) {
            setIsAuthorized(true);
          } else {
            // Redirect to login if not owner
            console.log('ProtectedOwnerRoute: User is not owner, redirecting to login');
            window.location.href = '/login';
            return;
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          window.location.href = '/login';
          return;
        }
      } else {
        // Redirect to login if no token
        console.log('ProtectedOwnerRoute: No token or user data, redirecting to login');
        window.location.href = '/login';
        return;
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

// Protected Route Component for Regular Users (role === 1)
const ProtectedUserRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');

      if (token && user) {
        try {
          const userData = JSON.parse(user);
          console.log('ProtectedUserRoute: User role check:', userData.role);
          
          // Check if user has regular user role (role === 1)
          if (userData.role === 1) {
            setIsAuthorized(true);
          } else if (userData.role === 2) {
            // Redirect admin to admin dashboard
            console.log('ProtectedUserRoute: Redirecting admin to admin dashboard');
            window.location.href = '/admin-dashboard';
            return;
          } else if (userData.role === 3) {
            // Redirect owner to owner dashboard
            console.log('ProtectedUserRoute: Redirecting owner to owner dashboard');
            window.location.href = '/owner-dashboard';
            return;
          } else {
            // Redirect to login if role is invalid
            console.log('ProtectedUserRoute: Invalid role, redirecting to login');
            window.location.href = '/login';
            return;
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          window.location.href = '/login';
          return;
        }
      } else {
        // Redirect to login if no token
        console.log('ProtectedUserRoute: No token or user data, redirecting to login');
        window.location.href = '/login';
        return;
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

// Root-level authentication check component
const RootAuthCheck = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkRootAuth = () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');

      if (token && user) {
        try {
          const userData = JSON.parse(user);
          const currentPath = window.location.pathname;
          
          console.log('RootAuthCheck: User logged in with role:', userData.role, 'on path:', currentPath);
          
          // If user is on a route that doesn't match their role, redirect them
          if (userData.role === 2 && !currentPath.startsWith('/admin')) {
            // Admin user not on admin route - redirect to admin dashboard
            console.log('RootAuthCheck: Redirecting admin to admin dashboard');
            window.location.href = '/admin-dashboard';
            return;
          } else if (userData.role === 3 && !currentPath.startsWith('/owner')) {
            // Owner user not on owner route - redirect to owner dashboard
            console.log('RootAuthCheck: Redirecting owner to owner dashboard');
            window.location.href = '/owner-dashboard';
            return;
          } else if (userData.role === 1 && (currentPath.startsWith('/admin') || currentPath.startsWith('/owner'))) {
            // Regular user on admin/owner route - redirect to user dashboard
            console.log('RootAuthCheck: Redirecting regular user to user dashboard');
            window.location.href = '/dashboard';
            return;
          }
          
          // Special case: if user is on root path (/) and is logged in, redirect to appropriate dashboard
          if (currentPath === '/') {
            if (userData.role === 2) {
              console.log('RootAuthCheck: Root path - redirecting admin to admin dashboard');
              window.location.href = '/admin-dashboard';
              return;
            } else if (userData.role === 3) {
              console.log('RootAuthCheck: Root path - redirecting owner to owner dashboard');
              window.location.href = '/owner-dashboard';
              return;
            } else if (userData.role === 1) {
              console.log('RootAuthCheck: Root path - redirecting regular user to user dashboard');
              window.location.href = '/dashboard';
              return;
            }
          }
        } catch (error) {
          console.error('Error parsing user data in root auth check:', error);
        }
      } else {
        console.log('RootAuthCheck: No user logged in');
      }
      
      setIsChecking(false);
    };

    checkRootAuth();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return children;
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
          <Route path="/dashboard" element={
            <ProtectedUserRoute>
              <Dashboard />
            </ProtectedUserRoute>
          } />
          <Route path="/profile" element={
            <ProtectedUserRoute>
              <Profile />
            </ProtectedUserRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/room-owner-signup" element={<RoomOwnerSignup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/debug-logout" element={<DebugLogout />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/room-owner-dashboard" element={
            <ProtectedOwnerRoute>
              <RoomOwnerDashboard />
            </ProtectedOwnerRoute>
          } />
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
          <Route path="/owner-add-property" element={
            <ProtectedOwnerRoute>
              <AddProperty />
            </ProtectedOwnerRoute>
          } />
          <Route path="/owner-messages" element={
            <ProtectedOwnerRoute>
              <Messages />
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

  // Global authentication check
  useEffect(() => {
    const checkGlobalAuth = () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');

      if (token && user) {
        try {
          const userData = JSON.parse(user);
          const currentPath = location.pathname;
          
          console.log('AppContent: Global auth check - User role:', userData.role, 'on path:', currentPath);
          if (userData.isNewUser && !userData.hasCompletedBehaviorQuestions && currentPath !== '/onboarding') {
            window.location.href = '/onboarding';
            return;
          }
          
          // If user is on a route that doesn't match their role, redirect them
          if (userData.role === 2 && !currentPath.startsWith('/admin')) {
            // Admin user not on admin route - redirect to admin dashboard
            console.log('AppContent: Redirecting admin to admin dashboard');
            window.location.href = '/admin-dashboard';
            return;
          } else if (userData.role === 3 && !currentPath.startsWith('/owner')) {
            // Owner user not on owner route - redirect to owner dashboard
            console.log('AppContent: Redirecting owner to owner dashboard');
            window.location.href = '/owner-dashboard';
            return;
          } else if (userData.role === 1 && (currentPath.startsWith('/admin') || currentPath.startsWith('/owner'))) {
            // Regular user on admin/owner route - redirect to user dashboard
            console.log('AppContent: Redirecting regular user to user dashboard');
            window.location.href = '/dashboard';
            return;
          }
          
          // Special case: if user is on root path (/) and is logged in, redirect to appropriate dashboard
          if (currentPath === '/') {
            if (userData.role === 2) {
              console.log('AppContent: Root path - redirecting admin to admin dashboard');
              window.location.href = '/admin-dashboard';
              return;
            } else if (userData.role === 3) {
              console.log('AppContent: Root path - redirecting owner to owner dashboard');
              window.location.href = '/owner-dashboard';
              return;
            } else if (userData.role === 1) {
              console.log('AppContent: Root path - redirecting regular user to user dashboard');
              window.location.href = '/dashboard';
              return;
            }
          }
        } catch (error) {
          console.error('AppContent: Error parsing user data in global auth check:', error);
        }
      }
    };

    checkGlobalAuth();
  }, [location.pathname]);

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
      <RootAuthCheck>
        <AppContent />
      </RootAuthCheck>
    </BrowserRouter>
  );
}

export default App; 