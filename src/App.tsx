import React, { useState } from 'react';
import CustomerPortal from './pages/CustomerPortal';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
    const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

    // Simple router-like logic
    React.useEffect(() => {
        const handlePopState = () => setCurrentPath(window.location.pathname);
        window.addEventListener('popstate', handlePopState);

        // Handle login bypass via query parameter
        const params = new URLSearchParams(window.location.search);
        if (params.get('bypass') === 'true') {
            setIsAdminAuthenticated(true);
        }

        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const navigate = (path: string) => {
        window.history.pushState({}, '', path);
        setCurrentPath(path);
    };

    if (currentPath.startsWith('/admin')) {
        if (!isAdminAuthenticated) {
            return (
                <AdminLogin
                    onLogin={() => {
                        setIsAdminAuthenticated(true);
                        navigate('/admin/dashboard');
                    }}
                />
            );
        }
        return (
            <AdminDashboard
                onLogout={() => {
                    setIsAdminAuthenticated(false);
                    navigate('/admin');
                }}
            />
        );
    }

    // Default to Customer Portal
    return <CustomerPortal />;
};

export default App;
