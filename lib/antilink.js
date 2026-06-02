const fs = require('fs');
const path = require('path');

const antilinkStatus = new Map();

async function Antilink(message, sock) {
    try {
        const chatId = message.key.remoteJid;
        if (!chatId.endsWith('@g.us')) return;
        
        const isEnabled = antilinkStatus.get(chatId);
        if (!isEnabled) return;
        
        const text = message.message?.conversation || 
                    message.message?.extendedTextMessage?.text || '';
        
        // Check for links
        const linkPattern = /(https?:\/\/[^\s]+|www\.[^\s]+|\b\w+\.(com|org|net|io|me|xyz|link|club|live|gg)\b)/i;
        
        if (linkPattern.test(text)) {
            const senderId = message.key.participant || message.key.remoteJid;
            const groupMetadata = await sock.groupMetadata(chatId);
            const participant = groupMetadata.participants.find(p => p.id === senderId);
            const isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
            
            if (!isAdmin && !message.key.fromMe) {
                await sock.sendMessage(chatId, { delete: message.key });
                await sock.sendMessage(chatId, {
                    text: `⚠️ @${senderId.split('@')[0]}, links are not allowed in this group!\n\n💖 *CRUSH RAY BOT*`,
                    mentions: [senderId]
                });
            }
        }
    } catch (error) {
        console.error('Error in antilink:', error);
    }
}

async function handleAntilinkCommand(sock, chatId, args, isGroup, isAdmin) {
    if (!isGroup) {
        await sock.sendMessage(chatId, { text: '❌ This command only works in groups!' });
        return;
    }
    
    if (!isAdmin) {
        await sock.sendMessage(chatId, { text: '❌ Only admins can use this command!' });
        return;
    }
    
    const action = args[0]?.toLowerCase();
    
    if (action === 'on') {
        antilinkStatus.set(chatId, true);
        await sock.sendMessage(chatId, { text: '🔗 *Anti-Link* has been ENABLED!\nLinks will be deleted automatically.\n\n💖 *CRUSH RAY BOT*' });
    } else if (action === 'off') {
        antilinkStatus.set(chatId, false);
        await sock.sendMessage(chatId, { text: '🔗 *Anti-Link* has been DISABLED!\n\n💖 *CRUSH RAY BOT*' });
    } else {
        const status = antilinkStatus.get(chatId) ? 'ENABLED' : 'DISABLED';
        await sock.sendMessage(chatId, { text: `🔗 *Anti-Link* is currently ${status}\nUse .antilink on/off to change.\n\n💖 *CRUSH RAY BOT*` });
    }
}

module.exports = { Antilink, handleAntilinkCommand };