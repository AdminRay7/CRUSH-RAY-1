const fs = require('fs');
const path = require('path');

const anticallFile = './data/anticall.json';

function readState() {
    try {
        if (fs.existsSync(anticallFile)) {
            return JSON.parse(fs.readFileSync(anticallFile));
        }
    } catch (e) {}
    return { enabled: false };
}

function writeState(state) {
    fs.writeFileSync(anticallFile, JSON.stringify(state, null, 2));
}

async function anticallCommand(sock, chatId, args, isGroup, isOwner) {
    if (!isOwner) {
        await sock.sendMessage(chatId, { text: '❌ Only owner can use this command!', ...global.channelInfo });
        return;
    }
    
    const action = args[0]?.toLowerCase();
    const state = readState();
    
    if (action === 'on') {
        state.enabled = true;
        writeState(state);
        await sock.sendMessage(chatId, { text: '📵 *Anti-Call* has been ENABLED!\nCallers will be blocked automatically.\n\n💖 *CRUSH RAY BOT*', ...global.channelInfo });
    } else if (action === 'off') {
        state.enabled = false;
        writeState(state);
        await sock.sendMessage(chatId, { text: '📵 *Anti-Call* has been DISABLED!\n\n💖 *CRUSH RAY BOT*', ...global.channelInfo });
    } else {
        const status = state.enabled ? 'ENABLED' : 'DISABLED';
        await sock.sendMessage(chatId, { text: `📵 *Anti-Call* is currently ${status}\nUse .anticall on/off to change.\n\n💖 *CRUSH RAY BOT*`, ...global.channelInfo });
    }
}

module.exports = { anticallCommand, readState };