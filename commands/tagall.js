module.exports = async (sock, chatId, message, isGroup) => {
    if (!isGroup) {
        await sock.sendMessage(chatId, { text: '❌ This command only works in groups!', ...global.channelInfo });
        return;
    }
    
    try {
        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants;
        
        let mentions = [];
        let tagText = `💖 *CRUSH RAY* - MENTION ALL 💖\n\n━━━━━━━━━━━━━━━━━━\n👤 *Group:* ${groupMetadata.subject}\n👥 *Members:* ${participants.length}\n👑 *Owner:* PRESENTER RAY\n━━━━━━━━━━━━━━━━━━\n\n`;
        
        for (let i = 0; i < participants.length; i++) {
            const participant = participants[i].id;
            mentions.push(participant);
            tagText += `${i + 1}. @${participant.split('@')[0]}\n`;
        }
        
        tagText += `\n━━━━━━━━━━━━━━━━━━\n💖 *CRUSH RAY BOT* - Your Best Assistant! 💖`;
        
        await sock.sendMessage(chatId, { text: tagText, mentions: mentions, ...global.channelInfo });
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error tagging members!', ...global.channelInfo });
    }
};