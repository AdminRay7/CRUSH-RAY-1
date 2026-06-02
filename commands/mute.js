const fs = require('fs');

const mutedGroups = new Map();

module.exports = async (sock, chatId, senderId, message, durationMinutes) => {
    try {
        if (durationMinutes && durationMinutes > 0) {
            mutedGroups.set(chatId, Date.now() + (durationMinutes * 60 * 1000));
            await sock.sendMessage(chatId, { 
                text: `🔇 Group has been muted for ${durationMinutes} minutes by @${senderId.split('@')[0]}!\nNo one can send messages except admins.\n\n💖 *CRUSH RAY BOT*`,
                mentions: [senderId],
                ...global.channelInfo 
            });
            
            setTimeout(async () => {
                if (mutedGroups.get(chatId) <= Date.now()) {
                    mutedGroups.delete(chatId);
                    await sock.sendMessage(chatId, { text: `🔊 Group has been unmuted automatically!\n\n💖 *CRUSH RAY BOT*`, ...global.channelInfo });
                }
            }, durationMinutes * 60 * 1000);
        } else {
            mutedGroups.set(chatId, -1);
            await sock.sendMessage(chatId, { 
                text: `🔇 Group has been muted by @${senderId.split('@')[0]}!\nUse .unmute to enable messages again.\n\n💖 *CRUSH RAY BOT*`,
                mentions: [senderId],
                ...global.channelInfo 
            });
        }
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error muting group!', ...global.channelInfo });
    }
};

module.exports.isGroupMuted = (chatId) => {
    if (!mutedGroups.has(chatId)) return false;
    const muteUntil = mutedGroups.get(chatId);
    if (muteUntil === -1) return true;
    if (Date.now() > muteUntil) {
        mutedGroups.delete(chatId);
        return false;
    }
    return true;
};