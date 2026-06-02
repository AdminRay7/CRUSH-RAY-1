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
const fs = require('fs');
const path = require('path');

// Create necessary directories
const sessionDir = './session';
const tempDir = './temp';
const dataDir = './data';

if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Create default data files if not exist
const dataFiles = {
    'owner.json': ['"254794376595@s.whatsapp.net"'],
    'messageCount.json': ['{"isPublic": true, "counts": {}, "totalMessages": 0}'],
    'banned.json': ['[]'],
    'warnings.json': ['{}'],
    'antidelete.json': ['{"enabled": false}'],
    'autoread.json': ['{"enabled": false}'],
    'autoStatus.json': ['{"enabled": false}'],
    'autotyping.json': ['{"enabled": false}'],
    'premium.json': ['[]'],
    'userGroupData.json': ['{}'],
    'pmblocker.json': ['{"enabled": false, "message": "Private messages are blocked."}'],
    'anticall.json': ['{"enabled": false}'],
    'store.json': ['{"messages": {}, "contacts": {}, "groups": {}}']
};

for (const [file, content] of Object.entries(dataFiles)) {
    const filePath = path.join(dataDir, file);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content[0]);
        console.log(`Created: ${filePath}`);
    }
}

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

let sock = null;
let isConnected = false;
let currentQR = null;
let currentPairingCode = null;

app.use(express.static('public'));
app.use(express.json());

