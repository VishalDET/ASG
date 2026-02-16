import React, { useState } from 'react';
import { User, Phone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface RegistrationFormProps {
    onRegister: (data: { name: string; phone: string }) => void;
}

export default function RegistrationForm({ onRegister }: RegistrationFormProps) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone) {
            setError('Please fill in all fields');
            return;
        }
        if (!/^\d{10}$/.test(phone)) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }
        setError('');
        onRegister({ name, phone });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 rounded-3xl w-full max-w-md"
        >
            <div className="text-center mb-8 flex flex-col items-center mt-0 pt-0">
                {/* <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">
                    Welcome to
                </h1> */}
                <img src="/asg.png" alt="ASG Logo" className="h-44 mt-0" />

                <p className="text-slate-400 mt-2">Enter your details to reveal your lucky scratch card!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all"
                            placeholder="John Doe"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all"
                            placeholder="9876543210"
                            maxLength={10}
                        />
                    </div>
                </div>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 group transition-all"
                >
                    Generate Scratch Card
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>
        </motion.div>
    );
}

