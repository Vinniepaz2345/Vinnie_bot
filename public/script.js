async function fetchQRCode() {
    const response = await fetch('/api/qr');
    const data = await response.json();
    if (data.qr) {
        document.getElementById('qrImage').src = data.qr;
    }
}

fetchQRCode();
setInterval(fetchQRCode, 5000);  // Refresh QR code every 5 seconds
