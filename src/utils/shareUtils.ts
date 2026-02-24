import toast from 'react-hot-toast';

interface ShareOfferData {
    title: string;
    code: string;
}

export const generateShareText = (offer: ShareOfferData) => {
    const appUrl = window.location.origin;
    return `Hey! I just won "${offer.title}" at ASG! 🎁\n\nUse my coupon code: ${offer.code} to avail this offer.\n\nCheck it out here: ${appUrl}/portal`;
};

export const handleShare = async (offer: ShareOfferData) => {
    const shareText = generateShareText(offer);
    const shareData = {
        title: 'ASG Offer',
        text: shareText,
        url: `${window.location.origin}/portal`
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(shareText);
            toast.success('Share text copied to clipboard!');
        }
    } catch (error) {
        if ((error as Error).name !== 'AbortError') {
            console.error('Share failed:', error);
            await navigator.clipboard.writeText(shareText);
            toast.success('Share text copied to clipboard!');
        }
    }
};
