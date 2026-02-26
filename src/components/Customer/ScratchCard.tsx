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

    const [lastPos, setLastPos] = useState<{ x: number, y: number } | null>(null);
    const hasInitialized = useRef(false);

    useEffect(() => {
        let isMounted = true;

        const generateOffer = async () => {
            if (hasInitialized.current) return;
            hasInitialized.current = true;

            setIsLoading(true);
            setError(null);

            try {
                const response = await customerService.generateScratchCard(customerId);
                if (isMounted) {
                    if (response.success && response.data) {
                        const data = response.data;
                        if (!data.expiryDate && data.generatedAt) {
                            const genTime = new Date(data.generatedAt).getTime();
                            data.expiryDate = new Date(genTime + (2 * 60 * 60 * 1000)).toISOString();
                        }
                        setOfferData(data);
                    } else {
                        setError(response.message || 'Failed to generate offer');
                        hasInitialized.current = false;
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setError('An unexpected error occurred');
                    hasInitialized.current = false;
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
        if (isLoading || error) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Fill with overlay color - using a more premium gradient or solid gray
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add pattern/texture
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 10) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }

        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#475569';
        ctx.textAlign = 'center';
        ctx.fillText('SCRATCH HERE!', canvas.width / 2, canvas.height / 2);
    }, [isLoading, error]);

    const getPos = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();

        if ('touches' in e.nativeEvent) {
            const touch = (e as React.TouchEvent).touches[0];
            return {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top,
            };
        }
        return {
            x: (e as React.MouseEvent).clientX - rect.left,
            y: (e as React.MouseEvent).clientY - rect.top,
        };
    };

    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        setLastPos(getPos(e));
    };

    const handleEnd = () => {
        setIsDrawing(false);
        setLastPos(null);
    };

    const scratch = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || isRevealed) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const pos = getPos(e);

        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 40;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        if (lastPos) {
            ctx.moveTo(lastPos.x, lastPos.y);
        } else {
            ctx.moveTo(pos.x, pos.y);
        }
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        setLastPos(pos);
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

        if (offerData) {
            onComplete(offerData);
        }
    };

    return (
        <div className="scratch-container w-[320px] h-[320px] rounded-[2rem] overflow-hidden shadow-2xl transition-all hover:scale-[1.02] relative bg-white border-8 border-white/50 backdrop-blur-sm">

            {/* Background Content (The Offer) */}
            <div className={`scratch-result w-full h-full flex flex-col items-center justify-center p-8 transition-all duration-700 ${!isRevealed ? 'grayscale' : ''}`}>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <p className="text-slate-500 font-black text-xs uppercase tracking-widest">Generating Your Luck...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center space-y-3 text-red-500">
                        <AlertCircle className="w-10 h-10" />
                        <p className="text-center font-bold text-sm uppercase tracking-tight px-4">{error}</p>
                    </div>
                ) : offerData ? (
                    <div className="text-center space-y-6 w-full animate-in fade-in duration-1000">
                        {/* Hidden Title */}
                        <div className={`inline-block px-6 py-2 bg-primary/10 text-primary font-black rounded-full text-sm uppercase tracking-[0.15em] border border-primary/20 transition-all duration-700 ${!isRevealed ? 'blur-lg opacity-0 scale-90' : 'blur-0 opacity-100 scale-100'}`}>
                            {offerData.title}
                        </div>

                        {/* Hidden Description */}
                        <p className={`text-slate-500 text-xs font-bold leading-relaxed px-6 transition-all duration-1000 delay-100 ${!isRevealed ? 'blur-md opacity-0' : 'blur-0 opacity-100'}`}>
                            {offerData.description || 'CONGRATULATIONS! SHOW THIS CODE AT THE COUNTER TO CLAIM YOUR OFFER.'}
                        </p>

                        <div className="pt-2">
                            {/* Hidden Code */}
                            <div className={`bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl py-4 px-6 mx-4 transition-all duration-700 delay-200 ${!isRevealed ? 'blur-xl opacity-0' : 'blur-0 opacity-100'}`}>
                                <span className="font-mono text-2xl font-black tracking-[0.2em] text-slate-900">
                                    {offerData.code}
                                </span>
                            </div>

                            {isRevealed && offerData.expiryDate && (
                                <div className="mt-4 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-500">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valid For</span>
                                    <CountdownTimer expiryDate={offerData.expiryDate} className="text-primary font-black text-lg" />
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
                    width={320}
                    height={320}
                    className="scratch-canvas touch-none cursor-crosshair z-10"
                    onMouseDown={handleStart}
                    onMouseUp={handleEnd}
                    onMouseLeave={handleEnd}
                    onMouseMove={scratch}
                    onTouchStart={handleStart}
                    onTouchEnd={handleEnd}
                    onTouchMove={scratch}
                />
            )}
        </div>
    );
};

export default ScratchCard;
