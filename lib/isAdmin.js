module.exports = async (sock, chatId, userId) => {
    try {
        const groupMetadata = await sock.groupMetadata(chatId);
        const participant = groupMetadata.participants.find(p => p.id === userId);
        
        const isSenderAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
        
        const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const botParticipant = groupMetadata.participants.find(p => p.id === botId);
        const isBotAdmin = botParticipant?.admin === 'admin' || botParticipant?.admin === 'superadmin';
        
        return { isSenderAdmin, isBotAdmin };
    } catch (error) {
        console.error('Error checking admin status:', error);
        return { isSenderAdmin: false, isBotAdmin: false };
    }
};