// Simple home page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>CRUSH RAY BOT</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body { font-family: Arial; text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
                .container { max-width: 500px; margin: auto; background: white; border-radius: 20px; padding: 20px; color: black; }
                input { padding: 10px; width: 80%; margin: 10px; border-radius: 10px; border: 1px solid #ccc; }
                button { padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 10px; cursor: pointer; }
                .code { font-size: 32px; font-weight: bold; color: #ee5a24; margin: 10px; }
                .status { padding: 10px; border-radius: 10px; margin: 10px; }
                .online { background: #d4edda; color: #155724; }
                .offline { background: #f8d7da; color: #721c24; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>💖 CRUSH RAY BOT</h1>
                <p>WhatsApp Bot by PRESENTER RAY</p>
                <div id="status" class="status offline">🔴 Offline</div>
                <div id="pairSection">
                    <h3>🔐 Pairing Code</h3>
                    <input type="tel" id="phone" placeholder="254794376595" value="254794376595">
                    <button onclick="getPairingCode()">Get Pairing Code</button>
                    <div id="codeDisplay"></div>
                </div>
                <p style="margin-top: 20px; font-size: 12px;">📞 Number: 0794376595</p>
            </div>
            <script>
                const socket = io();
                socket.on('status', (data) => {
                    const statusDiv = document.getElementById('status');
                    if (data.connected) {
                        statusDiv.className = 'status online';
                        statusDiv.innerHTML = '🟢 Online - Bot Connected!';
                    } else {
                        statusDiv.className = 'status offline';
                        statusDiv.innerHTML = '🔴 Offline - Use pairing code';
                    }
                });
                socket.on('pair-code', (data) => {
                    if (data.success) {
                        document.getElementById('codeDisplay').innerHTML = '<div class="code">🔐 ' + data.code + '</div><p>Enter this code in WhatsApp Settings → Linked Devices → Link a Device → Link with phone number instead</p>';
                    } else {
                        document.getElementById('codeDisplay').innerHTML = '<p style="color:red;">Error: ' + data.error + '</p>';
                    }
                });
                function getPairingCode() {
                    const phone = document.getElementById('phone').value;
                    document.getElementById('codeDisplay').innerHTML = '<p>Requesting code...</p>';
                    socket.emit('request-pair', { phoneNumber: phone });
                }
            </script>
            <script src="/socket.io/socket.io.js"></script>
        </body>
        </html>
    `);
});

// API endpoints
app.get('/api/status', (req, res) => {
    res.json({ connected: isConnected, botName: 'CRUSH RAY', owner: 'PRESENTER RAY', number: '0794376595' });
});

// Request pairing code
async function requestPairingCode(phoneNumber) {
    try {
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
    } catch (error) {
        throw error;
    }
}

// Socket events
io.on('connection', (socket) => {
    console.log('Client connected');
    socket.emit('status', { connected: isConnected });
    
    socket.on('request-pair', async (data) => {
        try {
            const code = await requestPairingCode(data.phoneNumber);
            currentPairingCode = code;
            socket.emit('pair-code', { success: true, code: code });
            console.log(`✅ Pairing code generated for ${data.phoneNumber}: ${code}`);
        } catch (error) {
            console.error('Error:', error.message);
            socket.emit('pair-code', { success: false, error: error.message });
        }
    });
});

// Main bot function
async function startBot() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        
        sock = makeWASocket({
            logger: pino({ level: 'silent' }),
            printQRInTerminal: true,
            browser: ["CRUSH RAY", "Chrome", "1.0.0"],
            auth: state,
            markOnlineOnConnect: true,
        });
        
        sock.ev.on('creds.update', saveCreds);
        
        sock.ev.on('connection.update', async (update) => {
            const { qr, connection, lastDisconnect } = update;
            
            if (qr) {
                currentQR = await qrcode.toDataURL(qr);
                console.log('📱 QR Code generated (scan with WhatsApp)');
                io.emit('qr', currentQR);
            }
            
            if (connection === 'open') {
                isConnected = true;
                io.emit('status', { connected: true });
                console.log('✅ CRUSH RAY BOT CONNECTED!');
                console.log('💖 Bot is now online and ready!');
            }
            
            if (connection === 'close') {
                isConnected = false;
                io.emit('status', { connected: false });
                console.log('❌ Bot disconnected');
                
                if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                    console.log('🔄 Reconnecting in 10 seconds...');
                    setTimeout(startBot, 10000);
                }
            }
        });
        
        // Simple message handler
        sock.ev.on('messages.upsert', async (chatUpdate) => {
            try {
                const message = chatUpdate.messages[0];
                if (!message.message) return;
                
                const chatId = message.key.remoteJid;
                const text = message.message.conversation || 
                           message.message.extendedTextMessage?.text || '';
                
                if (text === '.menu') {
                    await sock.sendMessage(chatId, { 
                        text: `💖 *CRUSH RAY BOT* 💖\n\n📱 Commands:\n.menu - Show this menu\n.ping - Check response\n.alive - Bot status\n.owner - Contact owner\n\nMade with 💖 by PRESENTER RAY`
                    });
                }
                
                if (text === '.ping') {
                    await sock.sendMessage(chatId, { text: '🏓 Pong! CRUSH RAY is alive!' });
                }
                
                if (text === '.alive') {
                    await sock.sendMessage(chatId, { text: `💖 CRUSH RAY is alive! Time: ${new Date().toLocaleString()}` });
                }
                
                if (text === '.owner') {
                    await sock.sendMessage(chatId, { text: `👤 Owner: PRESENTER RAY\n📞 Number: 0794376595` });
                }
            } catch (err) {
                console.error('Message error:', err);
            }
        });
        
        // Anti-call
        sock.ev.on('call', async (calls) => {
            for (const call of calls) {
                const callerJid = call.from;
                if (callerJid) {
                    await sock.sendMessage(callerJid, { text: '📵 Calls not supported. Please text.' }).catch(() => {});
                }
            }
        });
        
    } catch (error) {
        console.error('Bot error:', error);
        setTimeout(startBot, 10000);
    }
}

// Start server
server.listen(PORT, () => {
    console.log(`\n╔════════════════════════════════════════╗`);
    console.log(`║    💖 CRUSH RAY BOT ON RENDER 💖      ║`);
    console.log(`╚════════════════════════════════════════╝`);
    console.log(`\n🌐 Web URL: https://crush-ray-1.onrender.com`);
    console.log(`📱 Go to the URL to get your pairing code!`);
    console.log(`👤 Owner: PRESENTER RAY`);
    console.log(`📞 Number: 0794376595\n`);
});

startBot();
