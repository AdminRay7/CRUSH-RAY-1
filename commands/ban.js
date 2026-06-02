const fs = require('fs');
const path = require('path');

module.exports = async (sock, chatId, message) => {
    try {
        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const quotedParticipant = message.message?.extendedTextMessage?.contextInfo?.participant;
        
        let target = mentionedJid[0] || quotedParticipant;
        
        if (!target) {
            await sock.sendMessage(chatId, { text: '❌ Please mention a user to ban!\nExample: .ban @user', ...global.channelInfo });
            return;
        }
        
        const bannedFile = './data/banned.json';
        let banned = JSON.parse(fs.readFileSync(bannedFile));
        
        if (!banned.includes(target)) {
            banned.push(target);
            fs.writeFileSync(bannedFile, JSON.stringify(banned, null, 2));
            await sock.sendMessage(chatId, { text: `✅ User @${target.split('@')[0]} has been banned from using CRUSH RAY BOT!`, mentions: [target], ...global.channelInfo });
        } else {
            await sock.sendMessage(chatId, { text: `⚠️ User is already banned!`, ...global.channelInfo });
        }
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error banning user!', ...global.channelInfo });
    }
};