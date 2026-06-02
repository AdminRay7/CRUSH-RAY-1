const fs = require('fs');
const path = require('path');

const pmblockerFile = './data/pmblocker.json';

function readState() {
    try {
        if (fs.existsSync(pmblockerFile)) {
            return JSON.parse(fs.readFileSync(pmblockerFile));
        }
    } catch (e) {}
    return { enabled: false, message: 'Private messages are blocked. Please contact @owner in groups.' };
}

function writeState(state) {
    fs.writeFileSync(pmblockerFile, JSON.stringify(state, null, 2));
}

async function pmblockerCommand(sock, chatId, args, isGroup, isOwner) {
    if (!isOwner) {
        await sock.sendMessage(chatId, { text: '❌ Only owner can use this command!', ...global.channelInfo });
        return;
    }
    
    const action = args[0]?.toLowerCase();
    const state = readState();
    
    if (action === 'on') {
        state.enabled = true;
        writeState(state);
        await sock.sendMessage(chatId, { text: '🚫 *PM Blocker* has been ENABLED!\nNon-owner DMs will be blocked.\n\n💖 *CRUSH RAY BOT*', ...global.channelInfo });
    } else if (action === 'off') {
        state.enabled = false;
        writeState(state);
        await sock.sendMessage(chatId, { text: '🚫 *PM Blocker* has been DISABLED!\n\n💖 *CRUSH RAY BOT*', ...global.channelInfo });
    } else if (action === 'set' && args[1]) {
        const newMessage = args.slice(1).join(' ');
        state.message = newMessage;
        writeState(state);
        await sock.sendMessage(chatId, { text: `✅ PM Blocker message updated!\n\nNew message: ${newMessage}\n\n💖 *CRUSH RAY BOT*`, ...global.channelInfo });
    } else {
        const status = state.enabled ? 'ENABLED' : 'DISABLED';
        await sock.sendMessage(chatId, { text: `🚫 *PM Blocker* is currently ${status}\nMessage: ${state.message}\n\nUse .pmblocker on/off/set <message>\n\n💖 *CRUSH RAY BOT*`, ...global.channelInfo });
    }
}

module.exports = { pmblockerCommand, readState };