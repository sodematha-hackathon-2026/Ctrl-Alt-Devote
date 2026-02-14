import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import logoImg from '../assets/logo.png';
import './LoginPage.css';

const LoginPage: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const { login, error: authError, clearError } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || '/';

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phoneNumber.length < 10) {
            setLocalError('Please enter a valid phone number');
            return;
        }

        setLoading(true);
        setLocalError(null);
        clearError();

        try {
            await authService.sendOtp(phoneNumber);
            setStep(2);
            alert('OTP sent successfully! (Check terminal if using a mock backend)');
        } catch (err: any) {
            setLocalError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 4) {
            setLocalError('Please enter the verification code');
            return;
        }

        setLoading(true);
        setLocalError(null);
        clearError();

        try {
            await login(phoneNumber, otp);
            navigate(from, { replace: true });
        } catch (err: any) {
            // Error is handled by AuthContext
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card card">
                    <div className="login-header text-center">
                        <img src={logoImg} alt="Sode Matha Logo" className="login-logo" />
                        <h2>Admin Login</h2>
                        <p>Access the Sode Seva Management Panel</p>
                    </div>

                    {(localError || authError) && (
                        <div className="error-message">
                            {localError || authError}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="mt-lg">
                            <div className="form-group">
                                <label>Phone Number</label>
                                <div className="input-with-prefix">
                                    <span className="prefix">+91</span>
                                    <input
                                        type="tel"
                                        placeholder="Enter 10 digit number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-100 mt-md"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="mt-lg">
                            <div className="form-group">
                                <label>Verification Code</label>
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                    className="otp-input"
                                    autoFocus
                                />
                                <p className="resend-hint mt-sm">
                                    Checking OTP for <strong>{phoneNumber}</strong>.
                                    <button type="button" onClick={() => setStep(1)} className="link-btn">Change number</button>
                                </p>
                            </div>
                            <button
                                type="submit"
                                className="w-100 mt-md"
                                disabled={loading}
                            >
                                {loading ? 'Verifying...' : 'Verify & Login'}
                            </button>
                        </form>
                    )}


                </div>
            </div>
        </div>
    );
};

export default LoginPage;
