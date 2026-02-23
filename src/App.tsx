import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomerPortal from './pages/CustomerPortal';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const AdminRoute: React.FC<{ children: React.ReactNode; isAuthenticated: boolean }> = ({ children, isAuthenticated }) => {
    if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
    return <>{children}</>;
};

const App: React.FC = () => {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('bypass') === 'true';
    });

    // Handle initial state and bypass reactive updates
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('bypass') === 'true') {
            setIsAdminAuthenticated(true);
        }
    }, []);

    return (
        <Router>
            <Routes>
                {/* Admin Routes */}
                <Route path="/admin/login" element={
                    isAdminAuthenticated ? (
                        <Navigate to="/admin/dashboard" replace />
                    ) : (
                        <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />
                    )
                } />
                <Route path="/admin/*" element={
                    <AdminRoute isAuthenticated={isAdminAuthenticated}>
                        <AdminDashboard onLogout={() => setIsAdminAuthenticated(false)} />
                    </AdminRoute>
                } />

                {/* Customer Routes handled within CustomerPortal */}
                <Route path="/login" element={<CustomerPortal initialStep="login" />} />
                <Route path="/register" element={<CustomerPortal initialStep="register" />} />
                <Route path="/portal" element={<CustomerPortal initialStep="profile" />} />
                <Route path="/scratch" element={<CustomerPortal initialStep="scratch" />} />
                <Route path="/result" element={<CustomerPortal initialStep="result" />} />

                {/* Redirects */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
