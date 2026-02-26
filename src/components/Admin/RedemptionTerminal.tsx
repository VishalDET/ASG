import React, { useState } from 'react';
import { QrCode, CheckCircle2, Loader2, ArrowRight, User, Gift, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { redemptionService, ValidationData } from '../../services/redemptionService';
import toast from 'react-hot-toast';

const RedemptionTerminal: React.FC = () => {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<'idle' | 'validating' | 'validated' | 'redeeming' | 'success' | 'error'>('idle');
    const [validationData, setValidationData] = useState<ValidationData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);

    const handleValidate = async () => {
        if (!code) return;
        setStatus('validating');
        setError(null);
        setValidationData(null);

        const response = await redemptionService.validateCoupon(code);

        if (response.data) {
            setValidationData(response.data);
            if (response.success && response.data.isValid) {
                setStatus('validated');
            } else {
                setError(response.message || 'Validation failed');
                setStatus('error');
            }
        } else {
            setError(response.message || 'Invalid or Expired Code');
            setStatus('error');
        }
    };

    const handleRedeem = async () => {
        if (!validationData || !code) return;

        setStatus('redeeming');
        setIsConfirming(false);

        const response = await redemptionService.redeemCoupon({
            code: code,
            customerId: validationData.customerId || 0,
            offerId: Number(validationData.offerId) || 0,
            spType: 'Admin' // Assuming default or could be dynamic
        });

        if (response.success) {
            setStatus('success');
            toast.success('Successfully redeemed!');
        } else {
            setError(response.message || 'Redemption failed');
            setStatus('error');
            toast.error(response.message || 'Redemption failed');
        }
    };

    const reset = () => {
        setCode('');
        setStatus('idle');
        setValidationData(null);
        setError(null);
        setIsConfirming(false);
    };

    return (
        <div className="p-8 h-full flex items-center justify-center">
            <div className="max-w-xl w-full">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Redemption Terminal</h1>
                    <p className="text-slate-400">Scan or enter the unique customer offer code to verify and redeem</p>
                </div>

                <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                    {/* Background Detail */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />

                    <AnimatePresence mode="wait">
                        {status === 'idle' || status === 'validating' || (status === 'error' && !validationData) ? (
                            <motion.div
                                key="input"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-10"
                            >
                                <div className="flex justify-center">
                                    <div className={`p-8 rounded-full bg-slate-800/50 border-2 transition-all duration-500 ${status === 'error' ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-slate-700 shadow-xl'}`}>
                                        <QrCode size={56} className={status === 'error' ? 'text-red-400' : 'text-primary/60'} />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            placeholder="ENTER OFFER CODE"
                                            className="w-full bg-slate-950/50 border-2 border-slate-800 rounded-2xl py-6 px-6 text-center text-3xl font-mono font-black tracking-[0.2em] text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-800 uppercase shadow-inner"
                                            disabled={status === 'validating'}
                                            autoFocus
                                        />
                                    </div>

                                    {status === 'error' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center justify-center gap-3 text-red-400 text-sm font-bold"
                                        >
                                            <AlertCircle size={18} /> {error}
                                        </motion.div>
                                    )}

                                    <button
                                        onClick={handleValidate}
                                        disabled={!code || status === 'validating'}
                                        className="w-full bg-primary hover:bg-primaryDark disabled:opacity-50 text-white font-black text-xl py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
                                    >
                                        {status === 'validating' ? (
                                            <>
                                                <Loader2 className="animate-spin" size={24} />
                                                VERIFYING...
                                            </>
                                        ) : (
                                            <>
                                                VERIFY CODE
                                                <ArrowRight size={24} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        ) : status === 'validated' || status === 'redeeming' || (status === 'error' && validationData) ? (
                            <motion.div
                                key="validation"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="text-center">
                                    {validationData?.isValid ? (
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 text-success text-[10px] font-black uppercase tracking-widest border border-success/20 mb-6">
                                            <CheckCircle2 size={14} /> Code Verified
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-widest border border-red-500/20 mb-6">
                                            <AlertCircle size={14} /> Verification Failed
                                        </div>
                                    )}
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">{validationData?.offerTitle}</h2>
                                    <p className="text-slate-400 text-sm font-medium mt-1">
                                        {validationData?.isValid ? 'Ready for redemption' : error}
                                    </p>
                                </div>

                                <div className="bg-black/30 rounded-3xl p-6 space-y-4 border border-slate-800/50 shadow-inner">
                                    <div className="flex justify-between items-center py-1">
                                        <div className="flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                            <User size={13} className="text-primary/50" /> Customer
                                        </div>
                                        <div className="text-right">
                                            <div className="text-white font-black tracking-tight">{validationData?.customerName}</div>
                                            {validationData?.customerNumber && (
                                                <div className="text-slate-500 text-[16px] font-bold">{validationData.customerNumber}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-full h-px bg-slate-800/50" />
                                    <div className="flex justify-between items-center py-1">
                                        <div className="flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                            <Gift size={16} className="text-accent/50" /> Status
                                        </div>
                                        <span className={`font-black tracking-tight uppercase ${validationData?.isValid ? 'text-accent' : 'text-red-500'}`}>
                                            {validationData?.status}
                                        </span>
                                    </div>
                                    <div className="w-full h-px bg-slate-800/50" />
                                    <div className="flex justify-between items-center py-1">
                                        <div className="flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                            <Clock size={16} className="text-info/50" /> Expires
                                        </div>
                                        <span className="text-slate-400 font-bold text-sm">
                                            {validationData?.expiryDate ? new Date(validationData.expiryDate).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {validationData?.isValid ? (
                                        !isConfirming ? (
                                            <div className="flex flex-col gap-4">
                                                <button
                                                    onClick={() => setIsConfirming(true)}
                                                    className="w-full bg-success hover:bg-success/90 text-white font-black text-xl py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-success/20 active:scale-[0.98]"
                                                >
                                                    REDEEM OFFER
                                                    <CheckCircle2 size={24} />
                                                </button>
                                                <button
                                                    onClick={reset}
                                                    className="w-full text-slate-500 hover:text-white font-bold py-2 text-sm uppercase tracking-widest transition-colors"
                                                >
                                                    Cancel & Back
                                                </button>
                                            </div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bg-primary/5 border border-primary/20 p-6 rounded-3xl text-center space-y-6"
                                            >
                                                <p className="text-white font-bold">Confirm redemption for <span className="text-primary">{validationData?.customerName}</span>?</p>
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => setIsConfirming(false)}
                                                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
                                                    >
                                                        NO
                                                    </button>
                                                    <button
                                                        onClick={handleRedeem}
                                                        disabled={status === 'redeeming'}
                                                        className="flex-1 bg-primary hover:bg-primaryDark text-white font-black py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.95]"
                                                    >
                                                        {status === 'redeeming' ? <Loader2 className="animate-spin" size={20} /> : 'YES, CONFIRM'}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )
                                    ) : (
                                        <button
                                            onClick={reset}
                                            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl border border-slate-700 active:scale-[0.98]"
                                        >
                                            BACK TO TERMINAL
                                        </button>
                                    )}
                                </div>
                            </motion.div>

                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center space-y-8 py-4"
                            >
                                <div className="flex justify-center">
                                    <div className="bg-success/20 p-8 rounded-full shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                                        <CheckCircle2 size={72} className="text-success" />
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Redeemed!</h2>
                                    <p className="text-success font-bold text-lg">Offer successfully applied</p>
                                </div>

                                <div className="bg-black/30 rounded-3xl p-8 text-left border border-slate-800/50 shadow-inner">
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500 text-xs font-black uppercase tracking-widest">Customer</span>
                                            <span className="text-white font-bold">{validationData?.customerName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500 text-xs font-black uppercase tracking-widest">Offer</span>
                                            <span className="text-accent font-black">{validationData?.offerTitle}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500 text-xs font-black uppercase tracking-widest">Time</span>
                                            <span className="text-slate-400 font-medium">{new Date().toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={reset}
                                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl border border-slate-700 active:scale-[0.98]"
                                >
                                    VERIFY ANOTHER CODE
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
