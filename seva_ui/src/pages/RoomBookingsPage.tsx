import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomBookingService } from '../services/roomBookingService';
import type { RoomBooking } from '../types/types';
import './DashboardPage.css'; // Reusing dashboard styles for now

const RoomBookingsPage: React.FC = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<RoomBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await roomBookingService.getAllBookings();
            setBookings(data || []);
        } catch (error) {
            console.error("Failed to fetch room bookings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (bookingId: string) => {
        if (!window.confirm('Are you sure you want to approve this booking?')) {
            return;
        }

        setProcessingIds(prev => new Set(prev).add(bookingId));
        try {
            await roomBookingService.approveBooking(bookingId);
            await fetchBookings(); // Refresh the list
        } catch (error) {
            console.error("Failed to approve booking", error);
            alert('Failed to approve booking. Please try again.');
        } finally {
            setProcessingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(bookingId);
                return newSet;
            });
        }
    };

    const handleReject = async (bookingId: string) => {
        if (!window.confirm('Are you sure you want to reject this booking?')) {
            return;
        }

        setProcessingIds(prev => new Set(prev).add(bookingId));
        try {
            await roomBookingService.rejectBooking(bookingId);
            await fetchBookings(); // Refresh the list
        } catch (error) {
            console.error("Failed to reject booking", error);
            alert('Failed to reject booking. Please try again.');
        } finally {
            setProcessingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(bookingId);
                return newSet;
            });
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
                <h2>Room Bookings</h2>
            </div>

            <div className="section mt-lg">
                {loading ? (
                    <p>Loading bookings...</p>
                ) : bookings.length > 0 ? (
                    <div className="table-container card">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>Phone Number</th>
                                    <th>Rooms</th>
                                    <th>Guests</th>
                                    <th>Check-In</th>
                                    <th>Check-Out</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => {
                                    const isPending = booking.status === 'PENDING';
                                    const isProcessing = processingIds.has(booking.id);
                                    return (
                                        <tr key={booking.id}>
                                            <td>{booking.userName || '-'}</td>
                                            <td>{booking.userId}</td>
                                            <td>{booking.numberOfRooms}</td>
                                            <td>{booking.numberOfGuests}</td>
                                            <td>{formatDate(booking.checkInDate)}</td>
                                            <td>{formatDate(booking.checkOutDate)}</td>
                                            <td>
                                                <span className={`status-badge ${booking.status?.toLowerCase() || 'pending'}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td>
                                                {isPending && (
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            onClick={() => handleApprove(booking.id)}
                                                            disabled={isProcessing}
                                                            className="btn btn-success"
                                                            style={{
                                                                padding: '4px 12px',
                                                                fontSize: '0.85rem',
                                                                opacity: isProcessing ? 0.6 : 1,
                                                                cursor: isProcessing ? 'wait' : 'pointer'
                                                            }}
                                                        >
                                                            {isProcessing ? 'Processing...' : 'Approve'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(booking.id)}
                                                            disabled={isProcessing}
                                                            className="btn btn-danger"
                                                            style={{
                                                                padding: '4px 12px',
                                                                fontSize: '0.85rem',
                                                                opacity: isProcessing ? 0.6 : 1,
                                                                cursor: isProcessing ? 'wait' : 'pointer'
                                                            }}
                                                        >
                                                            {isProcessing ? 'Processing...' : 'Reject'}
                                                        </button>
                                                    </div>
                                                )}
                                                {!isPending && <span style={{ color: '#888' }}>-</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-secondary text-center">No room bookings found.</p>
                )}
            </div>
        </div>
    );
};

export default RoomBookingsPage;
