import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, KeyRound, Building, Phone, Loader2 } from 'lucide-react';
import { adminService, AdminProfile as IAdminProfile } from '../../services/adminService';

const AdminProfile: React.FC = () => {
    const [adminDetails, setAdminDetails] = useState<IAdminProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            const session = sessionStorage.getItem('adminSession');
            if (session) {
                const { email } = JSON.parse(session);
                if (email) {
                    const response = await adminService.getAdminByEmail(email);
                    if (response.success && response.data) {
                        setAdminDetails(response.data);
                    }
                }
            }
            setIsLoading(false);
        };
        fetchProfile();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-slate-400 font-medium tracking-wide">Loading Profile...</p>
            </div>
        );
    }

    if (!adminDetails) {
        return (
            <div className="p-8 text-center text-slate-500">
                Failed to load profile details. Please try again.
            </div>
        );
    }

    // Derived details for UI
    const uiDetails = {
        initial: (adminDetails.name || 'A').charAt(0).toUpperCase(),
        department: 'Administration' // Not currently in API, using default
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Admin Profile</h1>
                    <p className="text-slate-400 mt-1">Manage your account settings and preferences</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Quick Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-1 space-y-6"
                >
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-primary/10 rounded-full border border-primary/20 flex flex-col items-center justify-center font-black text-primary text-4xl mb-4 shadow-lg shadow-primary/5">
                            {uiDetails.initial}
                        </div>
                        <h2 className="text-xl font-bold text-white">{adminDetails.name}</h2>
                        <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-brand-blue/10 border border-brand-blue/20 rounded-full">
                            <Shield size={14} className="text-brand-blue" />
                            <span className="text-xs font-bold text-brand-blue tracking-wider uppercase">{adminDetails.role}</span>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Security</h3>
                        <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-colors group opacity-50 cursor-not-allowed">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-400">
                                    <KeyRound size={16} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-slate-300">Change Password</p>
                                    <p className="text-xs text-slate-500">Coming soon</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </motion.div>

                {/* Right Column: Detailed Info Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-2"
                >
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                        <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-4">Personal Information</h3>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <User size={14} /> Full Name
                                </label>
                                <input
                                    type="text"
                                    value={adminDetails.name}
                                    disabled
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-300 cursor-not-allowed focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Mail size={14} /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={adminDetails.email}
                                        disabled
                                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-300 cursor-not-allowed focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Phone size={14} /> Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={adminDetails.phone}
                                        disabled
                                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-300 cursor-not-allowed focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 pt-4">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Building size={14} /> Department
                                </label>
                                <input
                                    type="text"
                                    value={uiDetails.department}
                                    disabled
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-300 cursor-not-allowed focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-800">
                            <p className="text-xs text-slate-500 text-center">
                                Profile details are managed centrally. Please contact system administrators to modify your details.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminProfile;
