import React, { useState, useEffect } from 'react';
import { Plus, Shield, X, Loader2, Trash2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { adminService, AdminProfile } from '../../services/adminService';
import { createSecondaryUser } from '../../firebase';

const AdminUserManager: React.FC = () => {
    const [admins, setAdmins] = useState<AdminProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    // Get current logged in admin ID to prevent self-deletion
    const currentAdminSession = sessionStorage.getItem('adminSession');
    const currentAdminId = currentAdminSession ? JSON.parse(currentAdminSession).id : null;

    const fetchAdmins = async () => {
        setLoading(true);
        const data = await adminService.getAllAdmins();
        setAdmins(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'SuperAdmin',
        password: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOpenModal = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            role: 'SuperAdmin',
            password: '',
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const loadingToast = toast.loading('Creating Admin User...');

        try {
            // Priority: Create user in our DB first 
            // Note: API doc says "ignore firebaseUid" for request but expects it. 
            // We'll pass a placeholder or let backend handle it, though a better approach 
            // is Firebase first, but we follow the prompt's implied order or standard fallback.
            // Let's create Firebase user first so we have the real UID, even if backend ignores it 
            // - it's a safer standard pattern.

            const fbRes = await createSecondaryUser(formData.email, formData.password);

            if (!fbRes.success) {
                toast.error(`Firebase Error: ${fbRes.message}`, { id: loadingToast });
                setIsSubmitting(false);
                return;
            }

            const newFirebaseUid = fbRes.user?.uid || 'placeholder-uid';

            // Now call the backend API
            const adminPayload = {
                id: 0,
                firebaseUid: newFirebaseUid,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                role: formData.role,
                password: formData.password,
                spType: "C"
            };

            const backendRes = await adminService.manageAdmin(adminPayload);

            if (backendRes.success) {
                toast.success('Admin user created successfully!', { id: loadingToast });
                setIsModalOpen(false);
                fetchAdmins();
            } else {
                toast.error(backendRes.message || 'Failed to create admin in database.', { id: loadingToast });
                // We'd ideally rollback Firebase here if backend failed
            }

        } catch (error) {
            console.error('Error in save flow', error);
            toast.error('An unexpected error occurred.', { id: loadingToast });
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteConfirmId) return;

        const loadingToast = toast.loading('Deleting admin user...');
        try {
            const adminPayload = {
                id: deleteConfirmId,
                firebaseUid: "",
                name: "",
                email: "",
                phone: "",
                role: "",
                password: "",
                spType: "D"
            };

            const response = await adminService.manageAdmin(adminPayload);

            if (response.success) {
                toast.success('Admin user deleted successfully!', { id: loadingToast });
                setDeleteConfirmId(null);
                fetchAdmins();
            } else {
                toast.error(response.message || 'Failed to delete admin user', { id: loadingToast });
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('An unexpected error occurred.', { id: loadingToast });
        }
    };

    return (
        <div className="p-8 space-y-6 max-w-7xl mx-auto min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Admin Users</h1>
                    <p className="text-slate-400 text-sm">Manage system administrators and roles</p>
                </div>
                <button
                    onClick={handleOpenModal}
                    className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-brand-orange/20"
                >
                    <Plus size={20} />
                    <span>New Admin</span>
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
                    <p className="text-slate-400 font-medium">Loading administrators...</p>
                </div>
            ) : admins.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 border-2 border-dashed border-slate-800 rounded-3xl">
                    <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-500">
                        <Shield size={32} />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-white">No Additional Admins Loaded</h3>
                        <p className="text-slate-400 text-sm">Create a new admin to grant system access</p>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto text-[13px]">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-800/50 border-b border-slate-800">
                                    <th className="px-6 py-4 font-bold text-white uppercase tracking-wider text-[11px]">Name</th>
                                    <th className="px-6 py-4 font-bold text-white uppercase tracking-wider text-[11px]">Contact Info</th>
                                    <th className="px-6 py-4 font-bold text-white uppercase tracking-wider text-[11px]">Role</th>
                                    <th className="px-6 py-4 font-bold text-white uppercase tracking-wider text-[11px]">Status</th>
                                    <th className="px-6 py-4 font-bold text-white uppercase tracking-wider text-[11px] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {admins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange font-bold uppercase">
                                                    {admin.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-white">{admin.name}</span>
                                                    <span className="text-slate-500 text-[10px]">Added {new Date(admin.createdDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-white text-sm font-medium">{admin.email}</span>
                                                <span className="text-slate-500 text-xs">{admin.phone || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border w-fit ${admin.role === 'SuperAdmin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                admin.role === 'Admin' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    'bg-slate-800 text-slate-300 border-slate-700'
                                                }`}>
                                                {admin.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-1.5 text-xs font-medium ${admin.isActive ? 'text-green-400' : 'text-slate-500'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${admin.isActive ? 'bg-green-400' : 'bg-slate-500'}`}></span>
                                                {admin.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            {admin.id !== currentAdminId && (
                                                <button
                                                    onClick={() => setDeleteConfirmId(admin.id)}
                                                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                    title="Delete Admin"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Admin Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isSubmitting && setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50">
                                <h2 className="text-xl font-bold text-white">Add New Admin</h2>
                                <button
                                    onClick={() => !isSubmitting && setIsModalOpen(false)}
                                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-400">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors"
                                            placeholder="System Admin"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-400">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors"
                                                placeholder="admin@email.com"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-400">Phone Number</label>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors"
                                                placeholder="9876543210"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-400">Role</label>
                                            <select
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors appearance-none"
                                            >
                                                <option value="SuperAdmin">SuperAdmin</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Manager">Manager</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-400">Password</label>
                                            <input
                                                type="password"
                                                required
                                                minLength={6}
                                                value={formData.password}
                                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        disabled={isSubmitting}
                                        className="px-6 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-8 py-2.5 rounded-xl font-bold bg-brand-orange text-white hover:bg-brand-orange/90 shadow-lg shadow-brand-orange/20 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ minWidth: '140px' }}
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save User'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirmId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 text-center"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                                <AlertTriangle size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Delete Admin User?</h2>
                            <p className="text-slate-400 mb-8">
                                Are you sure you want to delete this admin user? This action cannot be undone and will permanently remove their access to the system.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-500/20"
                                >
                                    Yes, Delete User
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUserManager;
