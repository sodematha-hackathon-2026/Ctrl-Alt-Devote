import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import type { PaginatedUsers } from '../types/types';
import './VolunteersPage.css';

const VolunteersPage: React.FC = () => {
    const [users, setUsers] = useState<PaginatedUsers | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size] = useState(50); // Increased size to see more at once

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAllUsers(page, size);
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleVolunteerAction = async (userId: string, approve: boolean) => {
        try {
            await userService.toggleVolunteer(userId, approve);
            await fetchUsers();
            alert(approve ? 'Volunteer approved!' : 'Volunteer request rejected/removed.');
        } catch (error) {
            console.error('Error updating volunteer status:', error);
            alert('Failed to update volunteer status');
        }
    };

    if (loading) {
        return <div className="loading">Loading volunteers...</div>;
    }

    const pendingVolunteers = users?.content.filter(u => u.volunteerRequest && !u.isVolunteer) || [];
    const activeVolunteers = users?.content.filter(u => u.isVolunteer) || [];

    return (
        <div className="volunteers-page">
            <div className="page-header">
                <h2>Volunteer Management</h2>
                {/* <button onClick={handleExportUsers}>Export CSV</button> */}
            </div>

            {users?.content.length === 0 ? (
                <p className="text-center mt-lg">No volunteers found.</p>
            ) : (
                <>
                    {/* Section 1: Requires Approval */}
                    <div className="section mt-lg">
                        <h3 className="section-title">Requires Approval ({pendingVolunteers.length})</h3>
                        {pendingVolunteers.length > 0 ? (
                            <div className="users-table-container card">
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            <th className="col-name">Name</th>
                                            <th className="col-email">Email</th>
                                            <th className="col-phone">Phone</th>
                                            <th className="col-date">Joined</th>
                                            <th className="col-actions">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingVolunteers.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.fullName}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phoneNumber}</td>
                                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            onClick={() => handleVolunteerAction(user.id, true)}
                                                            className="success small"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleVolunteerAction(user.id, false)}
                                                            className="danger small"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center mt-md text-secondary">No pending requests.</p>
                        )}
                    </div>

                    {/* Section 2: Active Volunteers */}
                    <div className="section mt-xl">
                        <h3 className="section-title">Active Volunteers ({activeVolunteers.length})</h3>
                        {activeVolunteers.length > 0 ? (
                            <div className="users-table-container card">
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            <th className="col-name">Name</th>
                                            <th className="col-email">Email</th>
                                            <th className="col-phone">Phone</th>
                                            <th className="col-date">Joined</th>
                                            <th className="col-actions">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeVolunteers.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.fullName}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phoneNumber}</td>
                                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <button
                                                        onClick={() => handleVolunteerAction(user.id, false)}
                                                        className="danger small"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center mt-md text-secondary">No active volunteers.</p>
                        )}
                    </div>
                </>
            )}

            {/* Pagination */}
            {users && users.totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 0}
                        className="secondary"
                    >
                        &larr; Previous
                    </button>
                    <span className="pagination-info">
                        Page {page + 1} of {users.totalPages}
                    </span>
                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page >= users.totalPages - 1}
                        className="secondary"
                    >
                        Next &rarr;
                    </button>
                </div>
            )}
        </div>
    );
};

export default VolunteersPage;
