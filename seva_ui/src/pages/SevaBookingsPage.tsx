import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sevaService } from '../services/sevaService';
import type { SevaBooking } from '../types/types';
import './DashboardPage.css'; // Reusing dashboard styles for now

const SevaBookingsPage: React.FC = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<SevaBooking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await sevaService.getAllBookings();
            setBookings(data || []);
        } catch (error) {
            console.error("Failed to fetch seva bookings", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString();
    };

    return (
        <div className="bookings-page">
            <div className="booking-page-header">
                <button onClick={() => navigate('/')} className="back-button">
                    &larr; Back to Dashboard
                </button>
                <h2>Seva Bookings</h2>
            </div>

            <div className="section mt-lg">
                {loading ? (
                    <p>Loading bookings...</p>
                ) : bookings.length > 0 ? (
                    <div className="table-container card">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Seva Name</th>
                                    <th>Devotee Name</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td>{booking.seva?.titleEnglish || 'N/A'}</td>
                                        <td>{booking.devoteeName}</td>
                                        <td>{formatDate(booking.sevaDate)}</td>
                                        <td>₹{booking.amountPaid}</td>
                                        <td>
                                            <span className={`status-badge ${booking.status?.toLowerCase() || 'pending'}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-secondary text-center">No seva bookings found.</p>
                )}
            </div>
        </div>
    );
};

export default SevaBookingsPage;
