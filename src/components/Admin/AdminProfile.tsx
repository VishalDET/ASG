import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, KeyRound, Building, Phone } from 'lucide-react';

const AdminProfile: React.FC = () => {
    // Mock current admin profile details
    const adminDetails = {
        name: 'Vishal Admin',
        role: 'Superadmin',
        email: 'admin@asg.com',
        phone: '+1 (555) 123-4567',
        department: 'Corporate IT',
        initial: 'V'
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
                            {adminDetails.initial}
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
                                    value={adminDetails.department}
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
