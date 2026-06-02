module.exports = async (sock, chatId, senderId, mentionedJid, message) => {
    try {
        let target = mentionedJid[0];
        
        if (!target) {
            await sock.sendMessage(chatId, { text: '❌ Please mention a user to kick!\nExample: .kick @user', ...global.channelInfo });
            return;
        }
        
        if (target === sock.user.id) {
            await sock.sendMessage(chatId, { text: '❌ I cannot kick myself!', ...global.channelInfo });
            return;
        }
        
        const groupMetadata = await sock.groupMetadata(chatId);
        const isTargetAdmin = groupMetadata.participants.find(p => p.id === target)?.admin === 'admin' || 
                             groupMetadata.participants.find(p => p.id === target)?.admin === 'superadmin';
        
        if (isTargetAdmin) {
            await sock.sendMessage(chatId, { text: '❌ Cannot kick an admin!', ...global.channelInfo });
            return;
        }
        
        await sock.groupParticipantsUpdate(chatId, [target], 'remove');
        await sock.sendMessage(chatId, { 
            text: `✅ @${target.split('@')[0]} has been kicked from the group by @${senderId.split('@')[0]}!\n\n💖 *CRUSH RAY BOT*`,
            mentions: [target, senderId],
            ...global.channelInfo 
        });
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error kicking user! Make sure I am an admin.', ...global.channelInfo });
    }
};