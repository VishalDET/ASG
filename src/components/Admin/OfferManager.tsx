import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Power, Percent, Users, Calendar, X, Target, Info, TrendingUp, Loader2, Download, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Offer, TARGETS } from '../../types/offer';
import { offerService } from '../../services/offerService';
import OfferAnalyticsView from './OfferAnalyticsView';
import Papa from 'papaparse';



import toast from 'react-hot-toast';

const TARGET_ICONS = {
    all: Users,
    new: Target,
    frequent: Info,
    inactive: Calendar,
} as const;

const OfferManager: React.FC = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importPreviewData, setImportPreviewData] = useState<any[]>([]);
    const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
    const [viewingStats, setViewingStats] = useState<Offer | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    const fetchOffers = async () => {
        setLoading(true);
        const data = await offerService.getAllOffers();
        setOffers(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchOffers();
    }, []);

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

    const handleSave = async () => {
        const isEditing = !!editingOffer;
        const offerPayload = {
            id: isEditing ? editingOffer.id : 0,
            title: formData.title || '',
            description: formData.description || '',
            weight: formData.weight || 0,
            status: formData.status || 'active',
            targeting: formData.targeting || 'all',
            startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
            endDate: formData.endDate ? new Date(formData.endDate).toISOString() : new Date().toISOString(),
            spType: isEditing ? "U" : "C"
        };

        const loadingToast = toast.loading(isEditing ? 'Updating offer...' : 'Creating offer...');

        try {
            const response = await offerService.manageOffer(offerPayload);

            if (response.success) {
                toast.success(isEditing ? 'Offer updated successfully!' : 'Offer created successfully!', { id: loadingToast });
                await fetchOffers();
                setIsModalOpen(false);
            } else {
                toast.error(response.message || 'Failed to save offer', { id: loadingToast });
            }
        } catch (error) {
            console.error('Save error:', error);
            toast.error('An error occurred while saving', { id: loadingToast });
        }
    };

    const downloadTemplate = () => {
        const headers = ["Title", "Description", "Weight", "Status", "Targeting", "StartDate", "EndDate"];
        const sampleRow = ["Sample Offer", "Description of offer", "20", "active", "all", new Date().toISOString().split('T')[0], new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]];

        const csvContent = [headers.join(","), sampleRow.join(",")].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "offer_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const rows = results.data as any[];
                if (rows.length === 0) {
                    toast.error('The CSV file is empty.');
                    return;
                }
                setImportPreviewData(rows);
            },
            error: (error: any) => {
                toast.error(`Error parsing CSV: ${error.message}`);
            }
        });

        // Reset file input so the same file can be selected again
        if (e.target) e.target.value = '';
    };

    const handleConfirmImport = async () => {
        if (importPreviewData.length === 0) return;

        let successCount = 0;
        let errorCount = 0;

        const loadingToast = toast.loading(`Importing ${importPreviewData.length} offers...`);

        for (const row of importPreviewData) {
            try {
                const offerPayload = {
                    id: 0,
                    title: row.Title || '',
                    description: row.Description || '',
                    weight: parseInt(row.Weight) || 20,
                    status: row.Status || 'active',
                    targeting: row.Targeting || 'all',
                    startDate: row.StartDate ? new Date(row.StartDate).toISOString() : new Date().toISOString(),
                    endDate: row.EndDate ? new Date(row.EndDate).toISOString() : new Date().toISOString(),
                    spType: "C"
                };
                const response = await offerService.manageOffer(offerPayload);
                if (response.success) successCount++;
                else errorCount++;
            } catch (error) {
                errorCount++;
            }
        }

        if (successCount > 0) {
            toast.success(`Successfully imported ${successCount} offers!`, { id: loadingToast });
            fetchOffers();
        }
        if (errorCount > 0) {
            toast.error(`Failed to import ${errorCount} offers.`, { id: loadingToast });
        }

        setIsImportModalOpen(false);
        setImportPreviewData([]);
    };

    const handleDelete = (id: number) => {
        setDeleteConfirmId(id);
    };

    const confirmDelete = async () => {
        if (deleteConfirmId === null) return;
        const id = deleteConfirmId;
        setDeleteConfirmId(null);

        const loadingToast = toast.loading('Deleting offer...');
        try {
            const offerPayload = {
                id,
                title: "",
                description: "",
                weight: 0,
                status: "",
                targeting: "",
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(),
                spType: "D"
            };

            const response = await offerService.manageOffer(offerPayload);
            if (response.success) {
                toast.success('Offer deleted successfully!', { id: loadingToast });
                await fetchOffers();
            } else {
                toast.error(response.message || 'Failed to delete offer', { id: loadingToast });
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('An error occurred while deleting', { id: loadingToast });
        }
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
        <div className="p-8 space-y-6 relative min-h-screen max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Offer Management</h1>
                    <p className="text-slate-400 text-sm">Create and control scratch card rewards with precision targeting</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => {
                            setIsImportModalOpen(true);
                            setImportPreviewData([]);
                        }}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl font-bold transition-all border border-slate-700 cursor-pointer"
                    >
                        <Upload size={18} />
                        <span className="hidden sm:inline">Import Bulk Offers</span>
                    </button>

                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-brand-orange/20"
                    >
                        <Plus size={20} />
                        <span className="hidden sm:inline">New Offer</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
                    <p className="text-slate-400 font-medium">Loading offers from backend...</p>
                </div>
            ) : offers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 border-2 border-dashed border-slate-800 rounded-3xl">
                    <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-500">
                        <Plus size={32} />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-white">No Offers Found</h3>
                        <p className="text-slate-400 text-sm">Create your first reward to get started</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="mt-2 bg-brand-orange hover:bg-brand-orange/90 text-white px-6 py-2 rounded-xl font-bold transition-all"
                    >
                        New Offer
                    </button>
                </div>
            ) : (
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
                                                {TARGETS.find(t => t.value === offer.targeting)?.label || 'All Users'}
                                            </span>
                                        );
                                    })()}
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300">
                                        <Calendar size={12} className="text-brand-green" />
                                        {offer.endDate ? new Date(offer.endDate).toLocaleDateString() : 'No expiry'}
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
            )}

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

            {/* CSV Import Modal */}
            <AnimatePresence>
                {isImportModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsImportModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50 shrink-0 backdrop-blur-md">
                                <div>
                                    <h2 className="text-xl font-bold text-white">Import Offers via CSV</h2>
                                    <p className="text-slate-400 text-xs mt-1">Upload a CSV file or download the template</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={downloadTemplate}
                                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl font-bold transition-all border border-slate-700 text-sm"
                                    >
                                        <Download size={16} />
                                        Template
                                    </button>
                                    <button
                                        onClick={() => setIsImportModalOpen(false)}
                                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 flex-1 overflow-y-auto space-y-6">
                                {/* Upload Zone */}
                                <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-slate-900/50">
                                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                                        <Upload size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Upload CSV File</h3>
                                    <p className="text-slate-400 text-sm mb-6 max-w-md">
                                        Ensure your CSV headers exactly match the template (Title, Description, Weight, Status, Targeting, StartDate, EndDate).
                                    </p>
                                    <label className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-brand-orange/20 cursor-pointer">
                                        Select File
                                        <input
                                            type="file"
                                            accept=".csv"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                        />
                                    </label>
                                </div>

                                {/* Preview Table */}
                                {importPreviewData.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Preview</h3>
                                                <p className="text-xs text-slate-500">Found {importPreviewData.length} records to import</p>
                                            </div>
                                        </div>
                                        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/50">
                                            <table className="w-full text-left whitespace-nowrap">
                                                <thead>
                                                    <tr className="bg-slate-900 border-b border-slate-800">
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Title</th>
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Weight</th>
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Status</th>
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Targeting</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-800/50">
                                                    {importPreviewData.slice(0, 5).map((row, i) => (
                                                        <tr key={i} className="hover:bg-slate-900/50 transition-colors">
                                                            <td className="px-6 py-3 text-sm text-white font-medium">{row.Title || '-'}</td>
                                                            <td className="px-6 py-3 text-sm text-slate-400 font-mono">{row.Weight || '20'}%</td>
                                                            <td className="px-6 py-3">
                                                                <span className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-300 font-medium">
                                                                    {row.Status || 'active'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-3 text-sm text-slate-400">{row.Targeting || 'all'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {importPreviewData.length > 5 && (
                                                <div className="p-3 text-center text-xs text-slate-500 font-medium border-t border-slate-800 bg-slate-900 rounded-b-2xl">
                                                    And {importPreviewData.length - 5} more records...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-slate-800/30 border-t border-slate-800 shrink-0 flex justify-end gap-4">
                                <button
                                    onClick={() => setIsImportModalOpen(false)}
                                    className="px-6 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmImport}
                                    disabled={importPreviewData.length === 0}
                                    className="px-8 py-2.5 rounded-xl font-bold bg-brand-orange text-white hover:bg-brand-orange/90 shadow-lg shadow-brand-orange/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Confirm & Import
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirmId !== null && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeleteConfirmId(null)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-6">
                                    <Trash2 size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Delete Offer?</h3>
                                <p className="text-slate-400 text-sm">
                                    Are you sure you want to delete this offer? This action cannot be undone.
                                </p>
                            </div>
                            <div className="p-6 bg-slate-800/30 border-t border-slate-800 shrink-0 flex justify-center gap-4">
                                <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-6 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-8 py-2.5 rounded-xl font-bold bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 text-white transition-all transform hover:scale-105"
                                >
                                    Delete
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
