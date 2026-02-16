import React, { useState } from 'react';
import {
    BarChart3,
    X,
    ChevronRight,
    Search,
    User,
    TrendingUp,
    ArrowLeft,
    Users,
    Target,
    Info,
    Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Offer } from '../../types/offer';

interface OfferAnalyticsViewProps {
    offer: Offer;
    onBack: () => void;
}

const TARGET_ICONS = {
    all: Users,
    new: Target,
    frequent: Info,
    inactive: Calendar,
};

const OfferAnalyticsView: React.FC<OfferAnalyticsViewProps> = ({ offer, onBack }) => {
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const TargetIcon = TARGET_ICONS[offer.targeting] || Info;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 pb-12"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-slate-900/40 p-8 rounded-3xl border border-slate-800/50 backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onBack}
                        className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-slate-400 hover:text-white transition-all border border-slate-700 group ring-1 ring-white/5"
                    >
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="bg-brand-orange/20 p-4 rounded-2xl text-brand-orange shadow-inner shadow-brand-orange/10">
                            <BarChart3 size={32} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-3xl font-black text-white tracking-tight">{offer.title}</h2>
                                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-widest border border-slate-700 ring-1 ring-white/5">
                                    {offer.status}
                                </span>
                            </div>
                            <p className="text-slate-400 text-sm mt-2 flex items-center gap-2 font-medium">
                                <TargetIcon size={16} className="text-brand-blue" />
                                Targeting: {offer.targeting}
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mx-1" />
                                Active since {new Date(offer.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Total Impact</p>
                        <p className="text-2xl font-black text-white">{offer.redemptions} Redemptions</p>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Allotted', value: offer.allotted, sub: 'cards', color: 'text-white', bg: 'bg-slate-950/40' },
                    { label: 'Revealed', value: offer.revealed, sub: `(${Math.round(offer.revealed / offer.allotted * 100)}%)`, color: 'text-brand-blue', bg: 'bg-brand-blue/5 border-brand-blue/10' },
                    { label: 'Redeemed', value: offer.redemptions, sub: `(${Math.round(offer.redemptions / offer.revealed * 100)}%)`, color: 'text-brand-green', bg: 'bg-brand-green/5 border-brand-green/10' },
                    { label: 'Win Chance', value: `${offer.weight}%`, sub: 'probability', color: 'text-brand-orange', bg: 'bg-brand-orange/5 border-brand-orange/10' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`${stat.bg} p-6 rounded-3xl border border-slate-800/50 relative overflow-hidden group`}
                    >
                        <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{stat.label}</div>
                        <div className="flex items-baseline gap-3">
                            <span className={`text-4xl font-black ${stat.color} tracking-tight`}>{stat.value}</span>
                            <span className="text-slate-500 text-xs font-bold uppercase">{stat.sub}</span>
                        </div>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent blur-2xl -mr-12 -mt-12 rounded-full" />
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Conversion Funnel */}
                <div className="lg:col-span-1 bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800/50 space-y-8 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">Conversion Funnel</h3>
                    </div>
                    <div className="space-y-6">
                        {[
                            { step: 'Allotted', value: `${offer.allotted} Cards Created`, percent: 100, color: 'bg-slate-700/50', label: 'Step 1' },
                            { step: 'Scratched', value: `${offer.revealed} Actually Scratched`, percent: (offer.revealed / offer.allotted) * 100, color: 'bg-brand-blue/30', label: 'Step 2' },
                            { step: 'Redeemed', value: `${offer.redemptions} Final Conversions`, percent: (offer.redemptions / offer.allotted) * 100, color: 'bg-brand-green/30', label: 'Step 3' },
                        ].map((step, i) => (
                            <React.Fragment key={i}>
                                <div className="relative pt-6">
                                    <div className="absolute top-0 left-0 text-[10px] font-black text-slate-500 uppercase tracking-widest">{step.label}: {step.step}</div>
                                    <div className="w-full bg-slate-950/50 h-14 rounded-2xl border border-slate-800/50 overflow-hidden flex items-center px-6 relative">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${step.percent}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + i * 0.2 }}
                                            className={`h-full ${step.color} absolute left-0`}
                                        />
                                        <span className="relative font-bold text-white z-10 text-sm tracking-tight">{step.value}</span>
                                    </div>
                                </div>
                                {i < 2 && (
                                    <div className="flex justify-center -my-2">
                                        <ChevronRight className="text-slate-800 rotate-90" size={24} />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Trend Chart */}
                <div className="lg:col-span-2 bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-md">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">Redemption Trend</h3>
                            <p className="text-xs text-slate-500 mt-1 font-medium">Activity over the last 7 days</p>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800/50">
                            <div className="w-2.5 h-2.5 rounded-full bg-brand-orange shadow-[0_0_10px_rgba(249,115,22,0.4)]" />
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Daily Redemptions</span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={offer.history}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f97316" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#f97316" stopOpacity={0.6} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#475569"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={15}
                                    fontWeight={700}
                                />
                                <YAxis
                                    stroke="#475569"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    fontWeight={700}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: '#1e293b', opacity: 0.3 }}
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        border: '1px solid #334155',
                                        borderRadius: '16px',
                                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                                        padding: '12px 16px'
                                    }}
                                    itemStyle={{ color: '#f97316', fontSize: '14px', fontWeight: '900' }}
                                    labelStyle={{ color: '#64748b', fontSize: '10px', fontWeight: '800', marginBottom: '8px', textTransform: 'uppercase', tracking: '0.1em' }}
                                />
                                <Bar dataKey="value" fill="url(#barGradient)" radius={[8, 8, 4, 4]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* User-wise Utilization */}
            <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800/50 space-y-8 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">User-wise Utilization</h3>
                        <p className="text-xs text-slate-500 mt-2 font-medium">Detailed breakdown of customers who redeemed this offer</p>
                    </div>
                    <div className="relative w-full sm:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5 group-focus-within:text-brand-orange transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name or phone..."
                            value={userSearchTerm}
                            onChange={(e) => setUserSearchTerm(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:border-brand-orange/50 focus:ring-4 focus:ring-brand-orange/10 text-sm text-white placeholder:text-slate-600 transition-all shadow-inner"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-3xl border border-slate-800/50 bg-slate-950/20">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-800">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Customer</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Phone Details</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Redemption Time</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {offer.utilizations
                                .filter(u =>
                                    u.userName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                                    u.phone.includes(userSearchTerm)
                                )
                                .map((util, i) => (
                                    <motion.tr
                                        key={util.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue border border-brand-blue/20 group-hover:scale-110 transition-transform shadow-lg shadow-brand-blue/5">
                                                    <User size={18} />
                                                </div>
                                                <span className="font-bold text-white tracking-tight">{util.userName}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-slate-400 font-mono text-xs bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">{util.phone}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-slate-400 text-sm flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-600" />
                                                {util.redeemedAt}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className="px-4 py-1.5 rounded-xl bg-brand-green/10 text-brand-green font-black text-[10px] uppercase tracking-widest border border-brand-green/20 shadow-lg shadow-brand-green/5">
                                                {util.status}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            {offer.utilizations.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-8 py-16 text-center text-slate-600 italic font-medium">
                                        <TrendingUp size={48} className="mx-auto mb-4 opacity-10" />
                                        No redemptions recorded for this offer yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-center pt-8">
                <div className="bg-slate-900/50 border border-slate-800 px-6 py-3 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] shadow-xl backdrop-blur-sm">
                    Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </div>
            </div>
        </motion.div>
    );
};

export default OfferAnalyticsView;
