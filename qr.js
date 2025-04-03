const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode');
const express = require('express');
const router = express.Router();
const { getSessionCollection } = require('./database');

let sock;

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('sessions');
    sock = makeWASocket({ auth: state });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { qr, connection } = update;
        if (qr) {
            console.log('New QR Code Generated');
            latestQR = await qrcode.toDataURL(qr);
        }
        if (connection === 'open') {
            console.log('✅ WhatsApp Bot Connected');
            // Save session to MongoDB
            const sessionCollection = await getSessionCollection();
            await sessionCollection.updateOne(
                { id: sock.user.id },
                { $set: { creds: state } },
                { upsert: true }
            );

            // Send session ID to user
            await sock.sendMessage(sock.user.id, {
                text: `Your session ID: ${sock.user.id}`
            });
        }
    });
}

let latestQR = null;
router.get('/qr', (req, res) => {
    res.json({ qr: latestQR });
});

startBot();
module.exports = router;
