import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, Beer, Utensils, History, TrendingUp, Clock, Loader2, Tag } from 'lucide-react';
import { Customer } from '../../types/customer';
import { customerService } from '../../services/customerService';

interface CustomerDetailModalProps {
    customer: Customer | null;
    isOpen: boolean;
    onClose: () => void;
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({ customer, isOpen, onClose }) => {
    const [profile, setProfile] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (isOpen && customer) {
                setLoading(true);
                const data = await customerService.getCustomerProfile(customer.id);
                setProfile(data || customer);
                setLoading(false);
            } else {
                setProfile(null);
            }
        };
        fetchProfile();
    }, [isOpen, customer]);

    if (!customer) return null;

    const displayData = profile || customer;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-end p-0 sm:p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-xl h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white leading-tight">{displayData.name}</h2>
                                    <p className="text-slate-500 text-xs flex items-center gap-2">
                                        <span>Customer ID: #{displayData.id}</span>
                                        {loading && <Loader2 size={10} className="animate-spin text-brand-orange" />}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            {loading && !profile ? (
                                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-slate-500 gap-4">
                                    <Loader2 className="w-10 h-10 animate-spin text-brand-orange" />
                                    <p className="text-sm font-medium">Fetching detailed profile...</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Stats Overview */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-800/40 border border-slate-800/50 p-4 rounded-2xl">
                                            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1 uppercase tracking-wider font-bold">
                                                <TrendingUp size={14} className="text-brand-green" />
                                                Total Visits
                                            </div>
                                            <p className="text-2xl font-black text-white">{displayData.visitCount}</p>
                                        </div>
                                        <div className="bg-slate-800/40 border border-slate-800/50 p-4 rounded-2xl">
                                            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1 uppercase tracking-wider font-bold">
                                                <Clock size={14} className="text-brand-blue" />
                                                Member Since
                                            </div>
                                            <p className="text-sm font-bold text-white">
                                                {displayData.registeredAt ? new Date(displayData.registeredAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <section className="space-y-4">
                                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Phone size={14} /> Contact Details
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-slate-300">
                                                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                                                    <Phone size={14} />
                                                </div>
                                                <span className="text-sm font-medium">{displayData.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-300">
                                                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                                                    <Mail size={14} />
                                                </div>
                                                <span className="text-sm font-medium">{displayData.email || 'No email provided'}</span>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Personal Details */}
                                    <section className="space-y-4">
                                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <User size={14} /> Personal Profile
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800/50">
                                                <p className="text-[10px] text-slate-500 uppercase mb-1">Gender</p>
                                                <p className="text-sm font-bold text-white capitalize">{displayData.gender || 'Not specified'}</p>
                                            </div>
                                            <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800/50">
                                                <p className="text-[10px] text-slate-500 uppercase mb-1">Date of Birth</p>
                                                <p className="text-sm font-bold text-white">
                                                    {displayData.dob ? new Date(displayData.dob).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Preferences */}
                                    <section className="space-y-4">
                                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Utensils size={14} /> Lifestyle Preferences
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-2xl bg-brand-green/5 border border-brand-green/10">
                                                <Utensils size={16} className="text-brand-green mb-2" />
                                                <p className="text-[10px] text-slate-500 uppercase mb-0.5">Dietary</p>
                                                <p className="text-sm font-bold text-brand-green capitalize">{displayData.foodPreference || 'No preference'}</p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-brand-orange/5 border border-brand-orange/10">
                                                <Beer size={16} className="text-brand-orange mb-2" />
                                                <p className="text-[10px] text-slate-500 uppercase mb-0.5">Beverage</p>
                                                <p className="text-sm font-bold text-brand-orange capitalize">{displayData.alcoholPreference || 'None'}</p>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Offer History */}
                                    <section className="space-y-4 pb-8 max-w-7xl mx-auto">
                                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <History size={14} /> Reward History
                                        </h3>
                                        {displayData.offerHistory && displayData.offerHistory.length > 0 ? (
                                            <div className="space-y-3">
                                                {displayData.offerHistory.map((entry, idx) => {
                                                    const isRedeemed = entry.status.toLowerCase() === 'redeemed';
                                                    return (
                                                        <div key={idx} className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-800/30 border border-slate-800/50">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-brand-orange">
                                                                        <Tag size={18} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-bold text-white">{entry.offerTitle}</p>
                                                                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{entry.code}</p>
                                                                    </div>
                                                                </div>
                                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${isRedeemed ? 'bg-success/10 text-success' : 'bg-brand-blue/10 text-brand-blue'}`}>
                                                                    {entry.status}
                                                                </span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800">
                                                                <div>
                                                                    <p className="text-[9px] text-slate-500 uppercase">Revealed</p>
                                                                    <p className="text-xs text-slate-300 font-medium">
                                                                        {entry.revealedAt ? new Date(entry.revealedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                                                    </p>
                                                                </div>
                                                                {entry.redeemedAt && (
                                                                    <div>
                                                                        <p className="text-[9px] text-slate-500 uppercase">Redeemed</p>
                                                                        <p className="text-xs text-slate-300 font-medium">
                                                                            {new Date(entry.redeemedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center bg-slate-800/20 border border-dashed border-slate-800 rounded-3xl">
                                                <p className="text-slate-500 text-sm">No reward interactions found</p>
                                            </div>
                                        )}
                                    </section>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CustomerDetailModal;
