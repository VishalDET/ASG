import React, { useState } from 'react';
import { Phone, ArrowRight, MessageSquare, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserLoginProps {
    onVerify: (phone: string) => Promise<void>;
}

export default function UserLogin({ onVerify }: UserLoginProps) {
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOTP = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!phone) {
            setError('Please enter your phone number');
            return;
        }
        if (!/^\d{10}$/.test(phone)) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        setIsLoading(true);
        // Simulate sending OTP
        setTimeout(() => {
            setIsLoading(false);
            setStep('otp');
        }, 1500);
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!otp) {
            setError('Please enter the OTP');
            return;
        }
        if (otp !== '123456') {
            setError('Invalid OTP. Use 123456 for testing.');
            setOtp('');
            return;
        }

        setIsLoading(true);
        try {
            // Wait for parent to check customer existence via API
            await onVerify(phone);
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/20 backdrop-blur-md pt-0 pb-8 px-8 rounded-3xl w-full max-w-md border border-white/30 shadow-2xl"
        >
            <div className="text-center mb-0 flex flex-col items-center mt-0 pt-0">
                <img src="/asg.png" alt="ASG Logo" className="h-44 mt-0" />
                <h2 className="text-2xl font-bold text-white mt-4">
                    {step === 'phone' ? 'Welcome Back!' : 'Verify OTP'}
                </h2>
                <p className="text-slate-300 my-2">
                    {step === 'phone'
                        ? 'Login with your phone number to see your profile.'
                        : `Enter the 6-digit code sent to +91 ${phone}`}
                </p>
            </div>

            <AnimatePresence mode="wait">
                {step === 'phone' ? (
                    <motion.form
                        key="phone-form"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onSubmit={handleSendOTP}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-white placeholder:text-slate-600"
                                    placeholder="9876543210"
                                    maxLength={10}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-accent hover:bg-accentDark text-[#5A3B00] font-bold py-4 rounded-xl flex items-center justify-center gap-2 group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-[#5A3B00]/30 border-t-[#5A3B00] rounded-full animate-spin" />
                            ) : (
                                <>
                                    Send OTP
                                    <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </>
                            )}
                        </button>
                    </motion.form>
                ) : (
                    <motion.form
                        key="otp-form"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onSubmit={handleVerifyOTP}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-slate-400">Verification Code</label>
                                <button
                                    type="button"
                                    onClick={() => setStep('phone')}
                                    className="text-xs text-accent hover:underline"
                                    disabled={isLoading}
                                >
                                    Change Number
                                </button>
                            </div>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-white font-mono tracking-[0.5em] text-center text-xl placeholder:tracking-normal placeholder:text-sm placeholder:text-slate-600"
                                    placeholder="••••••"
                                    maxLength={6}
                                    disabled={isLoading}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-accent hover:bg-accentDark text-[#5A3B00] font-bold py-4 rounded-xl flex items-center justify-center gap-2 group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-[#5A3B00]/30 border-t-[#5A3B00] rounded-full animate-spin" />
                            ) : (
                                <>
                                    Verify & Continue
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <p className="text-center text-xs text-slate-400">
                            Didn't receive code? <button type="button" className="text-accent hover:underline">Resend</button>
                        </p>
                    </motion.form>
                )}
            </AnimatePresence>


        </motion.div>
    );
}
