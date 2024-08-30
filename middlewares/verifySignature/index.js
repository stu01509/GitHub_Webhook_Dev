const crypto = require('node:crypto');

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

// https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries#javascript-example
const verifySignature = async (req, res, next) => {
    const header = req.headers["x-hub-signature-256"];
    const payload = JSON.stringify(req.body);

    const algorithm = { name: 'HMAC', hash: { name: 'SHA-256' } };
    const encoder = new TextEncoder();
    const parts = header.split('=');
    const sigHex = parts[1];
    const keyBytes = encoder.encode(WEBHOOK_SECRET);
    const isExtractable = false;

    const key = await crypto.subtle.importKey(
        'raw',
        keyBytes,
        algorithm,
        isExtractable,
        ['sign', 'verify'],
    );

    const sigBytes = hexToBytes(sigHex);
    const dataBytes = encoder.encode(payload);
    const isEqual = await crypto.subtle.verify(
        algorithm.name,
        key,
        sigBytes,
        dataBytes,
    );

    if (isEqual) {
        return next();
    }
    return res.status(401).send('Unauthorized');
}

const hexToBytes = (hex) => {
    const len = hex.length / 2;
    const bytes = new Uint8Array(len);

    let index = 0;
    for (let i = 0; i < hex.length; i += 2) {
        const c = hex.slice(i, i + 2);
        const b = parseInt(c, 16);
        bytes[index] = b;
        index += 1;
    }

    return bytes;
}

module.exports = verifySignature;
