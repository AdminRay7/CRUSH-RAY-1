const fs = require('fs');

const badWords = ['badword1', 'badword2', 'curse', 'swear']; // Add your bad words
const antibadwordStatus = new Map();

async function antibadwordCommand(sock, chatId, args, isGroup) {
    if (!isGroup) {
        await sock.sendMessage(chatId, { text: '❌ This command only works in groups!', ...global.channelInfo });
        return;
    }
    
    const action = args[0]?.toLowerCase();
    
    if (action === 'on') {
        antibadwordStatus.set(chatId, true);
        await sock.sendMessage(chatId, { text: '🚫 *Anti-Badword* has been ENABLED!\nBad words will be deleted.\n\n💖 *CRUSH RAY BOT*', ...global.channelInfo });
    } else if (action === 'off') {
        antibadwordStatus.set(chatId, false);
        await sock.sendMessage(chatId, { text: '🚫 *Anti-Badword* has been DISABLED!\n\n💖 *CRUSH RAY BOT*', ...global.channelInfo });
    } else {
        const status = antibadwordStatus.get(chatId) ? 'ENABLED' : 'DISABLED';
        await sock.sendMessage(chatId, { text: `🚫 *Anti-Badword* is currently ${status}\nUse .antibadword on/off to change.\n\n💖 *CRUSH RAY BOT*`, ...global.channelInfo });
    }
}

async function handleBadwordDetection(sock, chatId, message, userMessage, senderId) {
    if (!antibadwordStatus.get(chatId)) return false;
    
    const containsBadWord = badWords.some(word => userMessage.toLowerCase().includes(word));
    
    if (containsBadWord) {
        const isAdmin = await isUserAdmin(sock, chatId, senderId);
        
        if (!isAdmin && !message.key.fromMe) {
            await sock.sendMessage(chatId, { delete: message.key });
            await sock.sendMessage(chatId, { 
                text: `⚠️ @${senderId.split('@')[0]}, bad words are not allowed in this group!\n\n💖 *CRUSH RAY BOT*`,
                mentions: [senderId],
                ...global.channelInfo 
            });
            return true;
        }
    }
    return false;
}

async function isUserAdmin(sock, chatId, userId) {
    const metadata = await sock.groupMetadata(chatId);
    const participant = metadata.participants.find(p => p.id === userId);
    return participant?.admin === 'admin' || participant?.admin === 'superadmin';
}

module.exports = { antibadwordCommand, handleBadwordDetection };