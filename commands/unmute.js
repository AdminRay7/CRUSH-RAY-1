const mutedGroups = require('./mute');

module.exports = async (sock, chatId, senderId) => {
    try {
        if (mutedGroups.isGroupMuted(chatId)) {
            mutedGroups.delete(chatId);
            await sock.sendMessage(chatId, { 
                text: `🔊 Group has been unmuted by @${senderId.split('@')[0]}!\n\n💖 *CRUSH RAY BOT*`,
                mentions: [senderId],
                ...global.channelInfo 
            });
        } else {
            await sock.sendMessage(chatId, { text: '❌ Group is not muted!', ...global.channelInfo });
        }
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error unmuting group!', ...global.channelInfo });
    }
};