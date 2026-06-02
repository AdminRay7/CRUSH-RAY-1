const fs = require('fs');

module.exports = async (sock, chatId, message) => {
    try {
        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        let target = mentionedJid[0];
        
        if (!target) {
            await sock.sendMessage(chatId, { text: '❌ Please mention a user to warn!\nExample: .warn @user', ...global.channelInfo });
            return;
        }
        
        const warningsFile = './data/warnings.json';
        let warnings = JSON.parse(fs.readFileSync(warningsFile));
        
        if (!warnings[target]) {
            warnings[target] = 1;
        } else {
            warnings[target]++;
        }
        
        fs.writeFileSync(warningsFile, JSON.stringify(warnings, null, 2));
        
        let response = `⚠️ @${target.split('@')[0]} has been warned!\n📊 Total warnings: ${warnings[target]}/3\n\n💖 *CRUSH RAY BOT*`;
        
        if (warnings[target] >= 3) {
            response += `\n\n❌ User has been banned due to 3 warnings!`;
            const bannedFile = './data/banned.json';
            let banned = JSON.parse(fs.readFileSync(bannedFile));
            if (!banned.includes(target)) {
                banned.push(target);
                fs.writeFileSync(bannedFile, JSON.stringify(banned, null, 2));
            }
        }
        
        await sock.sendMessage(chatId, { text: response, mentions: [target], ...global.channelInfo });
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error warning user!', ...global.channelInfo });
    }
};