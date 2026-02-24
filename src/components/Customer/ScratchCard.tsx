import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Loader2, AlertCircle } from 'lucide-react';
import { customerService } from '../../services/customerService';
import CountdownTimer from './CountdownTimer';

interface ScratchCardProps {
    onComplete: (offer: any) => void;
    customerId: number;
}

const ScratchCard: React.FC<ScratchCardProps> = ({ onComplete, customerId }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [offerData, setOfferData] = useState<any>(null);

    useEffect(() => {
        let isMounted = true;

        const generateOffer = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await customerService.generateScratchCard(customerId);
                if (isMounted) {
                    if (response.success && response.data) {
                        const data = response.data;
                        // If expiryDate is missing but generatedAt is present, calculate 2 hours from generatedAt
                        if (!data.expiryDate && data.generatedAt) {
                            const genTime = new Date(data.generatedAt).getTime();
                            data.expiryDate = new Date(genTime + (2 * 60 * 60 * 1000)).toISOString();
                        }
                        setOfferData(data);
                    } else {
                        setError(response.message || 'Failed to generate offer');
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setError('An unexpected error occurred');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        generateOffer();

        return () => { isMounted = false; };
    }, [customerId]);

    useEffect(() => {
        // Redraw canvas any time loading/error finishes
        if (isLoading || error) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Fill with overlay color
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add some "scratch here" text
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#475569';
        ctx.textAlign = 'center';
        ctx.fillText('SCRATCH HERE!', canvas.width / 2, canvas.height / 2);
    }, []);

    const getPos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();

        if ('touches' in e) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top,
            };
        }
        return {
            x: (e as MouseEvent).clientX - rect.left,
            y: (e as MouseEvent).clientY - rect.top,
        };
    };

    const scratch = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || isRevealed) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const pos = getPos(e);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2);
        ctx.fill();

        checkReveal();
    };

    const checkReveal = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;

        for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i + 3] === 0) {
                transparentPixels++;
            }
        }

        const percentage = (transparentPixels / (pixels.length / 4)) * 100;
        if (percentage > 50 && !isRevealed) {
            revealAll();
        }
    };

    const revealAll = () => {
        setIsRevealed(true);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });

        onComplete(offerData);
    };

    return (
        <div className="scratch-container w-[300px] h-[300px] rounded-2xl overflow-hidden shadow-2xl transition-all hover:scale-105 relative bg-white">

            {/* Background Content (The Offer) */}
            <div className="scratch-result w-full h-full flex flex-col items-center justify-center p-6 border-4 border-accent/20">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
                        <p className="text-slate-600 font-medium">Generating offer...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center space-y-3 text-amber-500">
                        <AlertCircle className="w-8 h-8" />
                        <p className="text-center font-medium">{error}</p>
                    </div>
                ) : offerData ? (
                    <div className="text-center space-y-4 w-full">
                        <div className="inline-block px-4 py-1.5 bg-brand-orange/10 text-brand-orange font-bold rounded-full text-sm uppercase tracking-wide border border-brand-orange/20">
                            {offerData.title}
                        </div>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed px-4">
                            {offerData.description}
                        </p>
                        <div className="pt-2">
                            <div className={`bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl py-3 px-6 mx-4 transition-all duration-500 ${!isRevealed ? 'blur-md select-none' : ''}`}>
                                <span className={`font-mono text-xl font-bold tracking-wider text-slate-800 transition-opacity duration-500 ${!isRevealed ? 'opacity-0' : 'opacity-100'}`}>
                                    {offerData.code}
                                </span>
                            </div>
                            {isRevealed && offerData.expiryDate && (
                                <div className="mt-2 flex justify-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <CountdownTimer expiryDate={offerData.expiryDate} className="text-brand-orange" />
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Scratch Canvas Overlay */}
            {!isRevealed && !isLoading && !error && (
                <canvas
                    ref={canvasRef}
                    width={300}
                    height={300}
                    className="scratch-canvas touch-none"
                    onMouseDown={() => setIsDrawing(true)}
                    onMouseUp={() => setIsDrawing(false)}
                    onMouseLeave={() => setIsDrawing(false)}
                    onMouseMove={scratch}
                    onTouchStart={() => setIsDrawing(true)}
                    onTouchEnd={() => setIsDrawing(false)}
                    onTouchMove={scratch}
                />
            )}
        </div>
    );
};

export default ScratchCard;
