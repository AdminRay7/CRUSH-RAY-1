module.exports = async (sock, chatId, message, args, isGroup) => {
    if (!isGroup) {
        await sock.sendMessage(chatId, { text: '❌ This command only works in groups!', ...global.channelInfo });
        return;
    }
    
    try {
        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants;
        const mentions = participants.map(p => p.id);
        
        const text = args.length ? args.join(' ') : '📢 *CRUSH RAY BOT* - Attention everyone!';
        
        await sock.sendMessage(chatId, { text: text, mentions: mentions, ...global.channelInfo });
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error tagging members!', ...global.channelInfo });
    }
};