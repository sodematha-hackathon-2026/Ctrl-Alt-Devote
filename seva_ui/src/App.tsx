import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import TimingsPage from './pages/TimingsPage';
import EventsPage from './pages/EventsPage';
import GalleryPage from './pages/GalleryPage';
import VolunteersPage from './pages/VolunteersPage';
import VolunteerOpportunitiesPage from './pages/VolunteerOpportunitiesPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import UserProfileUpdatePage from './pages/UserProfileUpdatePage';
import SevaBookingsPage from './pages/SevaBookingsPage';
import RoomBookingsPage from './pages/RoomBookingsPage';
import './App.css';

import RequireProfileCompletion from './components/RequireProfileCompletion';
// ... imports

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    {/* Routes requiring login AND profile completion */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <RequireProfileCompletion />
                            </ProtectedRoute>
                        }
                    >
                        <Route element={<AdminLayout />}>
                            <Route index element={<DashboardPage />} />
                            <Route path="timings" element={<TimingsPage />} />
                            <Route path="events" element={<EventsPage />} />
                            <Route path="gallery" element={<GalleryPage />} />
                            <Route path="volunteers" element={<VolunteersPage />} />
                            <Route path="volunteer-opportunities" element={<VolunteerOpportunitiesPage />} />
                            <Route path="profile" element={<UserProfilePage />} />
                            <Route path="seva-bookings" element={<SevaBookingsPage />} />
                            <Route path="room-bookings" element={<RoomBookingsPage />} />
                        </Route>
                    </Route>

                    {/* Route for editing profile (must be accessible even if profile incomplete) */}
                    <Route
                        path="/profile/edit"
                        element={
                            <ProtectedRoute>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<UserProfileUpdatePage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
