/**
 * CRUSH RAY BOT - WhatsApp Bot for Render.com
 * Using Original Knightbot Pairing Code Logic
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
const PhoneNumber = require('awesome-phonenumber');
const readline = require('readline');

// Create necessary directories
const sessionDir = './session';
const tempDir = './temp';
const dataDir = './data';

if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Create default data files if not exist
const dataFiles = {
    'owner.json': '["254794376595@s.whatsapp.net"]',
    'messageCount.json': '{"isPublic": true, "counts": {}, "totalMessages": 0}',
    'banned.json': '[]',
    'warnings.json': '{}',
    'antidelete.json': '{"enabled": false}',
    'autoread.json': '{"enabled": false}',
    'autoStatus.json': '{"enabled": false}',
    'autotyping.json': '{"enabled": false}',
    'premium.json': '[]',
    'userGroupData.json': '{}',
    'pmblocker.json': '{"enabled": false, "message": "Private messages are blocked."}',
    'anticall.json': '{"enabled": false}',
    'store.json': '{"messages": {}, "contacts": {}, "groups": {}}'
};

for (const [file, content] of Object.entries(dataFiles)) {
    const filePath = path.join(dataDir, file);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
        console.log(`Created: ${filePath}`);
    }
}

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

let sock = null;
let isConnected = false;
let currentPairingCode = null;

// Store for messages
const store = {
    messages: new Map(),
    contacts: new Map(),
    groups: new Map()
};

app.use(express.static('public'));
app.use(express.json());

// Web page with pairing code
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>CRUSH RAY BOT</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body { font-family: Arial; text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
                .container { max-width: 500px; margin: auto; background: white; border-radius: 20px; padding: 20px; }
                input, button { padding: 10px; margin: 10px; border-radius: 10px; border: 1px solid #ccc; }
                button { background: #28a745; color: white; border: none; cursor: pointer; }
                .code { font-size: 32px; font-weight: bold; color: #ee5a24; margin: 10px; font-family: monospace; letter-spacing: 5px; }
                .status { padding: 10px; border-radius: 10px; margin: 10px; }
                .online { background: #d4edda; color: #155724; }
                .offline { background: #f8d7da; color: #721c24; }
                .instructions { text-align: left; background: #f8f9fa; padding: 15px; border-radius: 10px; margin-top: 15px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>💖 CRUSH RAY BOT</h1>
                <p>WhatsApp Bot by PRESENTER RAY</p>
                <p>📞 Number: 0794376595</p>
                
                <div id="statusDiv" class="status offline">🔴 Bot Offline - Waiting for Connection</div>
                
                <div id="pairSection">
                    <h3>🔐 Pairing Code Method</h3>
                    <input type="tel" id="phone" placeholder="254794376595" value="254794376595">
                    <button onclick="getPairingCode()">Get Pairing Code</button>
                    <div id="codeDisplay"></div>
                </div>
                
                <div class="instructions">
                    <strong>📖 Instructions:</strong>
                    <ol>
                        <li>Enter your WhatsApp number (254794376595)</li>
                        <li>Click "Get Pairing Code"</li>
                        <li>Open WhatsApp on your phone</li>
                        <li>Go to <strong>Settings → Linked Devices → Link a Device</strong></li>
                        <li>Tap <strong>"Link with phone number instead"</strong></li>
                        <li>Enter the 8-character code shown above</li>
                        <li>Wait 5-10 seconds for connection</li>
                    </ol>
                    <p style="color: #666; font-size: 12px;">⚠️ No push notification will be sent. You must enter the code manually.</p>
                </div>
            </div>
            
            <script src="/socket.io/socket.io.js"></script>
            <script>
                const socket = io();
                
                socket.on('status', (data) => {
                    const statusDiv = document.getElementById('statusDiv');
                    if (data.connected) {
                        statusDiv.className = 'status online';
                        statusDiv.innerHTML = '🟢 Bot Online - Connected to WhatsApp!';
                        document.getElementById('pairSection').style.display = 'none';
                    } else {
                        statusDiv.className = 'status offline';
                        statusDiv.innerHTML = '🔴 Bot Offline - Use pairing code to connect';
                    }
                });
                
                socket.on('pair-code', (data) => {
                    if (data.success) {
                        document.getElementById('codeDisplay').innerHTML = '<div class="code">🔐 ' + data.code + '</div><p style="color:green;">✅ Code generated! Enter this code in WhatsApp.</p>';
                    } else {
                        document.getElementById('codeDisplay').innerHTML = '<p style="color:red;">❌ Error: ' + data.error + '</p>';
                    }
                });
                
                socket.on('connected', (data) => {
                    document.getElementById('statusDiv').className = 'status online';
                    document.getElementById('statusDiv').innerHTML = '🟢 ' + data.message;
                    document.getElementById('pairSection').style.display = 'none';
                });
                
                function getPairingCode() {
                    const phone = document.getElementById('phone').value;
                    if (!phone) {
                        alert('Please enter your phone number');
                        return;
                    }
                    document.getElementById('codeDisplay').innerHTML = '<p>⏳ Requesting pairing code from WhatsApp...</p>';
                    socket.emit('request-pair', { phoneNumber: phone });
                }
            </script>
        </body>
        </html>
    `);
});

// API endpoints
app.get('/api/status', (req, res) => {
    res.json({ connected: isConnected, botName: 'CRUSH RAY', owner: 'PRESENTER RAY', number: '0794376595' });
});

// ========== ORIGINAL PAIRING CODE FUNCTION FROM KNIGHTBOT ==========
async function requestPairingCode(phoneNumber) {
    try {
        // Clean the phone number
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        
        // Validate using awesome-phonenumber (same as Knightbot)
        const pn = PhoneNumber;
        if (!pn('+' + phoneNumber).isValid()) {
            throw new Error('Invalid phone number format');
        }
        
        console.log(`📱 Requesting pairing code for: +${phoneNumber}`);
        
        // Create temporary connection (same as Knightbot method)
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        
        const tempSock = makeWASocket({
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            browser: ["CRUSH RAY", "Chrome", "1.0.0"],
            auth: state,
            defaultQueryTimeoutMs: 60000,
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 10000,
        });
        
        tempSock.ev.on('creds.update', saveCreds);
        
        // Wait for connection to establish (mimicking Knightbot's setTimeout pattern)
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Request pairing code (same as original Knightbot)
        const code = await tempSock.requestPairingCode(phoneNumber);
        
        // Format code with dashes every 4 characters (same as Knightbot)
        const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;
        
        // Close temporary connection
        setTimeout(() => {
            if (tempSock.ws) tempSock.ws.close();
        }, 1000);
        
        return formattedCode;
        
    } catch (error) {
        console.error('Error requesting pairing code:', error);
        throw error;
    }
}

// Socket events
io.on('connection', (socket) => {
    console.log('Client connected to web interface');
    socket.emit('status', { connected: isConnected });
    
    socket.on('request-pair', async (data) => {
        try {
            console.log(`🔐 Generating pairing code for ${data.phoneNumber}...`);
            const code = await requestPairingCode(data.phoneNumber);
            currentPairingCode = code;
            socket.emit('pair-code', { success: true, code: code });
            console.log(`✅ Pairing code generated: ${code}`);
        } catch (error) {
            console.error(`❌ Failed to generate pairing code:`, error.message);
            socket.emit('pair-code', { success: false, error: error.message });
        }
    });
});

// ========== MAIN BOT FUNCTION (Using Original Knightbot Logic) ==========
async function startBot() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        
        sock = makeWASocket({
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,  // Disable QR - use pairing only
            browser: ["CRUSH RAY", "Chrome", "1.0.0"],
            auth: state,
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            syncFullHistory: false,
            defaultQueryTimeoutMs: 60000,
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 10000,
        });
        
        sock.ev.on('creds.update', saveCreds);
        
        // Handle connection updates (Same as Knightbot)
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            
            if (connection === 'connecting') {
                console.log('🔄 Connecting to WhatsApp...');
            }
            
            if (connection === 'open') {
                isConnected = true;
                io.emit('status', { connected: true });
                io.emit('connected', { message: 'CRUSH RAY Bot connected successfully!' });
                
                console.log('\n╔════════════════════════════════════════════╗');
                console.log('║        💖 CRUSH RAY BOT ACTIVE 💖          ║');
                console.log('╚════════════════════════════════════════════╝\n');
                console.log('✅ Bot Connected Successfully!\n');
                console.log(`🤖 Bot Name: CRUSH RAY`);
                console.log(`👤 Owner: PRESENTER RAY`);
                console.log(`📞 Number: 0794376595`);
                console.log(`📢 Channel: https://whatsapp.com/channel/0029VbCne5677qVRVvdVAn1b\n`);
                
                // Send welcome message to owner
                const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
                await sock.sendMessage(botNumber, {
                    text: `💖 *CRUSH RAY BOT ACTIVATED* 💖\n\n✅ Status: Online & Ready!\n👤 Owner: PRESENTER RAY\n📞 Number: 0794376595\n🔧 Type .menu for commands\n\nMade with 💖 by RAY`
                }).catch(() => {});
            }
            
            if (connection === 'close') {
                isConnected = false;
                io.emit('status', { connected: false });
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                
                console.log('❌ Connection closed');
                
                if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
                    console.log('Session logged out. Please restart the bot.');
                } else {
                    console.log('🔄 Reconnecting in 5 seconds...');
                    setTimeout(startBot, 5000);
                }
            }
        });
        
        // Message handling (Same as Knightbot simple handler)
        sock.ev.on('messages.upsert', async (chatUpdate) => {
            try {
                const message = chatUpdate.messages[0];
                if (!message.message) return;
                
                const chatId = message.key.remoteJid;
                const senderId = message.key.participant || message.key.remoteJid;
                const isGroup = chatId.endsWith('@g.us');
                
                const userMessage = (
                    message.message?.conversation?.trim() ||
                    message.message?.extendedTextMessage?.text?.trim() ||
                    ''
                ).toLowerCase();
                
                // Greeting in private chat
                if (!isGroup && (userMessage === 'hi' || userMessage === 'hello' || userMessage === 'crush' || userMessage === 'ray')) {
                    await sock.sendMessage(chatId, {
                        text: `💖 *CRUSH RAY BOT* 💖\n\nHi! I'm CRUSH RAY, your WhatsApp assistant.\n👤 Owner: PRESENTER RAY\n📞 Number: 0794376595\n🔧 Type *.menu* to see all commands!\n\nMade with 💖 by RAY`
                    });
                    return;
                }
                
                // Menu command
                if (userMessage === '.menu' || userMessage === '.help') {
                    const menuText = `💖 *CRUSH RAY BOT MENU* 💖

━━━━━━━━━━━━━━━━━━
📱 *GENERAL*
.menu - Show this menu
.ping - Check bot response
.alive - Bot status
.owner - Contact owner

🎨 *MEDIA*
.sticker - Make sticker

🎵 *DOWNLOADERS*
.play - Play music

💖 *FUN*
.ship - Ship compatibility
.simp - Simp meter

━━━━━━━━━━━━━━━━━━
💖 *CRUSH RAY BOT* - Your Best WhatsApp Bot! 💖`;

                    await sock.sendMessage(chatId, { text: menuText });
                    return;
                }
                
                if (userMessage === '.ping') {
                    const start = Date.now();
                    await sock.sendMessage(chatId, { text: '🏓 Pinging...' });
                    const end = Date.now();
                    await sock.sendMessage(chatId, { text: `🏓 *Pong!*\n⏱️ Response: ${end - start}ms\n💖 CRUSH RAY is alive!` });
                    return;
                }
                
                if (userMessage === '.alive') {
                    await sock.sendMessage(chatId, { text: `💖 *CRUSH RAY IS ALIVE!* 💖\n\n✅ Online\n⏰ ${new Date().toLocaleString()}\n👤 PRESENTER RAY\n🔧 Type .menu for commands` });
                    return;
                }
                
                if (userMessage === '.owner') {
                    await sock.sendMessage(chatId, { text: `👤 *OWNER*\n\nName: PRESENTER RAY\nNumber: 0794376595\nBot: CRUSH RAY\n\nContact on WhatsApp for support!` });
                    return;
                }
                
            } catch (err) {
                console.error('Error in message handler:', err);
            }
        });
        
        // Anti-call handler (Same as Knightbot)
        sock.ev.on('call', async (calls) => {
            for (const call of calls) {
                const callerJid = call.from || call.peerJid;
                if (callerJid) {
                    await sock.sendMessage(callerJid, { 
                        text: '📵 Calls are not supported. Please text only.' 
                    }).catch(() => {});
                }
            }
        });
        
    } catch (error) {
        console.error('Error starting bot:', error);
        setTimeout(startBot, 10000);
    }
}

// Start server
server.listen(PORT, () => {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║    💖 CRUSH RAY BOT ON RENDER 💖      ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`\n🌐 Web URL: https://crush-ray-1.onrender.com`);
    console.log(`📱 Go to the URL to get your pairing code!`);
    console.log(`👤 Owner: PRESENTER RAY`);
    console.log(`📞 Number: 0794376595`);
    console.log(`\n⏳ Bot is starting... Waiting for authentication...\n`);
});

// Start the bot
startBot();
