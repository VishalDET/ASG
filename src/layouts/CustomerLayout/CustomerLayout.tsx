import React from 'react';
import { User } from 'lucide-react';

interface CustomerLayoutProps {
    children: React.ReactNode;
    customer: { name: string } | null;
    showProfileButton: boolean;
    onProfileClick: () => void;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({
    children,
    customer,
    showProfileButton,
    onProfileClick
}) => {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
            {/* Background Layer with Blur */}
            <div className="absolute inset-0 bg-[url('/asg-user-login-bg.jpg')] bg-cover bg-center blur-sm scale-110 brightness-[0.5]" />
            <div className="absolute inset-0 bg-gray-900/10" />

            {/* Header Navigation */}
            <div className="fixed top-6 left-6 right-6 flex justify-between items-center z-50">
                <div /> {/* Spacer */}
                <div /> {/* Spacer */}
                {customer && showProfileButton && (
                    <button
                        onClick={onProfileClick}
                        className="bg-slate-800/80 backdrop-blur-md border border-slate-700 p-3 rounded-full text-primary hover:text-white hover:bg-primary transition-all shadow-xl"
                    >
                        <User size={24} />
                    </button>
                )}
            </div>

            {children}

            <footer className="mt-12 text-slate-500 text-xs text-center">
                Powered by ASG Loyalty System • &copy; {new Date().getFullYear()}
            </footer>
        </div>
    );
};

export default CustomerLayout;
