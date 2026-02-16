import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Power, Percent, Users, Calendar, X, Target, Info, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Offer, TARGETS } from '../../types/offer';
import OfferAnalyticsView from './OfferAnalyticsView';

const MOCK_OFFERS: Offer[] = [
    {
        id: 1,
        title: '10% OFF',
        description: 'Applicable on total bill',
        weight: 50,
        status: 'active',
        redemptions: 450,
        allotted: 1200,
        revealed: 850,
        targeting: 'all',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        history: [
            { name: 'Mon', value: 40 },
            { name: 'Tue', value: 35 },
            { name: 'Wed', value: 55 },
            { name: 'Thu', value: 65 },
            { name: 'Fri', value: 80 },
            { name: 'Sat', value: 95 },
            { name: 'Sun', value: 80 },
        ],
        utilizations: [
            { id: 1, userName: 'Rahul Sharma', phone: '9876543210', redeemedAt: '2026-02-14 14:30', status: 'redeemed' },
            { id: 2, userName: 'Priya Patel', phone: '9123456789', redeemedAt: '2026-02-15 11:20', status: 'redeemed' },
            { id: 3, userName: 'Amit Kumar', phone: '8877665544', redeemedAt: '2026-02-16 09:45', status: 'redeemed' },
            { id: 4, userName: 'Vikram Singh', phone: '9988776655', redeemedAt: '2026-02-13 18:15', status: 'redeemed' },
            { id: 5, userName: 'Sneha Gupta', phone: '7766554433', redeemedAt: '2026-02-15 15:50', status: 'redeemed' },
        ]
    },
    {
        id: 2,
        title: '20% OFF',
        description: 'Applicable on bills above 1000',
        weight: 30,
        status: 'active',
        redemptions: 210,
        allotted: 800,
        revealed: 520,
        targeting: 'frequent',
        startDate: '2026-02-01',
        endDate: '2026-03-01',
        history: [
            { name: 'Mon', value: 20 },
            { name: 'Tue', value: 15 },
            { name: 'Wed', value: 25 },
            { name: 'Thu', value: 30 },
            { name: 'Fri', value: 45 },
            { name: 'Sat', value: 40 },
            { name: 'Sun', value: 35 },
        ],
        utilizations: [
            { id: 6, userName: 'Rahul Sharma', phone: '9876543210', redeemedAt: '2026-02-12 12:30', status: 'redeemed' },
            { id: 7, userName: 'Amit Kumar', phone: '8877665544', redeemedAt: '2026-02-15 13:45', status: 'redeemed' },
        ]
    },
    {
        id: 3,
        title: 'Free Dessert',
        description: 'One chocolate lava cake',
        weight: 15,
        status: 'active',
        redemptions: 85,
        allotted: 500,
        revealed: 310,
        targeting: 'new',
        startDate: '2026-02-10',
        endDate: '2026-02-28',
        history: [
            { name: 'Mon', value: 8 },
            { name: 'Tue', value: 12 },
            { name: 'Wed', value: 10 },
            { name: 'Thu', value: 15 },
            { name: 'Fri', value: 18 },
            { name: 'Sat', value: 12 },
            { name: 'Sun', value: 10 },
        ],
        utilizations: [
            { id: 8, userName: 'Priya Patel', phone: '9123456789', redeemedAt: '2026-02-14 16:20', status: 'redeemed' },
        ]
    },
];

const TARGET_ICONS = {
    all: Users,
    new: Target,
    frequent: Info,
    inactive: Calendar,
} as const;

