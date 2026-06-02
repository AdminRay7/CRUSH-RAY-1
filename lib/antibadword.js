const fs = require('fs');
const path = require('path');

const badWordsList = [
    'fuck', 'shit', 'bitch', 'asshole', 'damn', 'crap', 'stupid',
    'idiot', 'moron', 'dumb', 'suck', 'bastard', 'whore', 'slut'
];

const antibadwordStatus = new Map();

async function handleAntiBadwordCommand(sock, chatId, args, isGroup, isAdmin) {
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
        antibadwordStatus.set(chatId, true);
        await sock.sendMessage(chatId, { text: '🚫 *Anti-Badword* has been ENABLED!\nBad words will be deleted automatically.\n\n💖 *CRUSH RAY BOT*' });
    } else if (action === 'off') {
        antibadwordStatus.set(chatId, false);
        await sock.sendMessage(chatId, { text: '🚫 *Anti-Badword* has been DISABLED!\n\n💖 *CRUSH RAY BOT*' });
    } else {
        const status = antibadwordStatus.get(chatId) ? 'ENABLED' : 'DISABLED';
        await sock.sendMessage(chatId, { text: `🚫 *Anti-Badword* is currently ${status}\nUse .antibadword on/off to change.\n\n💖 *CRUSH RAY BOT*` });
    }
}

async function handleBadwordDetection(sock, chatId, message, userMessage, senderId) {
    if (!antibadwordStatus.get(chatId)) return false;
    
    const containsBadWord = badWordsList.some(word => 
        userMessage.toLowerCase().includes(word)
    );
    
    if (containsBadWord) {
        try {
            const groupMetadata = await sock.groupMetadata(chatId);
            const participant = groupMetadata.participants.find(p => p.id === senderId);
            const isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
            
            if (!isAdmin && !message.key.fromMe) {
                await sock.sendMessage(chatId, { delete: message.key });
                await sock.sendMessage(chatId, {
                    text: `⚠️ @${senderId.split('@')[0]}, bad words are not allowed in this group!\n\n💖 *CRUSH RAY BOT*`,
                    mentions: [senderId]
                });
                return true;
            }
        } catch (error) {
            console.error('Error in badword detection:', error);
        }
    }
    return false;
}

module.exports = { handleAntiBadwordCommand, handleBadwordDetection };