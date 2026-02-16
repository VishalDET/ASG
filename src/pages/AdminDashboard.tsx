import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Analytics from '../components/Admin/Analytics';
import CustomerList from '../components/Admin/CustomerList';
import OfferManager from '../components/Admin/OfferManager';
import RedemptionTerminal from '../components/Admin/RedemptionTerminal';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';
import { TabId } from '../layouts/AdminLayout/Sidebar';

interface AdminDashboardProps {
    onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<TabId>('analytics');

    return (
        <AdminLayout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={onLogout}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="h-full"
                >
                    {activeTab === 'customers' && <CustomerList />}
                    {activeTab === 'offers' && <OfferManager />}
                    {activeTab === 'redeem' && <RedemptionTerminal />}
                    {activeTab === 'analytics' && <Analytics />}
                </motion.div>
            </AnimatePresence>
        </AdminLayout>
    );
};

export default AdminDashboard;
