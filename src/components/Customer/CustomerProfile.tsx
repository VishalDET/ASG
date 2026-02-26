import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import CountdownTimer from './CountdownTimer';
import { handleShare } from '../../utils/shareUtils';
import {
    Gift,
    TicketCheck,
    History,
    Calendar,
    ChevronRight,
    User as UserIcon,
    Mail,
    Baby,
    Utensils,
    GlassWater,
    Edit2,
    Check,
    X,
    CheckCircle2,
    Copy,
    Share2
} from 'lucide-react';
import { Customer } from '../../types/customer';
import { calculateAge } from '../../utils/dateUtils';
import { customerService } from '../../services/customerService';

interface OfferHistoryItem {
    id: string | number;
    title: string;
    code: string;
    status: 'available' | 'redeemed' | 'expired';
    date: string;
    expiryDate?: string;
}

interface CustomerProfileProps {
    customer: Customer & { offersCount: number };
    onClose: () => void;
    onBackToScratch: () => void;
    onUpdate: (updatedCustomer: Customer) => void;
    hasScratchedToday?: boolean;
}

const ALCOHOL_OPTIONS = [
    'None',
    'Wine',
    'Beer',
    'Whiskey',
    'Rum',
    'Vodka',
    'Gin',
    'Cocktails',
];

const formatDateForInput = (dateStr: string | null | undefined) => {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '';
        return d.toISOString().split('T')[0];
    } catch (e) {
        return '';
    }
};

