import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './UserProfilePage.css';

const UserProfilePage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="user-profile-page">
            <div className="profile-header">
                <h1>User Profile</h1>
                <button className="edit-btn" onClick={() => navigate('/profile/edit')}>
                    Edit Profile
                </button>
            </div>

            <div className="profile-card">
                <div className="profile-avatar">
                </div>
                <div className="profile-details">
                    <div className="detail-item">
                        <label>Name</label>
                        <p>{user?.fullName || 'Devotee'}</p>
                    </div>
                    <div className="detail-item">
                        <label>Role</label>
                        <p>{user?.role || 'User'}</p>
                    </div>
                    {/* Add more fields as needed, e.g., email, phone */}
                    <div className="detail-item">
                        <label>Email</label>
                        <p>{user?.email || 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
