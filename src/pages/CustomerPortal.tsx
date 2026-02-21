import React, { useState, useEffect } from 'react';
import RegistrationForm from '../components/Customer/RegistrationForm';
import UserLogin from '../layouts/CustomerLayout/UserLogin';
import ScratchCard from '../components/Customer/ScratchCard';
import ResultView from '../components/Customer/ResultView';
import CustomerProfile from '../components/Customer/CustomerProfile';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomerLayout from '../layouts/CustomerLayout/CustomerLayout';
import { Customer, CustomerRegistration } from '../types/customer';
import { customerService } from '../services/customerService';

const OFFERS = [
    { title: '10% OFF', code: 'RESTO-ASG-10', weight: 50 },
    { title: '20% OFF', code: 'RESTO-ASG-20', weight: 30 },
    { title: 'Free Dessert', code: 'RESTO-SWEET', weight: 15 },
    { title: '50% OFF', code: 'RESTO-BINGO', weight: 5 },
];

const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

const getRandomOffer = () => {
    const totalWeight = OFFERS.reduce((acc, offer) => acc + offer.weight, 0);
    let random = Math.random() * totalWeight;
    for (const offer of OFFERS) {
        if (random < offer.weight) return offer;
        random -= offer.weight;
    }
    return OFFERS[0];
};

interface CustomerPortalProps {
    initialStep?: 'register' | 'login' | 'scratch' | 'result' | 'profile';
}

