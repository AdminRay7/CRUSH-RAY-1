module.exports = async (sock, chatId, message, isGroup) => {
    try {
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quotedMessage) {
            await sock.sendMessage(chatId, { text: '❌ Please reply to a message you want to delete!\nExample: Reply to message and type .delete', ...global.channelInfo });
            return;
        }
        
        const quotedKey = message.message.extendedTextMessage.contextInfo.stanzaId;
        const quotedChatId = message.message.extendedTextMessage.contextInfo.participant || chatId;
        
        await sock.sendMessage(chatId, { delete: { remoteJid: quotedChatId, fromMe: false, id: quotedKey, participant: quotedChatId } });
        
        await sock.sendMessage(chatId, { text: '✅ Message deleted!\n\n💖 *CRUSH RAY BOT*', ...global.channelInfo });
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error deleting message!', ...global.channelInfo });
    }
};