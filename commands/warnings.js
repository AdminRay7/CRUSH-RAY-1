const fs = require('fs');

module.exports = async (sock, chatId, message) => {
    try {
        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        let target = mentionedJid[0] || message.key.participant || message.key.remoteJid;
        
        const warningsFile = './data/warnings.json';
        let warnings = JSON.parse(fs.readFileSync(warningsFile));
        
        const warningCount = warnings[target] || 0;
        
        await sock.sendMessage(chatId, { 
            text: `⚠️ *WARNING STATUS*\n\nUser: @${target.split('@')[0]}\nWarnings: ${warningCount}/3\n\n💖 *CRUSH RAY BOT*`,
            mentions: [target],
            ...global.channelInfo 
        });
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error checking warnings!', ...global.channelInfo });
    }
};