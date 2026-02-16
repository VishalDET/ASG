import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Gift,
    TicketCheck,
    History,
    Calendar,
    ChevronRight,
    User as UserIcon
} from 'lucide-react';

interface OfferHistoryItem {
    id: string;
    title: string;
    code: string;
    status: 'available' | 'redeemed';
    date: string;
}

interface CustomerProfileProps {
    customer: {
        name: string;
        phone: string;
        visits: number;
        offersCount: number;
    };
    history: OfferHistoryItem[];
    onClose: () => void;
    onBackToScratch: () => void;
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ customer, history, onClose, onBackToScratch }) => {
    const availableOffers = history.filter(h => h.status === 'available');
    const redeemedOffers = history.filter(h => h.status === 'redeemed');

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
        >
            {/* Header */}
            <div className="bg-brand-blue/10 p-8 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue border border-brand-blue/30">
                        <UserIcon size={30} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">{customer.name}</h2>
                        <p className="text-slate-400 font-medium">{customer.phone}</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-slate-500 hover:text-white transition-colors p-2"
                >
                    ✕
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className="bg-brand-orange/10 p-3 rounded-xl text-brand-orange">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Total Visits</p>
                            <p className="text-2xl font-black text-white">{customer.visits}</p>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className="bg-brand-green/10 p-3 rounded-xl text-brand-green">
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
                        <History size={20} className="text-brand-blue" />
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
                                    className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex items-center justify-between group hover:border-brand-blue/30 transition-all shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${item.status === 'redeemed' ? 'bg-slate-800 text-slate-500' : 'bg-brand-orange/10 text-brand-orange'}`}>
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
                                                    : 'bg-brand-green/10 text-brand-green'
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
                    className="flex-1 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-blue/20 transition-all flex items-center justify-center gap-2 group"
                >
                    Try Your Luck Today
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
};

export default CustomerProfile;
