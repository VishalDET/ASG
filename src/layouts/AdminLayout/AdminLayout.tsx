import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { adminService, AdminProfile } from '../../services/adminService';

interface AdminLayoutProps {
    children: React.ReactNode;
    onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
    children,
    onLogout
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [adminData, setAdminData] = useState<AdminProfile | null>(null);

    // Read role directly from session (available immediately, no API wait)
    const sessionRole = (() => {
        try {
            const s = sessionStorage.getItem('adminSession');
            return s ? JSON.parse(s).role : undefined;
        } catch { return undefined; }
    })();

    useEffect(() => {
        const fetchAdminProfile = async () => {
            const session = sessionStorage.getItem('adminSession');
            if (session) {
                const { email } = JSON.parse(session);
                if (email) {
                    const response = await adminService.getAdminByEmail(email);
                    if (response.success && response.data) {
                        setAdminData(response.data);
                    }
                }
            }
        };
        fetchAdminProfile();
    }, []);

    return (
        <div className="min-h-screen bg-dark text-slate-200 flex italic-none">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                onLogout={onLogout}
                role={adminData?.role || sessionRole}
            />

            <main className="flex-1 flex flex-col h-screen overflow-hidden w-full">
                <Header
                    userName={adminData?.name || "Admin"}
                    userRole={adminData?.role || sessionRole || "Admin"}
                    userInitial={(adminData?.name || "A").charAt(0).toUpperCase()}
                />

                <div className="flex-1 overflow-y-auto bg-dark">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
