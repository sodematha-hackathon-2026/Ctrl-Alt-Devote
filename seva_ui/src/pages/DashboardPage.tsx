import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import vishwothamaImg from '../assets/Vishwotham1.png';
import vishwavallabhaImg from '../assets/Vishwavallabha1.png';
import logoImg from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { contentService } from '../services/contentService';
import { sevaService } from '../services/sevaService';
import { roomBookingService } from '../services/roomBookingService';
import type { DailyAlankara, SevaBooking, RoomBooking } from '../types/types';
import FileUpload from '../components/FileUpload';
import './DashboardPage.css';
// Reusing some table styles from VolunteersPage if compatible, otherwise we'll add to DashboardPage.css
// Ideally we should move common table styles to a global CSS or component.
// For now, I'll add necessary styles to DashboardPage.css

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [dailyAlankara, setDailyAlankara] = useState<DailyAlankara | null>(null);
    const [loadingAlankara, setLoadingAlankara] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [sevaBookings, setSevaBookings] = useState<SevaBooking[]>([]);
    const [roomBookings, setRoomBookings] = useState<RoomBooking[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(true);

    const fetchAlankara = async () => {
        try {
            const data = await contentService.getLatestDailyAlankara();
            // Backend returns no content (null/empty) if none exists.
            if (data) {
                setDailyAlankara(data);
            }
        } catch (error) {
            console.error("Failed to fetch daily alankara", error);
        } finally {
            setLoadingAlankara(false);
        }
    };

    const fetchBookings = async () => {
        try {
            setLoadingBookings(true);
            const [sevas, rooms] = await Promise.all([
                sevaService.getAllBookings(),
                roomBookingService.getAllBookings()
            ]);
            setSevaBookings(sevas || []);
            setRoomBookings(rooms || []);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoadingBookings(false);
        }
    };

    useEffect(() => {
        fetchAlankara();
        fetchBookings();
    }, []);

    const handleAlankaraUpload = async (url: string) => {
        try {
            const newAlankara = await contentService.uploadDailyAlankara(url);
            setDailyAlankara(newAlankara);
            alert("Daily Alankara uploaded successfully!");
        } catch (error) {
            console.error("Failed to save daily alankara", error);
            alert("Failed to save daily alankara");
        }
    };

    const isAlankaraStale = () => {
        if (!dailyAlankara) return true;
        const uploadedTime = new Date(dailyAlankara.uploadedAt).getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        return (Date.now() - uploadedTime) > twentyFourHours;
    };

    const showStaleAlert = !loadingAlankara && isAlankaraStale();



    return (
        <div className="dashboard-page">
            {/* Header Section with Swamijis */}
            <div className="branded-header">
                <div className="welcome-info">
                    <img src={logoImg} alt="Sode Matha Logo" className="dashboard-logo" />
                    <span className="greeting">Namaste,</span>
                    <h2 className="user-fullname">{user?.fullName || 'Devotee'}</h2>
                </div>


                <div className="swamiji-section">
                    <div className="swamiji-container">
                        <div className="swamiji-circle">
                            <img src={vishwothamaImg} alt="Sri Sri Vishwothama Theertha Swamiji" />
                        </div>
                        <p className="swamiji-name">
                            Sri Sri <br />
                            Vishwothama <br />
                            Theertha Swamiji
                        </p>
                    </div>

                    <div className="swamiji-container">
                        <div className="swamiji-circle">
                            <img src={vishwavallabhaImg} alt="Sri Sri Vishwavallabha Theertha Swamiji" />
                        </div>
                        <p className="swamiji-name">
                            Sri Sri <br />
                            Vishwavallabha <br />
                            Theertha Swamiji
                        </p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content mt-lg">
                {showStaleAlert && (
                    <div className="alert-banner warning mb-md">
                        <strong>Action Required:</strong> Please upload today's Daily Alankara.
                    </div>
                )}

                <div className="stats-grid">
                    <div className="card stat-card">
                        <h3>Daily Alankara</h3>
                        <div className="alankara-section mt-md">
                            <div className="alankara-actions">
                                {dailyAlankara && (
                                    <button
                                        className="secondary"
                                        onClick={() => setShowModal(true)}
                                    >
                                        View Image
                                    </button>
                                )}
                                <FileUpload onUploadSuccess={handleAlankaraUpload} label="Select Image" />
                            </div>
                        </div>
                    </div>

                    <div className="card stat-card">
                        <h3>Quick Actions</h3>
                        <div className="action-buttons mt-md">
                            <button onClick={() => navigate('/timings')}>Update Timings</button>
                            <button className="secondary" onClick={() => navigate('/events')}>Manage Events</button>
                        </div>
                    </div>

                    <div className="card stat-card clickable" onClick={() => navigate('/seva-bookings')}>
                        <h3>Seva Bookings</h3>
                        <div className="stat-content mt-md">
                            <span className="stat-number">{loadingBookings ? '-' : sevaBookings.length}</span>
                            <span className="stat-label">Total Bookings</span>
                        </div>
                    </div>

                    <div className="card stat-card clickable" onClick={() => navigate('/room-bookings')}>
                        <h3>Room Bookings</h3>
                        <div className="stat-content mt-md">
                            <span className="stat-number">{loadingBookings ? '-' : roomBookings.length}</span>
                            <span className="stat-label">Total Bookings</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal for viewing image */}
            {showModal && dailyAlankara && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', maxWidth: '90vh', maxHeight: '90vh', overflow: 'auto' }}>
                        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0 }}>Daily Alankara</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="close-button"
                                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}
                            >
                                &times;
                            </button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img
                                src={dailyAlankara.imageUrl}
                                alt="Daily Alankara"
                                className="modal-image"
                                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', display: 'block' }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
