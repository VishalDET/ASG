import React from 'react';
import { Bell, Search } from 'lucide-react';

interface HeaderProps {
    userName: string;
    userRole: string;
    userInitial: string;
}

const Header: React.FC<HeaderProps> = ({ userName, userRole, userInitial }) => {
    return (
        <header className="h-20 border-b border-slate-800 bg-dark/50 backdrop-blur-md px-8 flex items-center justify-between z-40">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative max-w-md w-full hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-primary/50 transition-all text-sm text-slate-200 placeholder:text-slate-500 shadow-inner"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-slate-400 hover:bg-slate-800 rounded-lg transition-all group">
                    <Bell size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-dark"></span>
                </button>
                <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-white">{userName}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">{userRole}</p>
                    </div>
                    <div className="w-10 h-10 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center font-bold text-primary shadow-lg shadow-primary/5 ring-1 ring-white/5">
                        {userInitial}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
