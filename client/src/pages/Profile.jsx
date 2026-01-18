import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Edit2, LogOut, Loader2, Check, Lock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Edit States
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/me');
            setUser(response.data.data);
            setFormData({
                name: response.data.data.name,
                email: response.data.data.email,
                phone: response.data.data.phone || ''
            });
        }
        catch (err) {
            console.error("Failed to fetch profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        const updateData = { ...formData };

        if (passwords.oldPassword.trim() && passwords.newPassword.trim()) {
            updateData.oldPassword = passwords.oldPassword;
            updateData.newPassword = passwords.newPassword;
        }


        try {
            const response = await api.patch('/users/me', updateData);
            setUser(response.data.data);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
            setPasswords({ oldPassword: '', newPassword: '' });
        }
        catch (err) {
            setMessage({ type: 'error', text: 'Something went wrong' });
        } finally {
            setIsUpdating(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    if (isLoading) return (
        <div className="h-screen flex items-center justify-center bg-white dark:bg-[#0c0a09]">
            <Loader2 className="animate-spin text-stone-600 dark:text-stone-400" size={48} />
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-[#0c0a09] font-['Inter',sans-serif] transition-colors duration-300">
            <Navbar />

            <main className="max-w-4xl mx-auto py-20 px-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl font-light text-stone-900 dark:text-white tracking-tight">Account</h1>
                        <p className="text-stone-500 dark:text-stone-400 mt-2">Manage your personal information and security.</p>
                    </div>
                    <button
                        onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Sidebar / Stats */}
                    <div className="space-y-6">
                        <div className="bg-stone-900 dark:bg-stone-100 rounded-[2rem] p-8 text-white dark:text-stone-900 shadow-xl transition-colors duration-300">
                            <div className="w-20 h-20 bg-white/10 dark:bg-stone-900/10 rounded-2xl flex items-center justify-center mb-6">
                                <User size={40} className="text-white dark:text-stone-900" />
                            </div>
                            <h2 className="text-2xl font-bold">{user?.name}</h2>
                            <p className="text-white/60 dark:text-stone-600 text-sm mb-4 uppercase tracking-widest">{user?.role || 'Customer'}</p>
                            <div className="pt-4 border-t border-white/10 dark:border-stone-900/10">
                                <p className="text-xs text-white/40 dark:text-stone-500 uppercase mb-1">Member Since</p>
                                <p className="font-medium">{new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Form Area */}
                    <div className="md:col-span-2">
                        <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[2rem] p-8 shadow-sm transition-colors duration-300">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-semibold text-stone-900 dark:text-white">Personal Details</h3>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="text-stone-400 dark:text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
                                >
                                    {isEditing ? 'Cancel' : <Edit2 size={20} />}
                                </button>
                            </div>

                            {message.text && (
                                <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Name Input */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 dark:text-stone-600" size={18} />
                                            <input
                                                disabled={!isEditing}
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-800 border-transparent rounded-2xl focus:bg-white dark:focus:bg-stone-700 focus:border-stone-200 dark:focus:border-stone-600 transition-all outline-none disabled:opacity-60 text-stone-900 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    {/* Email Input */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 dark:text-stone-600" size={18} />
                                            <input
                                                disabled={!isEditing}
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-800 border-transparent rounded-2xl focus:bg-white dark:focus:bg-stone-700 focus:border-stone-200 dark:focus:border-stone-600 transition-all outline-none disabled:opacity-60 text-stone-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="pt-6 border-t border-stone-100 dark:border-stone-800 mt-6 space-y-6 animate-in fade-in slide-in-from-top-4">
                                        <h3 className="text-lg font-semibold text-stone-900 dark:text-white flex items-center gap-2">
                                            <Lock size={18} /> Change Password
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <input
                                                type="password"
                                                placeholder="Current Password"
                                                value={passwords.oldPassword}
                                                onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                                                className="w-full px-4 py-4 bg-stone-50 dark:bg-stone-800 border-transparent rounded-2xl focus:bg-white dark:focus:bg-stone-700 focus:border-stone-200 dark:focus:border-stone-600 transition-all outline-none text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500"
                                            />
                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                value={passwords.newPassword}
                                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                                className="w-full px-4 py-4 bg-stone-50 dark:bg-stone-800 border-transparent rounded-2xl focus:bg-white dark:focus:bg-stone-700 focus:border-stone-200 dark:focus:border-stone-600 transition-all outline-none text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-5 rounded-2xl font-bold text-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-all shadow-lg flex items-center justify-center gap-3"
                                        >
                                            {isUpdating ? <Loader2 className="animate-spin" /> : <Check />}
                                            {isUpdating ? 'Saving...' : 'Update Profile'}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Profile;