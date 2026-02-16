import React, { useState } from 'react';
import { QrCode, Ticket, CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RedemptionTerminal: React.FC = () => {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<'idle' | 'validating' | 'success' | 'invalid'>('idle');
    const [result, setResult] = useState<any>(null);

    const handleRedeem = () => {
        if (!code) return;
        setStatus('validating');

        // Simulate API call
        setTimeout(() => {
            if (code.toUpperCase().includes('RESTO')) {
                setStatus('success');
                setResult({
                    customer: 'Rahul Sharma',
                    offer: '20% OFF',
                    expiry: '2026-02-28',
                    revealedAt: '2026-02-15 14:30'
                });
            } else {
                setStatus('invalid');
            }
        }, 1500);
    };

    const reset = () => {
        setCode('');
        setStatus('idle');
        setResult(null);
    };

    return (
        <div className="p-8 h-full flex items-center justify-center">
            <div className="max-w-xl w-full">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-white mb-2">Redemption Terminal</h1>
                    <p className="text-slate-400">Scan or enter the unique customer offer code</p>
                </div>

                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
                    <AnimatePresence mode="wait">
                        {status === 'idle' || status === 'validating' || status === 'invalid' ? (
                            <motion.div
                                key="input"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-8"
                            >
                                <div className="flex justify-center">
                                    <div className={`p-6 rounded-full bg-slate-800 border-2 ${status === 'invalid' ? 'border-red-500/50 animate-shake' : 'border-slate-700'}`}>
                                        <QrCode size={48} className={status === 'invalid' ? 'text-red-400' : 'text-slate-400'} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            placeholder="ENTER CODE (e.g. RESTO-ASG-10)"
                                            className="w-full bg-black/40 border-2 border-slate-800 rounded-2xl py-5 px-6 text-center text-2xl font-mono font-black tracking-widest text-white focus:outline-none focus:border-brand-orange transition-all placeholder:text-slate-700 uppercase"
                                            disabled={status === 'validating'}
                                        />
                                    </div>

                                    {status === 'invalid' && (
                                        <p className="text-red-400 text-sm font-medium text-center flex items-center justify-center gap-2">
                                            <XCircle size={16} /> Invalid or Expired Code. Please try again.
                                        </p>
                                    )}

                                    <button
                                        onClick={handleRedeem}
                                        disabled={!code || status === 'validating'}
                                        className="w-full bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-50 text-white font-black text-xl py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-brand-orange/20"
                                    >
                                        {status === 'validating' ? (
                                            <>
                                                <Loader2 className="animate-spin" size={24} />
                                                VERIFYING...
                                            </>
                                        ) : (
                                            <>
                                                REDEEM NOW
                                                <ArrowRight size={24} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center space-y-8"
                            >
                                <div className="flex justify-center">
                                    <div className="bg-brand-green/20 p-6 rounded-full">
                                        <CheckCircle2 size={64} className="text-brand-green" />
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">Code Verified!</h2>
                                    <p className="text-brand-green font-medium">Successfully marked as redeemed</p>
                                </div>

                                <div className="bg-black/40 rounded-2xl p-6 text-left border border-slate-800">
                                    <div className="grid grid-cols-2 gap-y-4">
                                        <span className="text-slate-500 text-sm uppercase tracking-wider font-bold">Customer</span>
                                        <span className="text-white font-medium text-right">{result?.customer}</span>
                                        <span className="text-slate-500 text-sm uppercase tracking-wider font-bold">Offer</span>
                                        <span className="text-brand-orange font-black text-right">{result?.offer}</span>
                                        <span className="text-slate-500 text-sm uppercase tracking-wider font-bold">Revealed on</span>
                                        <span className="text-slate-400 text-sm text-right">{result?.revealedAt}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={reset}
                                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all"
                                >
                                    Verify Another Code
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default RedemptionTerminal;
