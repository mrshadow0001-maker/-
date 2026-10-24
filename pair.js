const { delay } = require('@whiskeysockets/baileys');

/**
 * Requests a WhatsApp pairing code from the active, unregistered Baileys socket.
 * The caller should pass the number in international format, digits only.
 */
async function requestPairingCode(sock, rawNumber) {
    if (!sock || typeof sock.requestPairingCode !== 'function') {
        throw new Error('WhatsApp socket is not ready. Wait a few seconds and try again.');
    }

    const number = String(rawNumber || '').replace(/\D/g, '');
    if (!/^\d{8,15}$/.test(number)) {
        throw new Error('Invalid phone number. Include country code and digits only.');
    }

    // Let the websocket initialize before asking Baileys for a pairing code.
    await delay(1000);
    const code = await sock.requestPairingCode(number);
    if (!code || typeof code !== 'string') {
        throw new Error('WhatsApp did not return a pairing code. Check the terminal logs and try again.');
    }

    // Display in short groups to make typing easier.
    return code.match(/.{1,4}/g).join('-');
}

module.exports = { requestPairingCode };
