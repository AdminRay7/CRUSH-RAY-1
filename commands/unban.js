const fs = require('fs');

module.exports = async (sock, chatId, message) => {
    try {
        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        let target = mentionedJid[0];
        
        if (!target) {
            await sock.sendMessage(chatId, { text: '❌ Please mention a user to unban!\nExample: .unban @user', ...global.channelInfo });
            return;
        }
        
        const bannedFile = './data/banned.json';
        let banned = JSON.parse(fs.readFileSync(bannedFile));
        
        if (banned.includes(target)) {
            banned = banned.filter(id => id !== target);
            fs.writeFileSync(bannedFile, JSON.stringify(banned, null, 2));
            await sock.sendMessage(chatId, { text: `✅ User @${target.split('@')[0]} has been unbanned! They can now use CRUSH RAY BOT.`, mentions: [target], ...global.channelInfo });
        } else {
            await sock.sendMessage(chatId, { text: `⚠️ User was not banned!`, ...global.channelInfo });
        }
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error unbanning user!', ...global.channelInfo });
    }
};