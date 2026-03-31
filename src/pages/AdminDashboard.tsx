import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Analytics from '../components/Admin/Analytics';
import CustomerList from '../components/Admin/CustomerList';
import OfferManager from '../components/Admin/OfferManager';
import RedemptionTerminal from '../components/Admin/RedemptionTerminal';
import AdminProfile from '../components/Admin/AdminProfile';
import AdminUserManager from '../components/Admin/AdminUserManager';
import RedemptionHistory from '../components/Admin/RedemptionHistory';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';

interface AdminDashboardProps {
    onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const location = useLocation();

    const role = (() => {
        try {
            const s = sessionStorage.getItem('adminSession');
            return s ? JSON.parse(s).role : '';
        } catch { return ''; }
    })();

    const isSuperAdmin = role?.toLowerCase() === 'superadmin';

    const pageWrap = (component: React.ReactNode, overflow = false) => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`h-full${overflow ? ' overflow-y-auto' : ''}`}
        >
            {component}
        </motion.div>
    );

    return (
        <AdminLayout onLogout={onLogout}>
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    {/* Default redirect based on role */}
                    <Route index element={<Navigate to={isSuperAdmin ? 'analytics' : 'redeem'} replace />} />

                    {/* SuperAdmin-only routes */}
                    <Route path="analytics" element={isSuperAdmin ? pageWrap(<Analytics />) : <Navigate to="redeem" replace />} />
                    <Route path="customers" element={isSuperAdmin ? pageWrap(<CustomerList />) : <Navigate to="redeem" replace />} />
                    <Route path="offers" element={isSuperAdmin ? pageWrap(<OfferManager />) : <Navigate to="redeem" replace />} />
                    <Route path="profile" element={isSuperAdmin ? pageWrap(<AdminProfile />, true) : <Navigate to="redeem" replace />} />
                    <Route path="users" element={isSuperAdmin ? pageWrap(<AdminUserManager />, true) : <Navigate to="redeem" replace />} />
                    <Route path="history" element={isSuperAdmin ? pageWrap(<RedemptionHistory />, true) : <Navigate to="redeem" replace />} />

                    {/* Available to all roles */}
                    <Route path="redeem" element={pageWrap(<RedemptionTerminal />)} />
                </Routes>
            </AnimatePresence>
        </AdminLayout>
    );
};

export default AdminDashboard;
