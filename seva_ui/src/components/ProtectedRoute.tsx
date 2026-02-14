import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="loading">Checking authentication...</div>;
    }

    if (!isAuthenticated) {
        // Redirect to login but save the current location to redirect back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isAdmin) {
        return (
            <div className="unauthorized-container text-center mt-xl">
                <h2 className="color-error">Access Denied</h2>
                <p>You do not have administrative privileges to access this area.</p>
                <button onClick={() => window.location.href = '/'}>Go Home</button>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
