import React, { useState } from 'react';
import { User, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Password match validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // ✅ API CALL USING api.js
            const { data } = await api.post('/auth/register', {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
            });

            // ✅ Save auth data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // ✅ Redirect
            window.location.href = '/';

        } catch (err) {
            setError(
                err.response?.data?.message || 
                "Registration failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col font-['Roboto',sans-serif]">
            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Create Account
                        </h1>
                        <p className="text-gray-600">
                            Join ShoeWave and start your journey
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Full Name */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-1 px-4 py-3 border rounded-lg"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-1 px-4 py-3 border rounded-lg"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-1 px-4 py-3 border rounded-lg"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-1 px-4 py-3 border rounded-lg"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black text-white py-3 rounded-lg"
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </button>

                        </form>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Register;
