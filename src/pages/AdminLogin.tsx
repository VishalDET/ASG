import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { adminService } from '../services/adminService';

interface AdminLoginProps {
    onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // 1. Authenticate with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (user.email) {
                // 2. Fetch the corresponding Admin profile from backend
                const adminResponse = await adminService.getAdminByEmail(user.email);

                if (adminResponse.success && adminResponse.data) {
                    const adminData = adminResponse.data;

                    if (!adminData.isActive) {
                        setError('This admin account has been deactivated.');
                        await auth.signOut();
                        return;
                    }

                    // 3. Store the required Admin profile fields in sessionStorage
                    sessionStorage.setItem('adminSession', JSON.stringify({
                        id: adminData.id,
                        firebaseUid: adminData.firebaseUid,
                        email: adminData.email,
                        role: adminData.role
                    }));

                    onLogin();
                } else {
                    // Profile not found in backend DB
                    setError('Admin profile not found in the system. Access Denied.');
                    await auth.signOut();
                }
            } else {
                setError('Failed to retrieve user email. Please try again.');
                await auth.signOut();
            }

        } catch (err: any) {
            console.error('Login error:', err);
            // Firebase error messages are usually developer-friendly, so we can map common ones
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                setError('Invalid email or password');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many failed login attempts. Please try again later.');
            } else {
                setError('Failed to login. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-10 rounded-3xl w-full max-w-md border-t-4 border-t-primary"
            >
                <div className="flex justify-center mb-6">
                    <div className="bg-primary/20 p-4 rounded-2xl">
                        <ShieldCheck className="w-10 h-10 text-primary" />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
                    <p className="text-slate-400 mt-2">Sign in to manage your loyalty system</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                placeholder="admin@asg.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primaryDark text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 group transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Sign In
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-800 text-center space-y-4">
                    <p className="text-slate-500 text-sm">
                        Demo Credentials: <br />
                        <span className="text-slate-300">admin@asg.com / admin123</span>
                    </p>
                    <button
                        onClick={onLogin}
                        className="text-primary/60 hover:text-primary text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                        Bypass Login (Dev Only)
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
