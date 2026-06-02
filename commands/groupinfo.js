module.exports = async (sock, chatId, isGroup) => {
    if (!isGroup) {
        await sock.sendMessage(chatId, { text: '❌ This command only works in groups!', ...global.channelInfo });
        return;
    }
    
    try {
        const metadata = await sock.groupMetadata(chatId);
        const participants = metadata.participants;
        
        const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
        const botParticipant = participants.find(p => p.id === sock.user.id);
        const isBotAdmin = botParticipant?.admin === 'admin' || botParticipant?.admin === 'superadmin';
        
        const infoText = `👥 *GROUP INFORMATION*\n\n━━━━━━━━━━━━━━━━━━\n📛 *Name:* ${metadata.subject}\n🆔 *ID:* ${chatId}\n👥 *Members:* ${participants.length}\n👑 *Admins:* ${admins.length}\n🤖 *Bot Admin:* ${isBotAdmin ? '✅ Yes' : '❌ No'}\n🔓 *Restrict:* ${metadata.restrict ? '✅ Yes' : '❌ No'}\n🔒 *Announce:* ${metadata.announce ? '✅ Yes (Closed)' : '❌ No (Open)'}\n📝 *Description:* ${metadata.desc?.description || 'No description'}\n━━━━━━━━━━━━━━━━━━\n\n💖 *CRUSH RAY BOT*`;
        
        await sock.sendMessage(chatId, { text: infoText, ...global.channelInfo });
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error getting group info!', ...global.channelInfo });
    }
};