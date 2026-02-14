import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { volunteerService } from '../services/volunteerService';
import type { VolunteerOpportunity, VolunteerApplication } from '../types/types';
import './VolunteerOpportunitiesPage.css';

const VolunteerOpportunitiesPage: React.FC = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
    const [loading, setLoading] = useState(true);

    // Modals state
    const [showApplicationsModal, setShowApplicationsModal] = useState(false);
    const [selectedOpportunity, setSelectedOpportunity] = useState<VolunteerOpportunity | null>(null);
    const [applications, setApplications] = useState<VolunteerApplication[]>([]);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Partial<VolunteerOpportunity>>({
        title: '',
        description: '',
        requiredSkills: '',
        imageUrl: '',
        status: 'OPEN'
    });

    useEffect(() => {
        fetchOpportunities();
    }, [user]);

    const fetchOpportunities = async () => {
        try {
            setLoading(true);
            const data = isAdmin
                ? await volunteerService.getAllOpportunities()
                : await volunteerService.getOpenOpportunities();
            setOpportunities(data);
        } catch (error) {
            console.error('Error fetching opportunities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await volunteerService.createOpportunity(formData);
            setShowForm(false);
            fetchOpportunities();
            setFormData({ title: '', description: '', requiredSkills: '', imageUrl: '', status: 'OPEN' });
            alert('Opportunity created successfully!');
        } catch (error: any) {
            console.error('Error creating opportunity:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to create opportunity';
            alert(`Failed to create opportunity: ${errorMsg}`);
        }
    };

    const handleApply = async (id: string) => {
        if (!window.confirm('Are you sure you want to apply for this opportunity?')) return;
        try {
            await volunteerService.applyForOpportunity(id);
            alert('Application submitted successfully!');
            fetchOpportunities();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to apply');
        }
    };

    const handleViewApplications = async (opportunity: VolunteerOpportunity) => {
        setSelectedOpportunity(opportunity);
        try {
            const apps = await volunteerService.getApplications(opportunity.id);
            setApplications(apps);
            setShowApplicationsModal(true);
        } catch (error) {
            alert('Failed to load applications');
        }
    };

    const handleUpdateStatus = async (appId: string, status: VolunteerApplication['status']) => {
        try {
            await volunteerService.updateApplicationStatus(appId, status);
            if (selectedOpportunity) {
                const apps = await volunteerService.getApplications(selectedOpportunity.id);
                setApplications(apps);
            }
        } catch (error) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="loading">Loading opportunities...</div>;

    return (
        <div className="volunteer-opportunities-page">
            <div className="page-header">
                <h2>Volunteer Opportunities</h2>
                {isAdmin && !showForm && (
                    <button onClick={() => setShowForm(true)}>
                        + Create Opportunity
                    </button>
                )}
            </div>

            {showForm ? (
                <div className="card form-card mb-lg">
                    <h3 style={{ marginBottom: '20px' }}>Create Opportunity</h3>
                    <form onSubmit={handleCreate}>
                        <div className="form-group">
                            <label>Title *</label>
                            <input
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description *</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Required Skills *</label>
                            <textarea
                                value={formData.requiredSkills}
                                onChange={e => setFormData({ ...formData, requiredSkills: e.target.value })}
                                required
                            />
                        </div>
                        <div className="button-group gap-md">
                            <button type="submit" className="primary">Create</button>
                            <button type="button" onClick={() => setShowForm(false)} className="secondary">Cancel</button>
                        </div>
                    </form>
                </div>

            ) : (
                <>
                    {opportunities.length === 0 ? (
                        <p className="text-center mt-lg">
                            {isAdmin
                                ? 'No volunteer opportunities found. Click "Create Opportunity" to get started.'
                                : 'No volunteer opportunities found at the moment.'}
                        </p>
                    ) : (
                        <div className="opportunities-grid">
                            {opportunities.map(opportunity => (
                                <div key={opportunity.id} className="opportunity-card">
                                    {/* ... card content ... */}
                                    {opportunity.imageUrl && (
                                        <img src={opportunity.imageUrl} alt={opportunity.title} className="opportunity-image" />
                                    )}
                                    <div className="opportunity-content">
                                        <h3 className="opportunity-title">{opportunity.title}</h3>
                                        <p className="opportunity-description">{opportunity.description}</p>

                                        <div className="skills-section">
                                            <div className="skills-label">Required Skills</div>
                                            <div className="skills-text">{opportunity.requiredSkills}</div>
                                        </div>
                                    </div>

                                    <div className="opportunity-meta">
                                        <span className="applicant-count">Applied: {opportunity.applicationCount}</span>
                                        <span className={`status-badge ${opportunity.status}`}>{opportunity.status}</span>
                                    </div>

                                    <div className="card-actions">
                                        {isAdmin ? (
                                            <>
                                                <button
                                                    onClick={() => handleViewApplications(opportunity)}
                                                    className="secondary small"
                                                >
                                                    View Applications
                                                </button>
                                                <button className="secondary small">Edit</button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleApply(opportunity.id)}
                                                className="primary"
                                                disabled={opportunity.status === 'CLOSED'}
                                            >
                                                Apply Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Applications Modal */}
            {showApplicationsModal && selectedOpportunity && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px' }}>
                        <div className="modal-header">
                            <h3>Applications for {selectedOpportunity.title}</h3>
                            <button onClick={() => setShowApplicationsModal(false)} className="close-button">&times;</button>
                        </div>
                        <div className="users-table-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th className="col-name">Name</th>
                                        <th className="col-email">Email</th>
                                        <th className="col-phone">Phone</th>
                                        <th className="col-date">Applied</th>
                                        <th className="col-status">Status</th>
                                        <th className="col-actions">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map(app => (
                                        <tr key={app.id}>
                                            <td>{app.user.fullName}</td>
                                            <td>{app.user.email}</td>
                                            <td>{app.user.phoneNumber}</td>
                                            <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                                            <td><span className={`status-badge ${app.status}`}>{app.status}</span></td>
                                            <td>
                                                {app.status === 'PENDING' && (
                                                    <div className="action-buttons">
                                                        <button
                                                            onClick={() => handleUpdateStatus(app.id, 'APPROVED')}
                                                            className="success small"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                                                            className="danger small"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {applications.length === 0 && (
                                        <tr><td colSpan={6} style={{ textAlign: 'center' }}>No applications yet</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolunteerOpportunitiesPage;
