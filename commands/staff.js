module.exports = async (sock, chatId, isGroup) => {
    if (!isGroup) {
        await sock.sendMessage(chatId, { text: '❌ This command only works in groups!', ...global.channelInfo });
        return;
    }
    
    try {
        const metadata = await sock.groupMetadata(chatId);
        const admins = metadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
        
        let adminList = '';
        let superAdminList = '';
        
        admins.forEach(admin => {
            if (admin.admin === 'superadmin') {
                superAdminList += `👑 @${admin.id.split('@')[0]}\n`;
            } else {
                adminList += `🔧 @${admin.id.split('@')[0]}\n`;
            }
        });
        
        const staffText = `👥 *GROUP STAFF*\n\n━━━━━━━━━━━━━━━━━━\n*SUPER ADMINS:*\n${superAdminList || 'None'}\n\n*ADMINS:*\n${adminList || 'None'}\n━━━━━━━━━━━━━━━━━━\n\n💖 *CRUSH RAY BOT*`;
        
        const mentions = admins.map(a => a.id);
        
        await sock.sendMessage(chatId, { text: staffText, mentions: mentions, ...global.channelInfo });
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error getting staff list!', ...global.channelInfo });
    }
};