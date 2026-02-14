import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RequireProfileCompletion: React.FC = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="loading">Loading...</div>; // Or a proper spinner
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if name or email is missing/empty
    // Assuming backend returns empty string or null for missing fields
    const isProfileComplete =
        user.fullName && user.fullName.trim() !== '' &&
        user.email && user.email.trim() !== '';

    if (!isProfileComplete) {
        // Allow access to profile edit page to complete profile
        // But we are wrapping main routes, so we redirect OUT of here to the edit page
        return <Navigate to="/profile/edit" state={{ from: location, message: "Please complete your profile to continue." }} replace />;
    }

    return <Outlet />;
};

export default RequireProfileCompletion;
