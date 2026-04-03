import React, { useState } from 'react';
import { User, Phone, Mail, Calendar, ArrowRight, Wine } from 'lucide-react';
import { motion } from 'framer-motion';
import { CustomerRegistration } from '../../types/customer';
import { calculateAge } from '../../utils/dateUtils';

interface RegistrationFormProps {
    onRegister: (data: CustomerRegistration) => void;
    initialPhone?: string;
}

const ALCOHOL_OPTIONS = [
    'Wine',
    'Beer',
    'Whiskey',
    'Rum',
    'Vodka',
    'Gin',
    'Cocktails',
];

const FOOD_OPTIONS = [
    'Veg',
    'Non-Veg',
    'Vegan',
    'Eggetarian'
];

export default function RegistrationForm({ onRegister, initialPhone = '' }: RegistrationFormProps) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState(initialPhone);
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
    const [dob, setDob] = useState('');
    const [foodPreference, setFoodPreference] = useState<string[]>(['Veg']);
    const [alcoholPreference, setAlcoholPreference] = useState<string[]>([]);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone || !email || !dob) {
            setError('Please fill in all required fields');
            return;
        }
        if (!/^\d{10}$/.test(phone)) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }
        setError('');
        onRegister({
            name,
            phone,
            email,
            gender,
            dob,
            foodPreference,
            alcoholPreference: calculateAge(dob) >= 21 ? alcoholPreference : [],
            spType: 'C'
        });
    };

    const inputClass = "w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-white placeholder:text-slate-500";
    const selectClass = "w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-white appearance-none cursor-pointer";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-y-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
            <div className="text-center mb-6 flex flex-col items-center mt-0 pt-0">
                <img src="/asg.png" alt="ASG Logo" className="h-36 mt-0" />
                <p className="text-slate-400 mt-2 text-sm">Enter your details to reveal your lucky scratch card!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Name <span className="text-primary">*</span></label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={inputClass}
                            placeholder="John Doe"
                        />
                    </div>
                </div>

                {/* Gender & DOB side by side */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gender <span className="text-primary">*</span></label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                                className={selectClass}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Date of Birth <span className="text-primary">*</span></label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                type="date"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className={`${inputClass} [color-scheme:dark]`}
                            />
                        </div>
                    </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone <span className="text-primary">*</span></label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => !initialPhone && setPhone(e.target.value)}
                            className={`${inputClass} ${initialPhone ? 'bg-slate-800/30 text-slate-400 cursor-not-allowed' : ''}`}
                            placeholder="9876543210"
                            maxLength={10}
                            readOnly={!!initialPhone}
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email <span className="text-primary">*</span></label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClass}
                            placeholder="john@example.com"
                        />
                    </div>
                </div>

                {/* Food Preference (Multi-Select) */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Food Preferences (Multi-Select)</label>
                    <div className="flex flex-wrap gap-2">
                        {FOOD_OPTIONS.map((opt) => {
                            const isSelected = foodPreference.includes(opt);
                            return (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => {
                                        setFoodPreference(prev =>
                                            prev.includes(opt)
                                                ? prev.filter(i => i !== opt)
                                                : [...prev, opt]
                                        );
                                    }}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isSelected
                                            ? 'bg-success/20 border-success/40 text-success shadow-lg shadow-success/10'
                                            : 'bg-slate-900/50 border-slate-700 text-slate-500 hover:border-slate-600'
                                        }`}
                                >
                                    {opt === 'Veg' ? '🥬 ' : opt === 'Non-Veg' ? '🍖 ' : opt === 'Vegan' ? '🥗 ' : '🥚 '}{opt}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Alcohol Preference (Multi-Select) - Only for Age >= 21 */}
                {calculateAge(dob) >= 21 ? (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2"
                    >
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Alcohol Preferences (Multi-Select)</label>
                        <div className="flex flex-wrap gap-2">
                            {ALCOHOL_OPTIONS.map((opt) => {
                                const isSelected = alcoholPreference.includes(opt);
                                return (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => {
                                            setAlcoholPreference(prev =>
                                                prev.includes(opt)
                                                    ? prev.filter(i => i !== opt)
                                                    : [...prev, opt]
                                            );
                                        }}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isSelected
                                                ? 'bg-accent/20 border-accent/40 text-accent shadow-lg shadow-accent/10'
                                                : 'bg-slate-900/50 border-slate-700 text-slate-500 hover:border-slate-600'
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : dob && (
                    <div className="bg-slate-900/30 border border-slate-800/50 p-3 rounded-xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                            <Wine size={16} />
                        </div>
                        <p className="text-xs text-slate-500 italic">Alcohol options are restricted for users under 21 (Current age: {calculateAge(dob)})</p>
                    </div>
                )}

                {error && <p className="text-amber-400 text-sm text-center">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primaryDark text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 group transition-all shadow-lg shadow-primary/20 mt-2"
                >
                    Register
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>
        </motion.div>
    );
}
