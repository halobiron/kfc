const PayOS = require('@payos/node');

const payos = new PayOS.PayOS({
    clientId: process.env.PAYOS_CLIENT_ID || 'YOUR_CLIENT_ID',
    apiKey: process.env.PAYOS_API_KEY || 'YOUR_API_KEY',
    checksumKey: process.env.PAYOS_CHECKSUM_KEY || 'YOUR_CHECKSUM_KEY'
});

module.exports = payos;