import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';

interface ScratchCardProps {
    onComplete: () => void;
    offerHtml: React.ReactNode;
}

const ScratchCard: React.FC<ScratchCardProps> = ({ onComplete, offerHtml }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
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

        onComplete();
    };

    return (
        <div className="scratch-container w-[300px] h-[300px] rounded-2xl overflow-hidden shadow-2xl transition-all hover:scale-105">
            <div className="scratch-result bg-white w-full h-full flex items-center justify-center p-6 border-4 border-brand-orange/20">
                {offerHtml}
            </div>
            {!isRevealed && (
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
