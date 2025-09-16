import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/globals.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Components
import Navbar from './components/layout/Navbar';
import LoginModal from './components/auth/LoginModal';
import SignupModal from './components/auth/SignupModal';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import LandingPage from './pages/LandingPage';
import FarmerDashboard from './pages/FarmerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import AgriOfficerDashboard from './pages/AgriOfficerDashboard';
import Marketplace from './pages/Marketplace';
import CommunityForum from './pages/CommunityForum';
import ResourceLibrary from './pages/ResourceLibrary';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

function AppContent() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onLoginClick={() => setShowLoginModal(true)}
        onSignupClick={() => setShowSignupModal(true)}
      />
      
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Dashboard Routes */}
          <Route 
            path="/farmer-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <FarmerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/seller-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'agri_officer']}>
                <AgriOfficerDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Public/Shared Routes */}
          <Route path="/marketplace" element={<Marketplace />} />
          <Route 
            path="/community" 
            element={
              <ProtectedRoute>
                <CommunityForum />
              </ProtectedRoute>
            } 
          />
          <Route path="/resources" element={<ResourceLibrary />} />
          
          {/* Fallback */}
          <Route path="/unauthorized" element={<div className="flex items-center justify-center h-96"><h2 className="text-2xl text-gray-600">Unauthorized Access</h2></div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Modals */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />
      
      <SignupModal 
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <AppContent />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
