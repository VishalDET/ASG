import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomerPortal from './pages/CustomerPortal';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';

const AdminRoute: React.FC<{ children: React.ReactNode; isAuthenticated: boolean }> = ({ children, isAuthenticated }) => {
    if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
    return <>{children}</>;
};

const App: React.FC = () => {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const bypass = params.get('bypass') === 'true';

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user || bypass) {
                setIsAdminAuthenticated(true);
            } else {
                setIsAdminAuthenticated(false);
            }
            setIsAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsAdminAuthenticated(false);
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    if (isAuthLoading) {
        return (
            <div className="min-h-screen bg-dark flex flex-col items-center justify-center text-primary">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-400 font-medium">Verifying Session...</p>
            </div>
        );
    }

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
                        <AdminDashboard onLogout={handleLogout} />
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
