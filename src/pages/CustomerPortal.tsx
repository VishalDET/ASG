import React, { useState, useEffect } from 'react';
import RegistrationForm from '../components/Customer/RegistrationForm';
import ScratchCard from '../components/Customer/ScratchCard';
import ResultView from '../components/Customer/ResultView';
import CustomerProfile from '../components/Customer/CustomerProfile';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';

const OFFERS = [
    { title: '10% OFF', code: 'RESTO-ASG-10', weight: 50 },
    { title: '20% OFF', code: 'RESTO-ASG-20', weight: 30 },
    { title: 'Free Dessert', code: 'RESTO-SWEET', weight: 15 },
    { title: '50% OFF', code: 'RESTO-BINGO', weight: 5 },
];

const getRandomOffer = () => {
    const totalWeight = OFFERS.reduce((acc, offer) => acc + offer.weight, 0);
    let random = Math.random() * totalWeight;
    for (const offer of OFFERS) {
        if (random < offer.weight) return offer;
        random -= offer.weight;
    }
    return OFFERS[0];
};

const CustomerPortal: React.FC = () => {
    const [step, setStep] = useState<'register' | 'scratch' | 'result' | 'profile'>('register');
    const [customer, setCustomer] = useState<{ name: string; phone: string; visits: number } | null>(null);
    const [selectedOffer, setSelectedOffer] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);

    // Load mock data from localStorage to simulate persistence
    useEffect(() => {
        const savedCustomer = localStorage.getItem('asg_customer');
        const savedHistory = localStorage.getItem('asg_history');

        if (savedCustomer) {
            setCustomer(JSON.parse(savedCustomer));
            setStep('profile');
        }
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    const handleRegister = (data: { name: string; phone: string }) => {
        const newCustomer = { ...data, visits: 1 };
        setCustomer(newCustomer);
        localStorage.setItem('asg_customer', JSON.stringify(newCustomer));
        setSelectedOffer(getRandomOffer());
        setStep('scratch');
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
            setStep('result');
        }, 1000);
    };

    const logout = () => {
        localStorage.removeItem('asg_customer');
        localStorage.removeItem('asg_history');
        setCustomer(null);
        setHistory([]);
        setStep('register');
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
            {/* Profile Button (Floating) */}
            {customer && step !== 'profile' && (
                <button
                    onClick={() => setStep('profile')}
                    className="fixed top-6 right-6 bg-slate-800/80 backdrop-blur-md border border-slate-700 p-3 rounded-full text-brand-blue hover:text-white hover:bg-brand-blue transition-all z-50 shadow-xl"
                >
                    <User size={24} />
                </button>
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
                        <RegistrationForm onRegister={handleRegister} />
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
                                    <span className="text-sm uppercase text-brand-orange font-bold tracking-widest block mb-2">
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
                            onClose={() => setStep('profile')}
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
                                name: customer.name,
                                phone: customer.phone,
                                visits: customer.visits,
                                offersCount: history.filter(h => h.status === 'redeemed').length
                            }}
                            history={history}
                            onClose={logout}
                            onBackToScratch={() => {
                                setSelectedOffer(getRandomOffer());
                                setStep('scratch');
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <footer className="mt-12 text-slate-500 text-xs">
                Powered by ASG Loyalty System • &copy; 2026
            </footer>
        </div>
    );
};

export default CustomerPortal;