const OfferManager: React.FC = () => {
    const [offers, setOffers] = useState<Offer[]>(MOCK_OFFERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
    const [viewingStats, setViewingStats] = useState<Offer | null>(null);

    // Form state
    const [formData, setFormData] = useState<Partial<Offer>>({
        title: '',
        description: '',
        weight: 20,
        status: 'active',
        targeting: 'all',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    const handleOpenModal = (offer?: Offer) => {
        if (offer) {
            setEditingOffer(offer);
            setFormData(offer);
        } else {
            setEditingOffer(null);
            setFormData({
                title: '',
                description: '',
                weight: 20,
                status: 'active',
                targeting: 'all',
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (editingOffer) {
            setOffers(offers.map(o => o.id === editingOffer.id ? { ...o, ...formData } as Offer : o));
        } else {
            const newOffer: Offer = {
                ...formData as Offer,
                id: Math.max(0, ...offers.map(o => o.id)) + 1,
                redemptions: 0,
                allotted: 0,
                revealed: 0,
                history: [],
                utilizations: [],
            };
            setOffers([...offers, newOffer]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: number) => {
        setOffers(offers.filter(o => o.id !== id));
    };

    const toggleStatus = (id: number) => {
        setOffers(offers.map(o => o.id === id ? { ...o, status: o.status === 'active' ? 'inactive' : 'active' } : o));
    };

    if (viewingStats) {
        return (
            <div className="p-8 min-h-screen">
                <OfferAnalyticsView
                    offer={viewingStats}
                    onBack={() => setViewingStats(null)}
                />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6 relative min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Offer Management</h1>
                    <p className="text-slate-400 text-sm">Create and control scratch card rewards with precision targeting</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-brand-orange/20"
                >
                    <Plus size={20} />
                    Create New Offer
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {offers.map((offer) => (
                    <div
                        key={offer.id}
                        onClick={() => setViewingStats(offer)}
                        className={`bg-slate-900/40 border ${offer.status === 'active' ? 'border-slate-800' : 'border-slate-800/50'} p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all cursor-pointer`}
                    >
                        {offer.status === 'inactive' && (
                            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] z-10 flex items-center justify-center pointer-events-none">
                                <span className="bg-slate-800 text-slate-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-700 shadow-xl">Inactive</span>
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-brand-orange/10 p-3 rounded-xl text-brand-orange">
                                <Percent size={24} />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <button
                                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleOpenModal(offer); }}
                                    className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleDelete(offer.id); }}
                                    className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{offer.title}</h3>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{offer.description}</p>

                        <div className="space-y-4">
                            {/* Metadata */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {(() => {
                                    const TargetIcon = TARGET_ICONS[offer.targeting] || Info;
                                    return (
                                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300">
                                            <TargetIcon size={12} className="text-brand-blue" />
                                            {TARGETS.find(t => t.value === offer.targeting)?.label}
                                        </span>
                                    );
                                })()}
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300">
                                    <Calendar size={12} className="text-brand-green" />
                                    {new Date(offer.endDate).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Win Probability</span>
                                <span className="text-white font-mono bg-slate-800 px-2 py-0.5 rounded">{offer.weight}%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-brand-orange h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${offer.weight}%` }}
                                />
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-slate-800/50">
                                <div className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <TrendingUp size={14} className="text-brand-green" />
                                    {offer.redemptions} Redemptions
                                </div>
                                <button
                                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); toggleStatus(offer.id); }}
                                    className={`p-2 rounded-lg transition-all z-20 ${offer.status === 'active' ? 'text-brand-green hover:bg-brand-green/10' : 'text-slate-500 hover:bg-slate-800'}`}
                                >
                                    <Power size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={() => handleOpenModal()}
                    className="border-2 border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 hover:text-brand-orange hover:border-brand-orange/50 transition-all gap-4 group min-h-[250px]"
                >
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus size={24} />
                    </div>
                    <span className="font-medium">Add another prize tier</span>
                </button>
            </div>

            {/* Edit/Create Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10 backdrop-blur-md">
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        {editingOffer ? 'Edit Offer' : 'Create New Offer'}
                                    </h2>
                                    <p className="text-slate-400 text-xs mt-1">Configure reward details and targeting</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Basic Info */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Offer Title</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="e.g. 20% OFF"
                                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Description</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Offer details and conditions..."
                                                rows={3}
                                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all text-white resize-none"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-medium text-slate-300">Win Probability</label>
                                                <span className="text-brand-orange font-bold font-mono">{formData.weight}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={formData.weight}
                                                onChange={e => setFormData({ ...formData, weight: parseInt(e.target.value) })}
                                                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                                            />
                                            <p className="text-[10px] text-slate-500 italic">This determines how often this card appears for eligible users.</p>
                                        </div>
                                    </div>

                                    {/* Targeting & Schedule */}
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                                <Target size={16} className="text-brand-blue" />
                                                User Targeting
                                            </label>
                                            <div className="grid grid-cols-1 gap-2">
                                                {TARGETS.map(target => {
                                                    const Icon = TARGET_ICONS[target.value];
                                                    return (
                                                        <button
                                                            key={target.value}
                                                            onClick={() => setFormData({ ...formData, targeting: target.value })}
                                                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${formData.targeting === target.value
                                                                ? 'bg-brand-blue/10 border-brand-blue text-brand-blue'
                                                                : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                                                                }`}
                                                        >
                                                            <Icon size={18} />
                                                            <span className="text-sm font-medium">{target.label}</span>
                                                            {formData.targeting === target.value && (
                                                                <div className="ml-auto w-2 h-2 rounded-full bg-brand-blue shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                                <Calendar size={16} className="text-brand-green" />
                                                Duration
                                            </label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider ml-1">Start Date</span>
                                                    <input
                                                        type="date"
                                                        value={formData.startDate}
                                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all text-white text-xs"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider ml-1">End Date</span>
                                                    <input
                                                        type="date"
                                                        value={formData.endDate}
                                                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all text-white text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-800/30 border-t border-slate-800 flex justify-end gap-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-8 py-2.5 rounded-xl font-bold bg-brand-orange text-white hover:bg-brand-orange/90 shadow-lg shadow-brand-orange/20 transition-all"
                                >
                                    {editingOffer ? 'Update Offer' : 'Save Offer'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OfferManager;
