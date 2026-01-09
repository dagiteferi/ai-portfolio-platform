import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Pages from './components/pages/Pages';
import SkeletonLoader from './components/Splash/SkeletonLoader';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {loading ? (
        <SkeletonLoader />
      ) : (
        <Router>
          <Routes>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/*" element={<Pages />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
