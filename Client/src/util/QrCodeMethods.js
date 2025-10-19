export const handleShare = async (digitalCard, username, udc, setIsModalOpen) => {
    const canvas = document.getElementById('myqrcode')?.querySelector('canvas');
    if (canvas && navigator.canShare && window.File && navigator.share) {
        canvas.toBlob(async (blob) => {
            if (!blob) {
                fallbackShare(digitalCard, username, udc, setIsModalOpen);
                return;
            }
            const file = new File([blob], `${digitalCard.name}-QRCode-Qarty.png`, { type: blob.type });
            if (navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: digitalCard?.name ? `${digitalCard.name} | Qarty` : 'Qarty',
                        text: digitalCard?.info || '',
                        files: [file]
                    });
                    if (setIsModalOpen) setIsModalOpen(false);
                } catch (err) {
                    console.log(err);
                    if (setIsModalOpen) setIsModalOpen(false);
                }
            } else {
                fallbackShare(digitalCard, username, udc, setIsModalOpen);
            }
        });
    } else {
        fallbackShare(digitalCard, username, udc, setIsModalOpen);
    }
};

const fallbackShare = (digitalCard, username, udc, setIsModalOpen) => {
    if (navigator.share) {
        navigator.share({
            title: digitalCard?.name ? `${digitalCard.name} | Qarty` : 'Qarty',
            text: digitalCard?.info || '',
            url: `${import.meta.env.VITE_CLIENT_URL}/card?username=${username}&udc=${udc}`
        })
            .then(() => { if (setIsModalOpen) setIsModalOpen(false) })
            .catch(() => { if (setIsModalOpen) setIsModalOpen(false) });
    } else {
        navigator.clipboard.writeText(`${import.meta.env.VITE_CLIENT_URL}/card?username=${username}&udc=${udc}`);
        if (setIsModalOpen) setIsModalOpen(false);
        alert('Profile link copied to clipboard!');
    }
};

function doDownload(url, fileName, setIsModalOpen) {
    const a = document.createElement('a');
    a.download = fileName;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (setIsModalOpen) setIsModalOpen(false);
}

export const downloadCanvasQRCode = (name, setIsModalOpen) => {
    const canvas = document.getElementById('myqrcode')?.querySelector('canvas');
    if (canvas) {
        const url = canvas.toDataURL();
        doDownload(url, `${name}'s QRCode.png`, setIsModalOpen);
    }
};
