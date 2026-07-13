import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    const isAuthenticated =
        localStorage.getItem('adminAuthenticated') === 'true' && Boolean(token);
    const location = useLocation();

    if (!isAuthenticated) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminAuthenticated');
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
