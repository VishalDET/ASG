import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Users,
    Gift,
    TicketCheck,
    BarChart3,
    LogOut,
    Menu,
    X,
    Shield,
    History
} from 'lucide-react';

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    onLogout: () => void;
    role?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
    isSidebarOpen,
    setIsSidebarOpen,
    onLogout,
    role
}) => {
    const allMenuItems = [
        { path: '/admin/analytics', label: 'Dashboard', icon: BarChart3, superAdminOnly: true },
        { path: '/admin/customers', label: 'Customers', icon: Users, superAdminOnly: true },
        { path: '/admin/offers', label: 'Offer Manager', icon: Gift, superAdminOnly: true },
        { path: '/admin/redeem', label: 'Redemption', icon: TicketCheck, superAdminOnly: false },
        { path: '/admin/history', label: 'History', icon: History, superAdminOnly: true },
        { path: '/admin/users', label: 'Admin Users', icon: Shield, superAdminOnly: true },
    ];

    const isSuperAdmin = role?.toLowerCase() === 'superadmin';
    const menuItems = isSuperAdmin
        ? allMenuItems
        : allMenuItems.filter(item => !item.superAdminOnly);

    return (
        <aside className={`
            ${isSidebarOpen ? 'w-72' : 'w-20'} 
            bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 transition-all duration-300 flex flex-col z-50
        `}>
            <div className="p-6 flex items-center justify-between">
                {isSidebarOpen && (
                    <div className="flex items-center gap-3">
                        <img src="/asg.png" alt="ASG Logo" className="h-12 w-auto" />
                        <span className="font-bold text-xl tracking-tight">Admin</span>
                    </div>
                )}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all
                            ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'hover:bg-slate-800 text-slate-400'}
                        `}
                    >
                        <item.icon size={22} />
                        {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                >
                    <LogOut size={22} />
                    {isSidebarOpen && <span className="font-medium">Sign Out</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
