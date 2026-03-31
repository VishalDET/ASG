import React, { useState, useEffect } from 'react';
import {
    History,
    Search,
    Filter,
    Calendar,
    User,
    Gift,
    ArrowUpDown,
    Download,
    Loader2,
    X,
    ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { redemptionService, RedemptionRecord } from '../../services/redemptionService';
import { offerService } from '../../services/offerService';
import { Offer } from '../../types/offer';

const RedemptionHistory: React.FC = () => {
    const [redemptions, setRedemptions] = useState<RedemptionRecord[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Filters
    const [selectedOfferId, setSelectedOfferId] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const offersData = await offerService.getAllOffers();
                setOffers(offersData);
            } catch (error) {
                console.error("Failed to fetch offers:", error);
            }
        };
        fetchOffers();
    }, []);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            try {
                let offerTitle = '';
                if (selectedOfferId !== 'all') {
                    // Find the offer title if applicable
                    const offer = offers.find(o => o.id.toString() === selectedOfferId);
                    if (offer) offerTitle = offer.title;
                }

                // If date range is empty, pass empty string or default dates. We'll pass empty string assuming backend handles it.
                // If it fails, we may need to pass actual date objects.
                const startDateStr = dateRange.start ? new Date(dateRange.start).toISOString() : new Date('2020-01-01').toISOString();
                const endDateStr = dateRange.end ? new Date(dateRange.end + 'T23:59:59').toISOString() : new Date().toISOString();

                // Construct search query combining text search and status
                let finalSearchQuery = debouncedSearchTerm.trim();
                if (selectedStatus !== 'all') {
                    finalSearchQuery = finalSearchQuery ? `${finalSearchQuery} ${selectedStatus}` : selectedStatus;
                }

                const response = await redemptionService.getRedemptionHistory({
                    pageNumber: pageSize === 0 ? 0 : pageNumber,
                    pageSize: pageSize,
                    searchQuery: finalSearchQuery,
                    offerTitle: offerTitle,
                    startDate: startDateStr,
                    endDate: endDateStr
                });
                setRedemptions(response.data);
                setTotalCount(response.totalCount);
            } catch (error) {
                console.error("Failed to fetch redemption history:", error);
            } finally {
                setIsLoading(false);
            }
        };
        // wait for offers to load before trying to match the title (not strictly required if all is selected)
        fetchHistory();
    }, [debouncedSearchTerm, selectedOfferId, selectedStatus, dateRange, pageNumber, pageSize, offers]);

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedOfferId('all');
        setSelectedStatus('all');
        setDateRange({ start: '', end: '' });
        setPageNumber(1);
        setPageSize(10);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-slate-400 font-medium tracking-wide">Loading Redemption History...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-7xl mx-auto"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2 gap-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-xl relative overflow-hidden">
                <div className="flex items-center gap-6 z-10">
                    <div className="bg-primary/20 p-4 rounded-2xl text-primary shadow-lg shadow-primary/10 border border-primary/20">
                        <History size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-normal text-white tracking-tight">Redemption History</h2>
                        <p className="text-slate-400 text-sm mt-1 font-medium flex items-center gap-2 font-normal">
                            Track and analyze all offer redemptions across your platform
                        </p>
                    </div>
                </div>

                {/* <div className="flex items-center gap-3 z-10 w-full md:w-auto">
                    <button
                        onClick={() => { }}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all border border-slate-700 shadow-xl"
                    >
                        <Download size={18} />
                        Export Data
                    </button>
                    <div className="hidden lg:block h-12 w-px bg-slate-800 mx-2" />
                    <div className="hidden lg:block text-right">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Total Cleared</p>
                        <p className="text-2xl font-black text-white">{redemptions.length}</p>
                    </div>
                </div> */}

                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32" />
            </div>

            {/* Filters Bar */}
            {/* Filters Bar - Modern Premium Styling */}
            <div className="bg-slate-900/40 p-5 rounded-[2rem] border border-slate-800/50 backdrop-blur-md shadow-inner relative group/bar">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                    
                    {/* Search Field - Main Focus */}
                    <div className="flex-1 min-w-[200px] relative group/search">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within/search:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Find by customer, code..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950/40 border border-slate-800 hover:border-slate-700 focus:border-primary/50 text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none transition-all placeholder:text-slate-600 font-medium text-sm shadow-inner"
                        />
                    </div>

                    {/* Filter Group: Offer & Status */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative group/offer min-w-[160px]">
                            <select
                                value={selectedOfferId}
                                onChange={(e) => setSelectedOfferId(e.target.value)}
                                className="w-full bg-slate-950/40 border border-slate-800 hover:border-slate-700 focus:border-primary/50 text-white rounded-xl py-3.5 pl-4 pr-10 focus:outline-none transition-all appearance-none text-xs font-bold uppercase tracking-wider cursor-pointer shadow-inner"
                            >
                                <option value="all">Offers: All</option>
                                {offers.map(offer => (
                                    <option key={offer.id} value={offer.id.toString()}>{offer.title}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4 pointer-events-none group-hover/offer:text-slate-400 transition-colors" />
                        </div>

                        <div className="relative group/status min-w-[140px]">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full bg-slate-950/40 border border-slate-800 hover:border-slate-700 focus:border-primary/50 text-white rounded-xl py-3.5 pl-4 pr-10 focus:outline-none transition-all appearance-none text-xs font-bold uppercase tracking-wider cursor-pointer shadow-inner"
                            >
                                <option value="all">Status: All</option>
                                <option value="Generated">Status: Generated</option>
                                <option value="Redeemed">Status: Redeemed</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4 pointer-events-none group-hover/status:text-slate-400 transition-colors" />
                        </div>
                    </div>

                    {/* Date Pickers */}
                    <div className="flex gap-2 p-1 bg-slate-950/40 border border-slate-800 rounded-xl overflow-hidden shrink-0">
                        <div className="relative group/date">
                            <input
                                type="date"
                                title="Start Date"
                                value={dateRange.start}
                                onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                className="bg-transparent text-white py-2 pl-3 pr-1 focus:outline-none text-[10px] font-black uppercase [color-scheme:dark] cursor-pointer w-[120px]"
                            />
                        </div>
                        <div className="w-px h-4 bg-slate-800 self-center" />
                        <div className="relative group/date">
                            <input
                                type="date"
                                title="End Date"
                                value={dateRange.end}
                                onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                className="bg-transparent text-white py-2 pl-3 pr-1 focus:outline-none text-[10px] font-black uppercase [color-scheme:dark] cursor-pointer w-[120px]"
                            />
                        </div>
                    </div>

                    {/* PageSize & Reset Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="relative group/size">
                            <span className="absolute -top-6 left-0 text-[9px] font-black text-slate-500 uppercase tracking-widest pointer-events-none opacity-0 group-hover/bar:opacity-100 transition-opacity">Results</span>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setPageNumber(1);
                                }}
                                className="min-w-[70px] bg-slate-950/40 border border-slate-800 hover:border-slate-700 focus:border-primary/50 text-white rounded-xl py-3.5 px-3 focus:outline-none transition-all appearance-none font-bold text-xs text-center cursor-pointer shadow-inner"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={0}>All</option>
                            </select>
                        </div>

                        <button
                            onClick={resetFilters}
                            disabled={selectedOfferId === 'all' && selectedStatus === 'all' && !searchTerm && !dateRange.start && !dateRange.end}
                            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-slate-400 hover:text-white rounded-xl w-12 h-12 flex items-center justify-center transition-all group/reset border border-slate-700 shadow-lg active:scale-95"
                            title="Reset all filters"
                        >
                            <X size={18} className="group-active/reset:rotate-90 transition-transform" />
                        </button>
                    </div>

                </div>
            </div>

            {/* Table Section */}
            <div className="bg-slate-900/40 rounded-[2.5rem] border border-slate-800/50 overflow-hidden backdrop-blur-md shadow-2xl relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/40 border-b border-slate-800">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                    <div className="flex items-center gap-2">Customer <ArrowUpDown size={10} /></div>
                                </th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Offer</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Code</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Date & Time</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {redemptions.length > 0 ? (
                                redemptions.map((record, index) => (
                                    <motion.tr
                                        key={`${record.code}-${record.redeemedDatetime}-${index}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.02 }}
                                        className="hover:bg-white/[0.02] transition-colors group cursor-default"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white tracking-tight">{record.customerName}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-lg border border-slate-700/50 group-hover:border-accent/30 transition-colors">
                                                    <Gift size={14} className="text-accent/60" />
                                                    <span className="text-slate-300 font-bold text-xs">{record.offerTitle}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <code className="px-3 py-1.5 bg-black/40 text-primary font-mono text-xs font-black tracking-widest rounded-xl border border-primary/20">
                                                {record.code}
                                            </code>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <div className="space-y-1">
                                                {record.status === 'Redeemed' ? (
                                                    <>
                                                        <p className="text-slate-300 font-bold text-sm">
                                                            {record.redeemedDatetime ? new Date(record.redeemedDatetime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                                        </p>
                                                        <p className="text-slate-500 text-[10px] font-black flex items-center justify-center gap-1 uppercase">
                                                            <Calendar size={10} />
                                                            {record.redeemedDatetime ? new Date(record.redeemedDatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="text-slate-300 font-bold text-sm">
                                                            {record.revealedDatetime ? new Date(record.revealedDatetime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                                        </p>
                                                        <p className="text-slate-500 text-[10px] font-black flex items-center justify-center gap-1 uppercase">
                                                            <span className="text-primary italic">Revealed</span>
                                                            <Calendar size={10} className="ml-1" />
                                                            {record.revealedDatetime ? new Date(record.revealedDatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end">
                                                <span className={`px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest border ${record.status === 'Redeemed'
                                                    ? 'bg-success/10 text-success border-success/20'
                                                    : 'bg-slate-800 text-slate-400 border-slate-700'
                                                    }`}>
                                                    {record.status}
                                                </span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-20">
                                            <History size={64} className="text-slate-500" />
                                            <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No redemption records found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {pageSize !== 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 backdrop-blur-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                        Showing <span className="text-white">{redemptions.length}</span> of <span className="text-white">{totalCount}</span> records
                    </p>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                            disabled={pageNumber === 1}
                            className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl font-bold text-xs uppercase hover:text-white transition-colors border border-slate-700 disabled:opacity-20"
                        >
                            Previous
                        </button>
                        <div className="flex gap-1">
                            {[...Array(Math.ceil(totalCount / pageSize))].map((_, i) => (
                                <button 
                                    key={i}
                                    onClick={() => setPageNumber(i + 1)}
                                    className={`w-8 h-8 rounded-lg font-black text-xs transition-all ${
                                        pageNumber === i + 1 
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            )).slice(Math.max(0, pageNumber - 3), Math.min(Math.ceil(totalCount / pageSize), pageNumber + 2))}
                        </div>
                        <button 
                            onClick={() => setPageNumber(prev => Math.min(Math.ceil(totalCount / pageSize), prev + 1))}
                            disabled={pageNumber === Math.ceil(totalCount / pageSize) || totalCount === 0}
                            className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl font-bold text-xs uppercase hover:text-white transition-colors border border-slate-700 disabled:opacity-20"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default RedemptionHistory;
