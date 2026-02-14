import React, { useState, useEffect } from 'react';
import { contentService } from '../services/contentService';
import type { Timings } from '../types/types';
import './TimingsPage.css';

const TimingsPage: React.FC = () => {
    const [timings, setTimings] = useState<Timings[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<Partial<Timings>>({});

    useEffect(() => {
        fetchTimings();
    }, []);

    const fetchTimings = async () => {
        try {
            setLoading(true);
            const data = await contentService.getAllTimings();
            setTimings(data);
        } catch (error) {
            console.error('Error fetching timings:', error);
            alert('Failed to load timings');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (timing: Timings) => {
        setEditingId(timing.id);
        setFormData(timing);
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({});
    };

    const handleSave = async () => {
        if (editingId && formData) {
            try {
                if (editingId === -1) {
                    await contentService.createTimings(formData as Timings);
                    alert('Timing created successfully!');
                } else {
                    await contentService.updateTimings(editingId, formData as Timings);
                    alert('Timings updated successfully!');
                }
                await fetchTimings();
                setEditingId(null);
                setFormData({});
            } catch (error) {
                console.error('Error saving timings:', error);
                alert('Failed to save timings');
            }
        }
    };

    if (loading) {
        return <div className="loading">Loading timings...</div>;
    }

    return (
        <div className="timings-page">
            <div className="page-header">
                <h2>Manage Timings</h2>
                <button onClick={() => {
                    setEditingId(-1); // Use -1 for new entry
                    setFormData({});
                }}>
                    + Add Timing
                </button>
            </div>

            {timings.length === 0 && editingId !== -1 ? (
                <p className="text-center mt-lg">No timings found. Click "Add Timing" to get started.</p>
            ) : (
                <div className="table-container">
                    <table className="timings-table">
                        <thead>
                            <tr>
                                <th>Location</th>
                                <th>Darshan Time</th>
                                <th>Prasada Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {editingId === -1 && (
                                <tr className="editing-row">
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="Location"
                                            value={formData.location || ''}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            autoFocus
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="e.g. 7:00 AM - 1:00 PM"
                                            value={formData.darshanTime || ''}
                                            onChange={(e) => setFormData({ ...formData, darshanTime: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="e.g. 12:30 PM"
                                            value={formData.prasadaTime || ''}
                                            onChange={(e) => setFormData({ ...formData, prasadaTime: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.isActive || false}
                                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            />
                                            Active
                                        </label>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button onClick={handleSave} className="primary-sm">Save</button>
                                            <button onClick={handleCancel} className="secondary-sm">Cancel</button>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {timings.map((timing) => (
                                <tr key={timing.id} className={editingId === timing.id ? 'editing-row' : ''}>
                                    {editingId === timing.id ? (
                                        <>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={formData.location || ''}
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={formData.darshanTime || ''}
                                                    onChange={(e) => setFormData({ ...formData, darshanTime: e.target.value })}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={formData.prasadaTime || ''}
                                                    onChange={(e) => setFormData({ ...formData, prasadaTime: e.target.value })}
                                                />
                                            </td>
                                            <td>
                                                <label className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.isActive || false}
                                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                    />
                                                    Active
                                                </label>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button onClick={handleSave} className="primary-sm">Save</button>
                                                    <button onClick={handleCancel} className="secondary-sm">Cancel</button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{timing.location}</td>
                                            <td>{timing.darshanTime}</td>
                                            <td>{timing.prasadaTime}</td>
                                            <td>
                                                <span className={`status-badge ${timing.isActive ? 'active' : 'inactive'}`}>
                                                    {timing.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <button onClick={() => handleEdit(timing)} className="secondary-sm">
                                                    Edit
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TimingsPage;
