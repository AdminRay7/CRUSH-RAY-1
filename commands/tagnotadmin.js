module.exports = async (sock, chatId, isGroup) => {
    if (!isGroup) {
        await sock.sendMessage(chatId, { text: '❌ This command only works in groups!', ...global.channelInfo });
        return;
    }
    
    try {
        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants;
        const nonAdmins = participants.filter(p => !p.admin);
        
        if (nonAdmins.length === 0) {
            await sock.sendMessage(chatId, { text: 'No non-admin members found!', ...global.channelInfo });
            return;
        }
        
        let tagText = `👥 *NON-ADMIN MEMBERS*\n\n━━━━━━━━━━━━━━━━━━\n`;
        const mentions = [];
        
        for (let i = 0; i < nonAdmins.length; i++) {
            mentions.push(nonAdmins[i].id);
            tagText += `${i + 1}. @${nonAdmins[i].id.split('@')[0]}\n`;
        }
        
        tagText += `\n━━━━━━━━━━━━━━━━━━\n💖 *CRUSH RAY BOT*`;
        
        await sock.sendMessage(chatId, { text: tagText, mentions: mentions, ...global.channelInfo });
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error tagging non-admins!', ...global.channelInfo });
    }
};