const fs = require('fs');

const autoreadFile = './data/autoread.json';

function readState() {
    try {
        if (fs.existsSync(autoreadFile)) {
            return JSON.parse(fs.readFileSync(autoreadFile));
        }
    } catch (e) {}
    return { enabled: false };
}

function writeState(state) {
    fs.writeFileSync(autoreadFile, JSON.stringify(state, null, 2));
}

async function autoreadCommand(sock, chatId, args, isOwner) {
    if (!isOwner) {
        await sock.sendMessage(chatId, { text: '❌ Only owner can use this command!', ...global.channelInfo });
        return;
    }
    
    const action = args[0]?.toLowerCase();
    const state = readState();
    
    if (action === 'on') {
        state.enabled = true;
        writeState(state);
        await sock.sendMessage(chatId, { text: '👁️ *Auto-Read* has been ENABLED!\nMessages will be marked as read automatically.\n\n💖 *CRUSH RAY BOT*', ...global.channelInfo });
    } else if (action === 'off') {
        state.enabled = false;
        writeState(state);
        await sock.sendMessage(chatId, { text: '👁️ *Auto-Read* has been DISABLED!\n\n💖 *CRUSH RAY BOT*', ...global.channelInfo });
    } else {
        const status = state.enabled ? 'ENABLED' : 'DISABLED';
        await sock.sendMessage(chatId, { text: `👁️ *Auto-Read* is currently ${status}\nUse .autoread on/off to change.\n\n💖 *CRUSH RAY BOT*`, ...global.channelInfo });
    }
}

async function isAutoreadEnabled() {
    return readState().enabled;
}

async function handleAutoread(sock, message) {
    if (!await isAutoreadEnabled()) return;
    
    if (message.key && !message.key.fromMe && message.key.remoteJid !== 'status@broadcast') {
        await sock.readMessages([message.key]);
    }
}

module.exports = { autoreadCommand, isAutoreadEnabled, handleAutoread };