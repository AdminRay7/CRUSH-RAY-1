/**
 * CRUSH RAY BOT - WhatsApp Bot for Render.com
 * Owner: PRESENTER RAY
 * Number: 0794376595
 */

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const qrcode = require('qrcode');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs-extra');
const path = require('path');

// Import main message handler
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

// Create necessary directories
const sessionDir = './session';
const tempDir = './temp';
fs.ensureDirSync(sessionDir);
fs.ensureDirSync(tempDir);

// Store bot connection state
let sock = null;
let pairingCode = null;
let qrCodeData = null;
let isConnected = false;
let currentPhoneNumber = "254794376595";

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// Main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API to get pairing status
app.get('/api/status', (req, res) => {
    res.json({
        connected: isConnected,
        pairingCode: pairingCode,
        qrCode: qrCodeData,
        botName: 'CRUSH RAY',
        owner: 'PRESENTER RAY',
        number: '0794376595',
        channel: 'https://whatsapp.com/channel/0029VbCne5677qVRVvdVAn1b'
    });
});

// API to request new pairing code
app.post('/api/pair', async (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
        return res.json({ success: false, error: 'Phone number required' });
    }
    
    try {
        const code = await requestPairingCode(phoneNumber);
        pairingCode = code;
        res.json({ success: true, code: code });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// API to update phone number
app.post('/api/update-number', (req, res) => {
    const { phoneNumber } = req.body;
    if (phoneNumber) {
        currentPhoneNumber = phoneNumber;
        res.json({ success: true, number: currentPhoneNumber });
    } else {
        res.json({ success: false, error: 'No number provided' });
    }
});

// Function to request pairing code
async function requestPairingCode(phoneNumber) {
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    
    const tempSock = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ["CRUSH RAY", "Chrome", "1.0.0"],
        auth: state
    });
    
    tempSock.ev.on('creds.update', saveCreds);
    
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const code = await tempSock.requestPairingCode(phoneNumber);
                const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;
                resolve(formattedCode);
                setTimeout(() => {
                    if (tempSock.ws) tempSock.ws.close();
                }, 1000);
            } catch (error) {
                reject(error);
            }
        }, 2000);
    });
}

// Main bot function
async function startBot() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        
        sock = makeWASocket({
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            browser: ["CRUSH RAY", "Chrome", "1.0.0"],
            auth: state,
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            connectTimeoutMs: 60000,
            defaultQueryTimeoutMs: 60000,
            keepAliveIntervalMs: 10000,
        });
        
        sock.ev.on('creds.update', saveCreds);
        
        // Handle QR Code
        sock.ev.on('connection.update', async (update) => {
            const { qr, connection, lastDisconnect } = update;
            
            if (qr) {
                qrCodeData = await qrcode.toDataURL(qr);
                io.emit('qr', qrCodeData);
                console.log('📱 QR Code generated');
            }
            
            if (connection === 'open') {
                isConnected = true;
                io.emit('connected', { 
                    message: 'CRUSH RAY Bot connected successfully!',
                    botName: 'CRUSH RAY',
                    owner: 'PRESENTER RAY',
                    number: '0794376595',
                    channel: 'https://whatsapp.com/channel/0029VbCne5677qVRVvdVAn1b'
                });
                console.log('✅ CRUSH RAY Bot connected successfully!');
            }
            
            if (connection === 'close') {
                isConnected = false;
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                io.emit('disconnected', { message: 'Bot disconnected' });
                
                if (statusCode !== DisconnectReason.loggedOut) {
                    console.log('🔄 Reconnecting in 10 seconds...');
                    setTimeout(startBot, 10000);
                } else {
                    console.log('🔐 Session logged out. Please restart the bot.');
                }
            }
        });
        
        // Handle incoming messages
        sock.ev.on('messages.upsert', async (chatUpdate) => {
            try {
                await handleMessages(sock, chatUpdate, true);
            } catch (err) {
                console.error('Error in messages.upsert:', err);
            }
        });
        
        // Handle group participants update
        sock.ev.on('group-participants.update', async (update) => {
            await handleGroupParticipantUpdate(sock, update);
        });
        
        // Handle status updates
        sock.ev.on('status.update', async (status) => {
            await handleStatus(sock, status);
        });
        
        // Anti-call handler
        sock.ev.on('call', async (calls) => {
            for (const call of calls) {
                const callerJid = call.from || call.peerJid;
                if (callerJid) {
                    await sock.sendMessage(callerJid, { 
                        text: '📵 *CRUSH RAY*: Calls are not supported. Please text only.' 
                    }).catch(() => {});
                }
            }
        });
        
    } catch (error) {
        console.error('Error starting bot:', error);
        setTimeout(startBot, 10000);
    }
}

// Socket.io connection
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('get-status', () => {
        socket.emit('status', {
            connected: isConnected,
            pairingCode: pairingCode,
            qrCode: qrCodeData,
            botName: 'CRUSH RAY',
            owner: 'PRESENTER RAY',
            number: '0794376595',
            channel: 'https://whatsapp.com/channel/0029VbCne5677qVRVvdVAn1b'
        });
    });
    
    socket.on('request-pair', async (data) => {
        try {
            const code = await requestPairingCode(data.phoneNumber);
            pairingCode = code;
            socket.emit('pair-code', { code: code, success: true });
        } catch (error) {
            socket.emit('pair-code', { error: error.message, success: false });
        }
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start server and bot
server.listen(PORT, () => {
    console.log(`\n╔════════════════════════════════════════╗`);
    console.log(`║    💖 CRUSH RAY BOT ON RENDER 💖      ║`);
    console.log(`╚════════════════════════════════════════╝`);
    console.log(`\n🌐 Web Interface: http://localhost:${PORT}`);
    console.log(`📱 Pairing Code Available at Web Interface`);
    console.log(`👤 Owner: PRESENTER RAY`);
    console.log(`📞 Number: 0794376595\n`);
});

startBot();