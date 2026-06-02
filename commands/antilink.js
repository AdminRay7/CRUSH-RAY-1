const fs = require('fs');

const antilinkStatus = new Map();

async function handleAntilinkCommand(sock, chatId, args, isGroup) {
    if (!isGroup) {
        await sock.sendMessage(chatId, { text: '❌ This command only works in groups!', ...global.channelInfo });
        return;
    }
    
    const action = args[0]?.toLowerCase();
    
    if (action === 'on') {
        antilinkStatus.set(chatId, true);
        await sock.sendMessage(chatId, { text: '🔗 *Anti-Link* has been ENABLED!\nAny links sent will be deleted automatically.\n\n💖 *CRUSH RAY BOT*', ...global.channelInfo });
    } else if (action === 'off') {
        antilinkStatus.set(chatId, false);
        await sock.sendMessage(chatId, { text: '🔗 *Anti-Link* has been DISABLED!\nLinks are now allowed.\n\n💖 *CRUSH RAY BOT*', ...global.channelInfo });
    } else {
        const status = antilinkStatus.get(chatId) ? 'ENABLED' : 'DISABLED';
        await sock.sendMessage(chatId, { text: `🔗 *Anti-Link* is currently ${status}\nUse .antilink on/off to change.\n\n💖 *CRUSH RAY BOT*`, ...global.channelInfo });
    }
}

async function handleLinkDetection(sock, chatId, message, userMessage) {
    if (!antilinkStatus.get(chatId)) return false;
    
    const linkPattern = /(https?:\/\/[^\s]+|www\.[^\s]+|\b\w+\.(com|org|net|io|me|xyz|link|club)\b)/i;
    
    if (linkPattern.test(userMessage)) {
        const senderId = message.key.participant || message.key.remoteJid;
        const isAdmin = await isUserAdmin(sock, chatId, senderId);
        
        if (!isAdmin && !message.key.fromMe) {
            await sock.sendMessage(chatId, { delete: message.key });
            await sock.sendMessage(chatId, { 
                text: `⚠️ @${senderId.split('@')[0]}, links are not allowed in this group!\n\n💖 *CRUSH RAY BOT*`,
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

module.exports = { handleAntilinkCommand, handleLinkDetection };