async function clearCommand(sock, chatId, isGroup, isAdmin, isBotAdmin) {
    if (!isGroup) {
        await sock.sendMessage(chatId, { text: '❌ This command only works in groups!', ...global.channelInfo });
        return;
    }
    
    if (!isAdmin) {
        await sock.sendMessage(chatId, { text: '❌ Only admins can use this command!', ...global.channelInfo });
        return;
    }
    
    if (!isBotAdmin) {
        await sock.sendMessage(chatId, { text: '❌ Bot needs to be admin to clear messages!', ...global.channelInfo });
        return;
    }
    
    try {
        // Get last 100 messages
        const messages = await sock.loadMessages(chatId, 100);
        
        for (const msg of messages) {
            if (msg.key.fromMe || !msg.key.participant) {
                await sock.sendMessage(chatId, { delete: msg.key });
                await delay(100);
            }
        }
        
        await sock.sendMessage(chatId, { text: '✅ Cleared recent messages!\n\n💖 *CRUSH RAY BOT*', ...global.channelInfo });
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error clearing messages!', ...global.channelInfo });
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { clearCommand };