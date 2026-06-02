/**
 * CRUSH RUSH Bot - WhatsApp Bot
 * Owner: PRESENTER RAY
 * Developer: RAY
 */
require('./settings')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main');
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./lib/myfunc')
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    jidDecode,
    proto,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const pino = require("pino")
const readline = require("readline")
const { rmSync, existsSync } = require('fs')
const { join } = require('path')

// Import lightweight store
const store = require('./lib/lightweight_store')

// Initialize store
store.readFromFile()
const settings = require('./settings')
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)

// Memory optimization
setInterval(() => {
    if (global.gc) {
        global.gc()
        console.log('🧹 Garbage collection completed')
    }
}, 60_000)

// Memory monitoring
setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 400) {
        console.log('⚠️ RAM too high (>400MB), restarting bot...')
        process.exit(1)
    }
}, 30_000)

let phoneNumber = "254794376595"
let owner = JSON.parse(fs.readFileSync('./data/owner.json'))

global.botname = "CRUSH RUSH"
global.themeemoji = "💖"
const pairingCode = true
const useMobile = process.argv.includes("--mobile")

// Create readline interface
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

async function startBot() {
    try {
        let { version, isLatest } = await fetchLatestBaileysVersion()
        const { state, saveCreds } = await useMultiFileAuthState(`./session`)
        const msgRetryCounterCache = new NodeCache()

        const sock = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: !pairingCode,
            browser: ["CRUSH RUSH", "Chrome", "1.0.0"],
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            syncFullHistory: false,
            getMessage: async (key) => {
                let jid = jidNormalizedUser(key.remoteJid)
                let msg = await store.loadMessage(jid, key.id)
                return msg?.message || ""
            },
            msgRetryCounterCache,
            defaultQueryTimeoutMs: 60000,
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 10000,
        })

        sock.ev.on('creds.update', saveCreds)
        store.bind(sock.ev)

        // Message handling
        sock.ev.on('messages.upsert', async chatUpdate => {
            try {
                const mek = chatUpdate.messages[0]
                if (!mek.message) return
                mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
                if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                    await handleStatus(sock, chatUpdate);
                    return;
                }
                if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return

                if (sock?.msgRetryCounterCache) {
                    sock.msgRetryCounterCache.clear()
                }

                try {
                    await handleMessages(sock, chatUpdate, true)
                } catch (err) {
                    console.error("Error in handleMessages:", err)
                    if (mek.key && mek.key.remoteJid) {
                        await sock.sendMessage(mek.key.remoteJid, {
                            text: '❌ An error occurred while processing your message.',
                            contextInfo: {
                                forwardingScore: 1,
                                isForwarded: true,
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: '0029VbCne5677qVRVvdVAn1b@newsletter',
                                    newsletterName: 'CRUSH RUSH UPDATES',
                                    serverMessageId: -1
                                }
                            }
                        }).catch(console.error);
                    }
                }
            } catch (err) {
                console.error("Error in messages.upsert:", err)
            }
        })

        sock.decodeJid = (jid) => {
            if (!jid) return jid
            if (/:\d+@/gi.test(jid)) {
                let decode = jidDecode(jid) || {}
                return decode.user && decode.server && decode.user + '@' + decode.server || jid
            } else return jid
        }

        sock.ev.on('contacts.update', update => {
            for (let contact of update) {
                let id = sock.decodeJid(contact.id)
                if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
            }
        })

        sock.getName = (jid, withoutContact = false) => {
            id = sock.decodeJid(jid)
            withoutContact = sock.withoutContact || withoutContact
            let v
            if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
                v = store.contacts[id] || {}
                if (!(v.name || v.subject)) v = sock.groupMetadata(id) || {}
                resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
            })
            else v = id === '0@s.whatsapp.net' ? {
                id,
                name: 'WhatsApp'
            } : id === sock.decodeJid(sock.user.id) ?
                sock.user :
                (store.contacts[id] || {})
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
        }

        sock.public = true
        sock.serializeM = (m) => smsg(sock, m, store)

        // PAIRING CODE HANDLER - WITH RETRY LOGIC
        if (pairingCode && !sock.authState.creds.registered) {
            if (useMobile) throw new Error('Cannot use pairing code with mobile api')

            let phoneNum = phoneNumber
            
            // Use the number directly without prompting
            console.log(chalk.cyan(`\n╔════════════════════════════════════════════╗`))
            console.log(chalk.cyan(`║     💖 CRUSH RUSH PAIRING CODE 💖          ║`))
            console.log(chalk.cyan(`╚════════════════════════════════════════════╝\n`))
            console.log(chalk.yellow(`📱 Using phone number: ${phoneNum}\n`))

            // Clean the phone number
            phoneNum = phoneNum.replace(/[^0-9]/g, '')

            // Validate the phone number
            const pn = require('awesome-phonenumber');
            if (!pn('+' + phoneNum).isValid()) {
                console.log(chalk.red('Invalid phone number.'));
                process.exit(1);
            }

            // Function to request pairing code with retry
            const requestCodeWithRetry = async (retryCount = 0) => {
                try {
                    console.log(chalk.yellow(`⏳ Requesting pairing code... (Attempt ${retryCount + 1}/3)`))
                    let code = await sock.requestPairingCode(phoneNum)
                    code = code?.match(/.{1,4}/g)?.join("-") || code
                    
                    console.log(chalk.black(chalk.bgGreen(`\n🔐 YOUR PAIRING CODE: ${code}\n`)))
                    console.log(chalk.yellow(`📱 HOW TO USE:`))
                    console.log(chalk.white(`1. Open WhatsApp on your phone`))
                    console.log(chalk.white(`2. Go to Settings > Linked Devices`))
                    console.log(chalk.white(`3. Tap "Link a Device"`))
                    console.log(chalk.white(`4. Enter this code: ${code}`))
                    console.log(chalk.white(`5. Wait for connection...\n`))
                    
                    return true
                } catch (error) {
                    console.error(chalk.red(`❌ Attempt ${retryCount + 1} failed:`, error.message))
                    
                    if (retryCount < 2) {
                        console.log(chalk.yellow(`Retrying in 5 seconds...\n`))
                        await delay(5000)
                        return requestCodeWithRetry(retryCount + 1)
                    } else {
                        console.log(chalk.red(`\n❌ Failed to get pairing code after 3 attempts.`))
                        console.log(chalk.yellow(`\n⚠️ ALTERNATIVE: Use QR code method`))
                        console.log(chalk.white(`Restart the bot and it will show QR code automatically.`))
                        return false
                    }
                }
            }

            // Wait a bit before requesting
            await delay(3000)
            await requestCodeWithRetry()
        }

        // Connection handling
        sock.ev.on('connection.update', async (s) => {
            const { connection, lastDisconnect, qr } = s
            
            if (qr && !pairingCode) {
                console.log(chalk.yellow('📱 QR Code generated. Please scan with WhatsApp.'))
            }
            
            if (connection === 'connecting') {
                console.log(chalk.yellow('🔄 Connecting to WhatsApp...'))
            }
            
            if (connection == "open") {
                console.log(chalk.magenta(`\n╔════════════════════════════════════════════╗`))
                console.log(chalk.magenta(`║        💖 CRUSH RUSH BOT ACTIVE 💖         ║`))
                console.log(chalk.magenta(`╚════════════════════════════════════════════╝\n`))
                console.log(chalk.green(`✅ Bot Connected Successfully!\n`))
                console.log(chalk.cyan(`🤖 Bot Name: ${global.botname}`))
                console.log(chalk.cyan(`👤 Owner: PRESENTER RAY`))
                console.log(chalk.cyan(`👨‍💻 Developer: RAY`))
                console.log(chalk.cyan(`📞 Number: 0794376595`))

                try {
                    const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
                    await sock.sendMessage(botNumber, {
                        text: `💖 *CRUSH RUSH BOT ACTIVATED* 💖\n\n⏰ Time: ${new Date().toLocaleString()}\n✅ Status: Online & Ready!\n👤 Owner: PRESENTER RAY\n📞 Number: 0794376595\n🔧 Type .menu for commands\n\nMade with 💖 by RAY`,
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '0029VbCne5677qVRVvdVAn1b@newsletter',
                                newsletterName: 'CRUSH RUSH UPDATES',
                                serverMessageId: -1
                            }
                        }
                    });
                } catch (error) {
                    console.error('Error sending connection message:', error.message)
                }
            }
            
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
                const statusCode = lastDisconnect?.error?.output?.statusCode
                
                console.log(chalk.red(`Connection closed: ${lastDisconnect?.error}`))
                
                if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
                    try {
                        rmSync('./session', { recursive: true, force: true })
                        console.log(chalk.yellow('Session folder deleted. Please re-authenticate.'))
                    } catch (error) {
                        console.error('Error deleting session:', error)
                    }
                    console.log(chalk.red('Session logged out. Please re-authenticate.'))
                }
                
                if (shouldReconnect) {
                    console.log(chalk.yellow('Reconnecting in 5 seconds...'))
                    await delay(5000)
                    startBot()
                }
            }
        })

        // Anti-call handler
        const antiCallNotified = new Set();
        sock.ev.on('call', async (calls) => {
            try {
                const { readState: readAnticallState } = require('./commands/anticall');
                const state = readAnticallState();
                if (!state.enabled) return;
                for (const call of calls) {
                    const callerJid = call.from || call.peerJid || call.chatId;
                    if (!callerJid) continue;
                    if (!antiCallNotified.has(callerJid)) {
                        antiCallNotified.add(callerJid);
                        setTimeout(() => antiCallNotified.delete(callerJid), 60000);
                        await sock.sendMessage(callerJid, { text: '📵 Anticall is enabled. Your call was rejected and you will be blocked.' });
                    }
                    setTimeout(async () => {
                        try { await sock.updateBlockStatus(callerJid, 'block'); } catch {}
                    }, 800);
                }
            } catch (e) {}
        });

        sock.ev.on('group-participants.update', async (update) => {
            await handleGroupParticipantUpdate(sock, update);
        });

        sock.ev.on('messages.upsert', async (m) => {
            if (m.messages[0].key && m.messages[0].key.remoteJid === 'status@broadcast') {
                await handleStatus(sock, m);
            }
        });

        return sock
    } catch (error) {
        console.error('Error in startBot:', error)
        await delay(5000)
        startBot()
    }
}

// Start the bot
console.log(chalk.cyan('\n╔════════════════════════════════════════╗'))
console.log(chalk.cyan('║       💖 CRUSH RUSH BOT 💖            ║'))
console.log(chalk.cyan('║    WhatsApp Bot by PRESENTER RAY     ║'))
console.log(chalk.cyan('╚════════════════════════════════════════╝\n'))

startBot().catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
})

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err)
})

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err)
})

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})