import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
    expiryDate: string;
    onExpire?: () => void;
    className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ expiryDate, onExpire, className = "" }) => {
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const expiryTime = new Date(expiryDate).getTime();
            const now = new Date().getTime();

            if (isNaN(expiryTime)) {
                setTimeLeft("");
                return false;
            }

            const difference = expiryTime - now;

            if (difference <= 0) {
                setIsExpired(true);
                setTimeLeft("EXPIRED");
                if (onExpire) onExpire();
                return false;
            }

            const totalSeconds = Math.floor(difference / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            const formatted = [
                hours.toString().padStart(2, '0'),
                minutes.toString().padStart(2, '0'),
                seconds.toString().padStart(2, '0')
            ].join(':');

            setTimeLeft(formatted);
            return true;
        };

        calculateTimeLeft();
        const timer = setInterval(() => {
            const active = calculateTimeLeft();
            if (!active) clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, [expiryDate, onExpire]);

    if (!timeLeft && !isExpired) return null;

    return (
        <div className={`flex items-center gap-1.5 font-mono font-bold ${isExpired ? 'text-slate-500' : 'text-primary'} ${className}`}>
            <Clock size={14} className={!isExpired ? 'animate-pulse' : ''} />
            <span className="text-xs uppercase tracking-wider inline-block">
                {isExpired ? 'Offer Expired' : `Expires in: ${timeLeft}`}
            </span>
        </div>
    );
};

export default CountdownTimer;
