import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Pages from './components/pages/Pages';
import SkeletonLoader from './components/Splash/SkeletonLoader';
import AdminDashboard from './components/Admin/AdminDashboard';

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
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/*" element={<Pages />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
