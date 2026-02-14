import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const AdminLayout: React.FC = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: '' },
        { path: '/timings', label: 'Timings', icon: '' },
        { path: '/events', label: 'Events', icon: '' },
        { path: '/gallery', label: 'Gallery', icon: '' },
        { path: '/volunteers', label: 'Volunteers', icon: '' },
        { path: '/volunteer-opportunities', label: 'Opportunities', icon: '' },
    ];

    return (
        <div className="admin-layout">
            {/* Top Navbar */}
            <nav className="top-navbar">
                <div className="navbar-brand">
                    <h2>Seva Admin</h2>
                </div>

                <div className="navbar-menu">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="navbar-actions">
                    <Link to="/profile" className="user-profile-link">
                        <div className="user-profile">
                            {/* <span className="user-icon">👤</span> */}
                            <div className="user-info">
                                <span className="user-name">{user?.fullName || 'Admin'}</span>
                            </div>
                        </div>
                    </Link>
                    <button onClick={logout} className="logout-btn" title="Logout">
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="main-content">
                <main className="content-body">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
