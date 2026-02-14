import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService'; // Import authService
import './UserProfileUpdatePage.css';

const UserProfileUpdatePage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const message = (location.state as any)?.message;

    // Initial state from user context
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        volunteerRequest: user?.volunteerRequest || false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authService.updateProfile({
                ...formData,
                id: user?.id
            });
            alert('Profile updated successfully!');
            // Ideally update context here. For now, navigate back which might trigger re-fetch if implemented, 
            // or we might need to reload. 
            // Let's assume we might need to refresh the page or context.
            window.location.href = '/profile'; // Force reload to get fresh user data
        } catch (error) {
            console.error('Failed to update profile', error);
            alert('Failed to update profile');
        }
    };

    return (
        <div className="user-profile-update-page">
            {message && (
                <div className="alert-banner warning mb-lg">
                    {message}
                </div>
            )}
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/profile')}>
                    &larr; Back
                </button>
                <h1>Edit Profile</h1>
            </div>

            <div className="update-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </div>

                    {!user?.isVolunteer && user?.role !== 'ADMIN' && (
                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="volunteerRequest"
                                    checked={formData.volunteerRequest}
                                    onChange={handleChange}
                                />
                                <span>Apply to be a Volunteer?</span>
                            </label>
                            <p className="hint-text">Check this box if you want to request verify-able volunteer status.</p>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => navigate('/profile')}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfileUpdatePage;
