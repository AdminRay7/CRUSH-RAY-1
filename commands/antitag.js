const antitagStatus = new Map();

async function handleAntitagCommand(sock, chatId, args, isGroup) {
    if (!isGroup) {
        await sock.sendMessage(chatId, { text: '❌ This command only works in groups!', ...global.channelInfo });
        return;
    }
    
    const action = args[0]?.toLowerCase();
    
    if (action === 'on') {
        antitagStatus.set(chatId, true);
        await sock.sendMessage(chatId, { text: '🏷️ *Anti-Tag* has been ENABLED!\nMass tagging will be blocked.\n\n💖 *CRUSH RAY BOT*', ...global.channelInfo });
    } else if (action === 'off') {
        antitagStatus.set(chatId, false);
        await sock.sendMessage(chatId, { text: '🏷️ *Anti-Tag* has been DISABLED!\n\n💖 *CRUSH RAY BOT*', ...global.channelInfo });
    } else {
        const status = antitagStatus.get(chatId) ? 'ENABLED' : 'DISABLED';
        await sock.sendMessage(chatId, { text: `🏷️ *Anti-Tag* is currently ${status}\nUse .antitag on/off to change.\n\n💖 *CRUSH RAY BOT*`, ...global.channelInfo });
    }
}

async function handleTagDetection(sock, chatId, message, senderId) {
    if (!antitagStatus.get(chatId)) return false;
    
    const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    
    if (mentionedJid.length > 5) {
        const isAdmin = await isUserAdmin(sock, chatId, senderId);
        
        if (!isAdmin && !message.key.fromMe) {
            await sock.sendMessage(chatId, { delete: message.key });
            await sock.sendMessage(chatId, { 
                text: `⚠️ @${senderId.split('@')[0]}, mass tagging (${mentionedJid.length} users) is not allowed!\n\n💖 *CRUSH RAY BOT*`,
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

module.exports = { handleAntitagCommand, handleTagDetection };