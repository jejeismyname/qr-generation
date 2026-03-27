const canvas = document.getElementById('qr-canvas');
const docLinkInput = document.getElementById('doc-link');
const logoInput = document.getElementById('logo-input');

function generateQR() {
    const originalLink = docLinkInput.value;
    
    // KUNCI UTAMA: QR tidak berisi link dokumen, tapi link ke file view.html
    // Kita selipkan link dokumen asli sebagai parameter 'target'
    const gatewayUrl = `view.html?target=${encodeURIComponent(originalLink)}`;

    const qr = new QRious({
        element: canvas,
        value: gatewayUrl,
        size: 250,
        level: 'H'
    });

    // Logika penempelan logo
    const ctx = canvas.getContext('2d');
    const file = logoInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const size = 50;
                const x = (canvas.width - size) / 2;
                const y = (canvas.height - size) / 2;
                ctx.fillStyle = "white";
                ctx.fillRect(x - 2, y - 2, size + 4, size + 4);
                ctx.drawImage(img, x, y, size, size);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function downloadQR(format) {
    const link = document.createElement('a');
    link.download = `qrcode.${format}`;
    if (format === 'png') {
        link.href = canvas.toDataURL();
    } else {
        const tmp = document.createElement('canvas');
        tmp.width = canvas.width; tmp.height = canvas.height;
        const tCtx = tmp.getContext('2d');
        tCtx.fillStyle = "white";
        tCtx.fillRect(0,0,tmp.width,tmp.height);
        tCtx.drawImage(canvas,0,0);
        link.href = tmp.toDataURL('image/jpeg');
    }
    link.click();
}

docLinkInput.addEventListener('input', generateQR);
logoInput.addEventListener('change', generateQR);
window.onload = generateQR;