const CustomerProfile: React.FC<CustomerProfileProps> = ({
    customer,
    onClose,
    onBackToScratch,
    onUpdate,
    hasScratchedToday = false
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(customer.name);
    const [editedEmail, setEditedEmail] = useState(customer.email || '');
    const [editedDob, setEditedDob] = useState(formatDateForInput(customer.dob));
    const [editedGender, setEditedGender] = useState<Customer['gender']>(customer.gender?.toLowerCase() as Customer['gender'] || 'male');
    const [editedFoodPref, setEditedFoodPref] = useState(customer.foodPreference?.toLowerCase() || 'veg');
    const [editedAlcoholPref, setEditedAlcoholPref] = useState(customer.alcoholPreference?.toLowerCase() || 'none');
    const [selectedOfferDetail, setSelectedOfferDetail] = useState<OfferHistoryItem | null>(null);
    const [liveHistory, setLiveHistory] = useState<OfferHistoryItem[]>([]);
    const [liveStats, setLiveStats] = useState({ visitCount: customer.visitCount, offersCount: customer.offersCount });
    const [isLoadingLive, setIsLoadingLive] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useEffect(() => {
        const fetchLiveProfile = async () => {
            setIsLoadingLive(true);
            const profile = await customerService.getCustomerProfile(customer.id);
            if (profile) {
                setLiveStats({
                    visitCount: profile.visitCount || 0,
                    offersCount: (profile as any).offerHistory?.filter((h: any) => h.status === 'Redeemed').length || 0
                });

                if (profile.offerHistory) {
                    const mappedHistory: OfferHistoryItem[] = profile.offerHistory.map((h: any) => {
                        const isExpired = h.status !== 'Redeemed' && h.expiryDate && new Date(h.expiryDate).getTime() < new Date().getTime();
                        return {
                            id: h.redemptionId,
                            title: h.offerTitle,
                            code: h.code,
                            status: h.status === 'Redeemed' ? 'redeemed' : (isExpired ? 'expired' : 'available'),
                            date: h.redeemedAt || h.revealedAt,
                            expiryDate: h.expiryDate
                        };
                    });
                    setLiveHistory(mappedHistory);
                }
            }
            setIsLoadingLive(false);
        };

        fetchLiveProfile();
    }, [customer.id]);

    // Sync fields when customer prop changes (and not editing)
    useEffect(() => {
        if (!isEditing) {
            setEditedName(customer.name);
            setEditedEmail(customer.email || '');
            setEditedDob(formatDateForInput(customer.dob));
            setEditedGender(customer.gender?.toLowerCase() as Customer['gender'] || 'male');
            setEditedFoodPref(customer.foodPreference?.toLowerCase() || 'veg');
            setEditedAlcoholPref(customer.alcoholPreference?.toLowerCase() || 'none');
        }
    }, [customer, isEditing]);

    const currentAge = useMemo(() => editedDob ? calculateAge(editedDob) : 0, [editedDob]);

    const handleSave = () => {
        if (onUpdate) {
            onUpdate({
                ...customer,
                name: editedName,
                email: editedEmail,
                dob: editedDob,
                gender: editedGender,
                foodPreference: editedFoodPref,
                alcoholPreference: currentAge >= 21 ? (editedAlcoholPref || 'none') : 'none'
            });
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedName(customer.name);
        setEditedEmail(customer.email || '');
        setEditedDob(customer.dob || '');
        setEditedGender(customer.gender?.toLowerCase() as Customer['gender'] || 'male');
        setEditedFoodPref(customer.foodPreference?.toLowerCase() || 'veg');
        setEditedAlcoholPref(customer.alcoholPreference?.toLowerCase() || 'none');
        setIsEditing(false);
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success('Code copied to clipboard!');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
        >
            {/* Header */}
            <div className="bg-primary/10 p-6 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center text-primary border border-primary/30">
                        <UserIcon size={30} />
                    </div>
                    <div>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1 text-white font-bold text-xl focus:outline-none focus:ring-2 focus:ring-primary w-full"
                                placeholder="Enter Name"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold text-white tracking-tight">{customer.name}</h2>
                        )}
                        <p className="text-slate-400 font-medium">{customer.phone}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-slate-400 hover:text-accent transition-colors bg-slate-800/50 rounded-full border border-slate-700 hover:border-accent/30"
                            title="Edit Profile"
                        >
                            <Edit2 size={18} />
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleSave}
                                className="p-2 text-success hover:bg-success/10 transition-colors bg-slate-800/50 rounded-full border border-slate-700 hover:border-success/30"
                                title="Save"
                            >
                                <Check size={18} />
                            </button>
                            <button
                                onClick={handleCancel}
                                className="p-2 text-primary hover:bg-primary/10 transition-colors bg-slate-800/50 rounded-full border border-slate-700 hover:border-primary/30"
                                title="Cancel"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="text-slate-500 hover:text-white transition-colors p-2 cursor-pointer"
                        title="Logout"
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                {/* Personal Details & Preferences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-800">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-400">
                            <Mail size={18} className="text-slate-500" />
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={editedEmail}
                                    onChange={(e) => setEditedEmail(e.target.value)}
                                    className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary flex-1"
                                    placeholder="Enter Email"
                                />
                            ) : (
                                <span className="text-sm">{customer.email || 'No email provided'}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                            <Baby size={18} className="text-slate-500" />
                            <div className="flex items-center gap-2 flex-1">
                                {isEditing ? (
                                    <div className="flex flex-col gap-2 w-full">
                                        <div className="flex gap-2">
                                            <select
                                                value={editedGender?.toLowerCase() || 'male'}
                                                onChange={(e) => setEditedGender(e.target.value as Customer['gender'])}
                                                className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                            <input
                                                type="date"
                                                value={editedDob}
                                                onChange={(e) => setEditedDob(e.target.value)}
                                                className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary flex-1 [color-scheme:dark]"
                                            />
                                        </div>
                                        <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full self-start">
                                            Recalculated Age: {currentAge}
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-sm capitalize">{customer.gender || 'N/A'}</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                                        <span className="text-sm">{customer.dob ? new Date(customer.dob).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                                        <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full ml-1">
                                            Age: {currentAge}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-400">
                            <Utensils size={18} className="text-slate-500" />
                            <div className="flex flex-col gap-2 flex-1">
                                <span className="text-sm">Preference: </span>
                                {isEditing ? (
                                    <div className="flex gap-2 mt-1">
                                        <button
                                            onClick={() => setEditedFoodPref('veg')}
                                            className={`flex-1 py-1.5 rounded-lg font-semibold text-[10px] uppercase transition-all border ${editedFoodPref?.toLowerCase() === 'veg'
                                                ? 'bg-success/20 border-success/40 text-success'
                                                : 'bg-slate-900/50 border-slate-700 text-slate-500 hover:border-slate-600'
                                                }`}
                                        >
                                            🥬 Veg
                                        </button>
                                        <button
                                            onClick={() => setEditedFoodPref('non-veg')}
                                            className={`flex-1 py-1.5 rounded-lg font-semibold text-[10px] uppercase transition-all border ${editedFoodPref?.toLowerCase() === 'non-veg'
                                                ? 'bg-primary/20 border-primary/40 text-primary'
                                                : 'bg-slate-900/50 border-slate-700 text-slate-500 hover:border-slate-600'
                                                }`}
                                        >
                                            🍖 Non-Veg
                                        </button>
                                    </div>
                                ) : (
                                    <span className={`text-sm font-bold uppercase ${customer.foodPreference === 'veg' ? 'text-success' : 'text-primary'}`}>
                                        {customer.foodPreference === 'veg' ? '🥬 Veg' : '🍖 Non-Veg'}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                            <GlassWater size={18} className="text-slate-500" />
                            <div className="flex flex-col gap-1 flex-1">
                                <span className="text-sm">Alcohol: </span>
                                {isEditing ? (
                                    currentAge >= 21 ? (
                                        <select
                                            value={editedAlcoholPref?.toLowerCase() || 'none'}
                                            onChange={(e) => setEditedAlcoholPref(e.target.value.toLowerCase())}
                                            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                                        >
                                            {ALCOHOL_OPTIONS.map(opt => (
                                                <option key={opt} value={opt.toLowerCase()}>{opt}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="bg-slate-900/30 border border-slate-800/50 p-2 rounded-lg mt-1">
                                            <p className="text-[10px] text-slate-500 italic">Alcohol options are restricted for users under 21 (Age: {currentAge})</p>
                                        </div>
                                    )
                                ) : (
                                    <span className={`text-sm font-bold ${currentAge >= 21 ? 'text-accent' : 'text-slate-600'}`}>
                                        {customer.alcoholPreference || 'None'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className="bg-accent/10 p-3 rounded-xl text-accent">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Total Visits</p>
                            <p className="text-2xl font-black text-white">{isLoadingLive ? '...' : liveStats.visitCount}</p>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className="bg-success/10 p-3 rounded-xl text-success">
                            <TicketCheck size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Offers Availed</p>
                            <p className="text-2xl font-black text-white">{isLoadingLive ? '...' : liveStats.offersCount}</p>
                        </div>
                    </div>
                </div>

                {/* History Tabs/List */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white font-bold mb-4">
                        <History size={20} className="text-primary" />
                        <h3>Offer History</h3>
                    </div>

                    <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {isLoadingLive ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex items-center justify-between animate-pulse">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-800 rounded-lg" />
                                            <div className="space-y-2">
                                                <div className="h-4 w-32 bg-slate-800 rounded" />
                                                <div className="h-3 w-20 bg-slate-800 rounded" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : liveHistory.length === 0 ? (
                            <div className="text-center py-10 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
                                <History className="mx-auto text-slate-700 mb-2" size={32} />
                                <p className="text-slate-500">No history found yet. Start scratching!</p>
                            </div>
                        ) : (
                            liveHistory.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedOfferDetail(item)}
                                    className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex items-center justify-between group hover:border-primary/30 transition-all shadow-sm cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${item.status === 'redeemed' || item.status === 'expired' ? 'bg-slate-800 text-slate-500' : 'bg-accent/10 text-accent'}`}>
                                            <Gift size={18} />
                                        </div>
                                        <div>
                                            <p className={`font-bold text-sm ${item.status === 'redeemed' || item.status === 'expired' ? 'text-slate-500 line-through' : 'text-white'}`}>
                                                {item.title}
                                            </p>
                                            <div className="flex flex-col gap-1 mt-1">
                                                <p className="text-xs font-mono text-slate-500 uppercase tracking-tighter">{item.code}</p>
                                                {item.status === 'available' && item.expiryDate && (
                                                    <CountdownTimer expiryDate={item.expiryDate} className="!text-[10px] opacity-80" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-4">
                                        <div className="hidden sm:block">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold text-right">
                                                {item.status === 'available' && item.expiryDate ? 'GIFT' : new Date(item.date).toLocaleDateString()}
                                            </p>
                                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${item.status === 'redeemed'
                                                ? 'bg-slate-800 text-slate-600'
                                                : item.status === 'expired'
                                                    ? 'bg-red-500/10 text-red-500'
                                                    : 'bg-success/10 text-success'
                                                }`}>
                                                {item.status === 'available' ? 'Generated' : item.status === 'expired' ? 'Expired' : 'Redeemed'}
                                            </span>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-700 group-hover:text-slate-500 transition-colors" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-8 border-t border-slate-800 bg-slate-900/30 flex flex-col gap-4">
                <button
                    onClick={onBackToScratch}
                    disabled={
                        hasScratchedToday ||
                        liveHistory.some(h => new Date(h.date).toLocaleDateString() === new Date().toLocaleDateString() && h.status !== 'redeemed' && h.status !== 'expired')
                    }
                    className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group ${hasScratchedToday || liveHistory.some(h => new Date(h.date).toLocaleDateString() === new Date().toLocaleDateString() && h.status !== 'redeemed' && h.status !== 'expired')
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        : 'bg-primary hover:bg-primaryDark text-white shadow-primary/20'}`}
                >
                    {hasScratchedToday || liveHistory.some(h => new Date(h.date).toLocaleDateString() === new Date().toLocaleDateString() && h.status !== 'redeemed' && h.status !== 'expired') ? 'Come Back Tomorrow!' : 'Try Your Luck Today'}
                    {!(hasScratchedToday || liveHistory.some(h => new Date(h.date).toLocaleDateString() === new Date().toLocaleDateString() && h.status !== 'redeemed' && h.status !== 'expired')) && <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                </button>
                {(hasScratchedToday || liveHistory.some(h => new Date(h.date).toLocaleDateString() === new Date().toLocaleDateString() && h.status !== 'redeemed' && h.status !== 'expired')) && (
                    <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest animate-pulse">
                        You've already received your daily scratch card!
                    </p>
                )}
            </div>

            {/* Offer Detail Modal */}
            <AnimatePresence>
                {selectedOfferDetail && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOfferDetail(null)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-card relative w-full max-w-sm p-8 rounded-3xl text-center shadow-2xl border border-slate-800"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-center mb-6">
                                <div className={`p-4 rounded-full ${selectedOfferDetail.status === 'available' ? 'bg-success/20' : 'bg-slate-800'}`}>
                                    <CheckCircle2 className={`w-12 h-12 ${selectedOfferDetail.status === 'available' ? 'text-success' : 'text-slate-500'}`} />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2">
                                {selectedOfferDetail.status === 'redeemed' ? 'Offer Summary' : selectedOfferDetail.status === 'expired' ? 'Offer Expired' : 'Congratulations!'}
                            </h2>
                            <p className="text-slate-400 mb-8 lowercase first-letter:uppercase">
                                {selectedOfferDetail.status === 'redeemed' ? 'This offer has been successfully redeemed' : selectedOfferDetail.status === 'expired' ? 'This offer has expired' : 'You have an active exclusive offer'}
                            </p>

                            <div className={`bg-slate-900/80 border-2 border-dashed rounded-2xl p-6 mb-8 ${selectedOfferDetail.status === 'available' ? 'border-accent/40' : 'border-slate-800'}`}>
                                <h3 className={`text-2xl font-black mb-4 uppercase tracking-wider ${selectedOfferDetail.status === 'available' ? 'text-accent' : 'text-slate-600'}`}>
                                    {selectedOfferDetail.title}
                                </h3>
                                <div className="bg-black/40 rounded-xl p-4 flex items-center justify-between gap-4">
                                    <code className={`text-lg font-mono font-bold tracking-widest ${selectedOfferDetail.status === 'available' ? 'text-primary' : 'text-slate-700'}`}>
                                        {selectedOfferDetail.code}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(selectedOfferDetail.code)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        title="Copy Code"
                                    >
                                        <Copy className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                                {selectedOfferDetail.status === 'available' && selectedOfferDetail.expiryDate && (
                                    <div className="mt-4 flex justify-center">
                                        <CountdownTimer expiryDate={selectedOfferDetail.expiryDate} />
                                    </div>
                                )}
                                <p className="text-[10px] text-slate-500 mt-4 font-bold uppercase tracking-widest">
                                    {selectedOfferDetail.status === 'redeemed' ? `Redeemed on ${selectedOfferDetail.date}` : (selectedOfferDetail.expiryDate ? `Ends at ${new Date(selectedOfferDetail.expiryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} on ${new Date(selectedOfferDetail.expiryDate).toLocaleDateString()}` : `Valid until ${selectedOfferDetail.date}`)}
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setSelectedOfferDetail(null)}
                                    className="flex-1 bg-primary hover:bg-primaryDark text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20"
                                >
                                    Got it
                                </button>
                                <button
                                    onClick={() => handleShare(selectedOfferDetail)}
                                    className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                            onClick={() => setShowLogoutConfirm(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-card relative w-full max-w-sm p-8 rounded-3xl text-center shadow-2xl border border-slate-800"
                        >
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 border border-red-500/20">
                                <UserIcon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Logout</h3>
                            <p className="text-slate-400 mb-8">Are you sure you want to logout? You will need to verify your phone number to login again.</p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="flex-1 py-3 rounded-xl font-bold border border-slate-700 text-white hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setShowLogoutConfirm(false);
                                        onClose();
                                    }}
                                    className="flex-1 py-3 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg shadow-red-500/20"
                                >
                                    Logout
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CustomerProfile;
