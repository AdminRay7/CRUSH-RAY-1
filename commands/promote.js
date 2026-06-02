async function promoteCommand(sock, chatId, senderId, mentionedJid, message) {
    try {
        let target = mentionedJid[0];
        
        if (!target) {
            await sock.sendMessage(chatId, { text: '❌ Please mention a user to promote!\nExample: .promote @user', ...global.channelInfo });
            return;
        }
        
        await sock.groupParticipantsUpdate(chatId, [target], 'promote');
        await sock.sendMessage(chatId, { 
            text: `✅ @${target.split('@')[0]} has been promoted to admin by @${senderId.split('@')[0]}!\n\n💖 *CRUSH RAY BOT*`,
            mentions: [target, senderId],
            ...global.channelInfo 
        });
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error promoting user!', ...global.channelInfo });
    }
}

async function demoteCommand(sock, chatId, senderId, mentionedJid, message) {
    try {
        let target = mentionedJid[0];
        
        if (!target) {
            await sock.sendMessage(chatId, { text: '❌ Please mention a user to demote!\nExample: .demote @user', ...global.channelInfo });
            return;
        }
        
        await sock.groupParticipantsUpdate(chatId, [target], 'demote');
        await sock.sendMessage(chatId, { 
            text: `✅ @${target.split('@')[0]} has been demoted from admin by @${senderId.split('@')[0]}!\n\n💖 *CRUSH RAY BOT*`,
            mentions: [target, senderId],
            ...global.channelInfo 
        });
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error demoting user!', ...global.channelInfo });
    }
}

module.exports = { promoteCommand, demoteCommand };