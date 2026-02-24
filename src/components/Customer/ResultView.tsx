import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, Share2 } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import { handleShare } from '../../utils/shareUtils';

interface ResultViewProps {
    offer: {
        title: string;
        code: string;
        expiry: string;
    };
    onClose: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ offer, onClose }) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(offer.code);
        alert('Code copied to clipboard!');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-3xl w-full max-w-md text-center"
        >
            <div className="flex justify-center mb-6">
                <div className="bg-success/20 p-4 rounded-full">
                    <CheckCircle2 className="w-12 h-12 text-success" />
                </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Congratulations!</h2>
            <p className="text-slate-400 mb-8">You've unlocked an exclusive offer</p>

            <div className="bg-slate-900/80 border-2 border-dashed border-accent/40 rounded-2xl p-6 mb-8">
                <h3 className="text-3xl font-black text-accent mb-4 uppercase tracking-wider">
                    {offer.title}
                </h3>
                <div className="bg-black/40 rounded-xl p-4 flex items-center justify-between gap-4">
                    <code className="text-xl font-mono text-primary font-bold tracking-widest">
                        {offer.code}
                    </code>
                    <button
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <Copy className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
                <div className="mt-4 flex justify-center">
                    <CountdownTimer expiryDate={offer.expiry} />
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={onClose}
                    className="flex-1 bg-primary hover:bg-primaryDark text-white font-bold py-3 rounded-xl transition-all"
                >
                    Got it
                </button>
                <button
                    onClick={() => handleShare(offer)}
                    className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all"
                >
                    <Share2 className="w-5 h-5" />
                </button>
            </div>

            <p className="text-slate-500 text-sm mt-6">
                An SMS has also been sent to your mobile number with these details.
            </p>
        </motion.div>
    );
};

export default ResultView;
