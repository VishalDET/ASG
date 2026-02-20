import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    X
} from 'lucide-react';
import { Customer } from '../../types/customer';
import { calculateAge } from '../../utils/dateUtils';

interface OfferHistoryItem {
    id: string;
    title: string;
    code: string;
    status: 'available' | 'redeemed';
    date: string;
}

interface CustomerProfileProps {
    customer: Customer & { offersCount: number };
    history: OfferHistoryItem[];
    onClose: () => void;
    onBackToScratch: () => void;
    onUpdate?: (updatedCustomer: Customer) => void;
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

const CustomerProfile: React.FC<CustomerProfileProps> = ({
    customer,
    history,
    onClose,
    onBackToScratch,
    onUpdate
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(customer.name);
    const [editedEmail, setEditedEmail] = useState(customer.email || '');
    const [editedDob, setEditedDob] = useState(customer.dob || '');
    const [editedGender, setEditedGender] = useState<Customer['gender']>(customer.gender);
    const [editedFoodPref, setEditedFoodPref] = useState(customer.foodPreference);
    const [editedAlcoholPref, setEditedAlcoholPref] = useState(customer.alcoholPreference);

    const currentAge = editedDob ? calculateAge(editedDob) : 0;

    const handleSave = () => {
        if (onUpdate) {
            onUpdate({
                ...customer,
                name: editedName,
                email: editedEmail,
                dob: editedDob,
                gender: editedGender,
                foodPreference: editedFoodPref,
                alcoholPreference: currentAge >= 21 ? editedAlcoholPref : 'None'
            });
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedName(customer.name);
        setEditedEmail(customer.email || '');
        setEditedDob(customer.dob || '');
        setEditedGender(customer.gender);
        setEditedFoodPref(customer.foodPreference);
        setEditedAlcoholPref(customer.alcoholPreference);
        setIsEditing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
        >
            {/* Header */}
            <div className="bg-primary/10 p-8 border-b border-slate-800 flex justify-between items-center">
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
                        onClick={onClose}
                        className="text-slate-500 hover:text-white transition-colors p-2"
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
                                                value={editedGender || 'male'}
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
                                            className={`flex-1 py-1.5 rounded-lg font-semibold text-[10px] uppercase transition-all border ${editedFoodPref === 'veg'
                                                ? 'bg-success/20 border-success/40 text-success'
                                                : 'bg-slate-900/50 border-slate-700 text-slate-500 hover:border-slate-600'
                                                }`}
                                        >
                                            🥬 Veg
                                        </button>
                                        <button
                                            onClick={() => setEditedFoodPref('non-veg')}
                                            className={`flex-1 py-1.5 rounded-lg font-semibold text-[10px] uppercase transition-all border ${editedFoodPref === 'non-veg'
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
                                            value={editedAlcoholPref || 'None'}
                                            onChange={(e) => setEditedAlcoholPref(e.target.value)}
                                            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                                        >
                                            {ALCOHOL_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
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
                            <p className="text-2xl font-black text-white">{customer.visitCount}</p>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className="bg-success/10 p-3 rounded-xl text-success">
                            <TicketCheck size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Offers Availed</p>
                            <p className="text-2xl font-black text-white">{customer.offersCount}</p>
                        </div>
                    </div>
                </div>

                {/* History Tabs/List */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white font-bold mb-4">
                        <History size={20} className="text-primary" />
                        <h3>Offer History</h3>
                    </div>

                    <div className="space-y-3">
                        {history.length === 0 ? (
                            <div className="text-center py-10 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
                                <Gift className="mx-auto text-slate-700 mb-2" size={32} />
                                <p className="text-slate-500">No history found yet. Start scratching!</p>
                            </div>
                        ) : (
                            history.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex items-center justify-between group hover:border-primary/30 transition-all shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${item.status === 'redeemed' ? 'bg-slate-800 text-slate-500' : 'bg-accent/10 text-accent'}`}>
                                            <Gift size={18} />
                                        </div>
                                        <div>
                                            <p className={`font-bold ${item.status === 'redeemed' ? 'text-slate-500 line-through' : 'text-white'}`}>
                                                {item.title}
                                            </p>
                                            <p className="text-xs font-mono text-slate-500 uppercase tracking-tighter">{item.code}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-4">
                                        <div className="hidden sm:block">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold text-right">{item.date}</p>
                                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${item.status === 'redeemed'
                                                ? 'bg-slate-800 text-slate-600'
                                                : 'bg-success/10 text-success'
                                                }`}>
                                                {item.status}
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
            <div className="p-8 border-t border-slate-800 bg-slate-900/30 flex gap-4">
                <button
                    onClick={onBackToScratch}
                    className="flex-1 bg-primary hover:bg-primaryDark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group"
                >
                    Try Your Luck Today
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
};

export default CustomerProfile;
