import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Analytics from '../components/Admin/Analytics';
import CustomerList from '../components/Admin/CustomerList';
import OfferManager from '../components/Admin/OfferManager';
import RedemptionTerminal from '../components/Admin/RedemptionTerminal';
import AdminProfile from '../components/Admin/AdminProfile';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';

interface AdminDashboardProps {
    onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const location = useLocation();

    return (
        <AdminLayout
            onLogout={onLogout}
        >
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route index element={<Navigate to="analytics" replace />} />
                    <Route path="analytics" element={
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="h-full"
                        >
                            <Analytics />
                        </motion.div>
                    } />
                    <Route path="customers" element={
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="h-full"
                        >
                            <CustomerList />
                        </motion.div>
                    } />
                    <Route path="offers" element={
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="h-full"
                        >
                            <OfferManager />
                        </motion.div>
                    } />
                    <Route path="redeem" element={
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="h-full"
                        >
                            <RedemptionTerminal />
                        </motion.div>
                    } />
                    <Route path="profile" element={
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="h-full overflow-y-auto"
                        >
                            <AdminProfile />
                        </motion.div>
                    } />
                </Routes>
            </AnimatePresence>
        </AdminLayout>
    );
};

export default AdminDashboard;
