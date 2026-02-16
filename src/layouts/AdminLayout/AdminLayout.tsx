import React, { useState } from 'react';
import Sidebar, { TabId } from './Sidebar';
import Header from './Header';

interface AdminLayoutProps {
    children: React.ReactNode;
    activeTab: TabId;
    setActiveTab: (tab: TabId) => void;
    onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
    children,
    activeTab,
    setActiveTab,
    onLogout
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 flex italic-none">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                onLogout={onLogout}
            />

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header
                    userName="Vishal Admin"
                    userRole="Superadmin"
                    userInitial="V"
                />

                <div className="flex-1 overflow-y-auto bg-[#020617]">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