const CustomerPortal: React.FC<CustomerPortalProps> = ({ initialStep = 'login' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState<'register' | 'login' | 'scratch' | 'result' | 'profile'>(initialStep);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [selectedOffer, setSelectedOffer] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [prefilledPhone, setPrefilledPhone] = useState('');
    const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Sync state with prop if prop changes
    useEffect(() => {
        setStep(initialStep);
    }, [initialStep]);

    // Load session from localStorage on mount
    useEffect(() => {
        const savedSession = localStorage.getItem('asg_session');
        const savedHistory = localStorage.getItem('asg_history');

        if (savedSession) {
            try {
                const { data, expiresAt } = JSON.parse(savedSession);
                if (expiresAt > Date.now()) {
                    setCustomer(data);

                    // Background refresh to ensure data is not stale
                    customerService.getCustomerByPhone(data.phone).then(freshData => {
                        if (freshData) {
                            setCustomer(freshData);
                            saveSession(freshData);
                        }
                    });

                    // Redirect to portal if valid session exists and currently on login/register
                    if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/') {
                        navigate('/portal', { replace: true });
                    }
                } else {
                    localStorage.removeItem('asg_session');
                    if (location.pathname !== '/login' && location.pathname !== '/register') {
                        navigate('/login', { replace: true });
                    }
                }
            } catch (e) {
                localStorage.removeItem('asg_session');
                navigate('/login', { replace: true });
            }
        } else {
            // No session -> must login/register
            if (location.pathname === '/portal' || location.pathname === '/scratch') {
                navigate('/login', { replace: true });
            }
        }

        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, [location.pathname, navigate]);

    const saveSession = (customerData: Customer) => {
        const session = {
            data: customerData,
            expiresAt: Date.now() + SESSION_DURATION
        };
        localStorage.setItem('asg_session', JSON.stringify(session));
    };

    const handleLogin = async (phone: string) => {
        const remoteCustomer = await customerService.getCustomerByPhone(phone);
        if (remoteCustomer) {
            setCustomer(remoteCustomer);
            saveSession(remoteCustomer);
            navigate('/portal');
            return;
        }

        // User doesn't exist -> Redirect to Registration
        setPrefilledPhone(phone);
        navigate('/register');
    };

    const handleRegister = async (data: CustomerRegistration) => {
        const result = await customerService.registerCustomer(data);
        if (result.success && result.data) {
            setCustomer(result.data);
            saveSession(result.data);
            setSelectedOffer(getRandomOffer());
            navigate('/scratch');
        } else {
            console.error('Registration failed:', result.message);
        }
    };

    const handleUpdateProfile = async (updatedCustomer: Customer) => {
        const result = await customerService.registerCustomer({
            ...updatedCustomer,
            spType: 'U'
        });

        if (result.success && result.data) {
            // Re-fetch fresh data from backend to ensure synchronization
            const freshCustomer = await customerService.getCustomerByPhone(updatedCustomer.phone);
            if (freshCustomer) {
                setCustomer(freshCustomer);
                saveSession(freshCustomer);
            } else {
                // Fallback to update data if refresh fails
                setCustomer(result.data);
                saveSession(result.data);
            }

            setStep('profile'); // Force stay on profile
            setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setUpdateMessage(null), 3000);
        } else {
            console.error('Profile update failed:', result.message);
            setUpdateMessage({ type: 'error', text: result.message || 'Update failed' });
            setTimeout(() => setUpdateMessage(null), 3000);
        }
    };

    const handleScratchComplete = () => {
        const newOffer = {
            id: Math.random().toString(36).substr(2, 9),
            title: selectedOffer.title,
            code: selectedOffer.code,
            status: 'available',
            date: new Date().toLocaleDateString()
        };

        const updatedHistory = [newOffer, ...history];
        setHistory(updatedHistory);
        localStorage.setItem('asg_history', JSON.stringify(updatedHistory));

        setTimeout(() => {
            navigate('/result');
        }, 1000);
    };

    const logout = () => {
        localStorage.removeItem('asg_session');
        localStorage.removeItem('asg_history');
        setCustomer(null);
        setHistory([]);
        navigate('/login');
    };

    return (
        <CustomerLayout
            customer={customer}
            showProfileButton={step !== 'profile'}
            onProfileClick={() => setStep('profile')}
        >
            {updateMessage && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${updateMessage.type === 'success' ? 'bg-success/20 border-success/40 text-success' : 'bg-red-500/20 border-red-500/40 text-red-200'
                    }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${updateMessage.type === 'success' ? 'bg-success/20' : 'bg-red-500/20'}`}>
                        {updateMessage.type === 'success' ? '✓' : '✕'}
                    </div>
                    <p className="font-bold">{updateMessage.text}</p>
                </div>
            )}
            <AnimatePresence mode="wait">
                {step === 'register' && (
                    <motion.div
                        key="register"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="w-full max-w-md"
                    >
                        <RegistrationForm
                            onRegister={handleRegister}
                            initialPhone={prefilledPhone}
                        />
                    </motion.div>
                )}

                {step === 'login' && (
                    <motion.div
                        key="login"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="w-full max-w-md"
                    >
                        <UserLogin
                            onVerify={handleLogin}
                        />
                    </motion.div>
                )}

                {step === 'scratch' && (
                    <motion.div
                        key="scratch"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center gap-8"
                    >
                        <div className="text-center text-white">
                            <h2 className="text-3xl font-bold mb-2">Almost there, {customer?.name}!</h2>
                            <p className="text-slate-400">Scratch the card to reveal your prize</p>
                        </div>
                        <ScratchCard
                            onComplete={handleScratchComplete}
                            offerHtml={
                                <div className="text-center">
                                    <span className="text-sm uppercase text-accent font-bold tracking-widest block mb-2">
                                        You Won
                                    </span>
                                    <span className="text-4xl font-black text-slate-800">{selectedOffer?.title}</span>
                                </div>
                            }
                        />
                    </motion.div>
                )}

                {step === 'result' && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md"
                    >
                        <ResultView
                            offer={{
                                ...selectedOffer,
                                expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                            }}
                            onClose={() => navigate('/portal')}
                        />
                    </motion.div>
                )}

                {step === 'profile' && customer && (
                    <motion.div
                        key="profile"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-2xl"
                    >
                        <CustomerProfile
                            customer={{
                                ...customer,
                                offersCount: history.filter(h => h.status === 'redeemed').length
                            }}
                            history={history}
                            onClose={logout}
                            onUpdate={handleUpdateProfile}
                            onBackToScratch={() => {
                                setSelectedOffer(getRandomOffer());
                                navigate('/scratch');
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </CustomerLayout>
    );
};

export default CustomerPortal;
