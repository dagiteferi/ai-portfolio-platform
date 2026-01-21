import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login but save the current location they were trying to access
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
