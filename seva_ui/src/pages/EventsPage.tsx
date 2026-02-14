import React, { useState, useEffect } from 'react';
import { contentService } from '../services/contentService';
import type { Event } from '../types/types';
import FileUpload from '../components/FileUpload';
import './EventsPage.css';

const EventsPage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [formData, setFormData] = useState<Partial<Event>>({});

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await contentService.getAllEvents();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                await contentService.updateEvent(editingEvent.id!, formData as Event);
            } else {
                await contentService.createEvent(formData as Event);
            }
            await fetchEvents();
            handleCancel();
            alert('Event saved successfully!');
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Failed to save event');
        }
    };

    const handleEdit = (event: Event) => {
        setEditingEvent(event);
        setFormData(event);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this event?')) {
            try {
                await contentService.deleteEvent(id);
                await fetchEvents();
                alert('Event deleted successfully!');
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Failed to delete event');
            }
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingEvent(null);
        setFormData({});
    };

    if (loading) {
        return <div className="loading">Loading events...</div>;
    }

    return (
        <div className="events-page">
            <div className="page-header">
                <h2>Manage Events</h2>
                {!showForm && (
                    <button onClick={() => setShowForm(true)}>+ Add Event</button>
                )}
            </div>

            {showForm && (
                <div className="card form-card mb-lg">
                    <h3 style={{ marginBottom: '20px' }}>{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title *</label>
                            <input
                                type="text"
                                required
                                value={formData.title || ''}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Date *</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date || ''}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Tithi</label>
                                <input
                                    type="text"
                                    value={formData.tithi || ''}
                                    onChange={(e) => setFormData({ ...formData, tithi: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <input
                                type="text"
                                value={formData.category || ''}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                placeholder="e.g., Festival, Utsav"
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                rows={4}
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Event Image</label>
                            <FileUpload
                                onUploadSuccess={(url) => setFormData({ ...formData, imageURL: url })}
                                label="Upload Event Image"
                            />
                            {formData.imageURL && (
                                <div className="mt-sm">
                                    <p className="text-secondary text-sm">Preview:</p>
                                    <img
                                        src={formData.imageURL}
                                        alt="Event Preview"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="button-group gap-md">
                            <button type="submit">Save</button>
                            <button type="button" onClick={handleCancel} className="secondary">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {!showForm && (
                <div className="events-list">
                    {events.length === 0 ? (
                        <p className="text-center">No events found. Click "Add Event" to create one.</p>
                    ) : (
                        events.map((event) => (
                            <div key={event.id} className="event-card card">
                                <div className="event-header">
                                    <h3>{event.title}</h3>
                                    {event.category && <span className="category-badge">{event.category}</span>}
                                </div>
                                <div className="event-info">
                                    <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                                    {event.tithi && <p><strong>Tithi:</strong> {event.tithi}</p>}
                                    {event.description && <p className="description">{event.description}</p>}
                                    {event.imageURL && (
                                        <div className="event-image mt-md">
                                            <img src={event.imageURL} alt={event.title} />
                                        </div>
                                    )}
                                </div>
                                <div className="event-actions">
                                    <button onClick={() => handleEdit(event)} className="secondary">Edit</button>
                                    <button onClick={() => handleDelete(event.id!)} className="danger">Delete</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default EventsPage;
