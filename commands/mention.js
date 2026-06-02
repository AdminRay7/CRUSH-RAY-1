const mentionStatus = new Map();

async function handleMentionDetection(sock, chatId, message) {
    // Detect mentions and log them
    const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    
    if (mentionedJid.length > 0) {
        const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        if (mentionedJid.includes(botJid)) {
            // Bot was mentioned
            const senderId = message.key.participant || message.key.remoteJid;
            await sock.sendMessage(chatId, {
                text: `💖 Hello! I'm CRUSH RAY BOT. Type .menu to see my commands!\n\nMade with 💖 by PRESENTER RAY`,
                mentions: [senderId]
            });
        }
    }
}

async function mentionToggleCommand(sock, chatId, args, isOwner) {
    if (!isOwner) {
        await sock.sendMessage(chatId, { text: '❌ Only owner can use this command!' });
        return;
    }
    
    const action = args[0]?.toLowerCase();
    
    if (action === 'on') {
        // Enable mention features
        await sock.sendMessage(chatId, { text: '🔔 *Mention responses* ENABLED!\nBot will respond when mentioned.\n\n💖 *CRUSH RAY BOT*' });
    } else if (action === 'off') {
        await sock.sendMessage(chatId, { text: '🔕 *Mention responses* DISABLED!\n\n💖 *CRUSH RAY BOT*' });
    }
}

async function setMentionCommand(sock, chatId, args, isOwner) {
    if (!isOwner) {
        await sock.sendMessage(chatId, { text: '❌ Only owner can use this command!' });
        return;
    }
    
    const response = args.join(' ');
    if (!response) {
        await sock.sendMessage(chatId, { text: '❌ Please provide a response message!\nExample: .setmention Hello there!' });
        return;
    }
    
    // Save mention response
    global.mentionResponse = response;
    await sock.sendMessage(chatId, { text: `✅ Mention response set to: ${response}\n\n💖 *CRUSH RAY BOT*` });
}

module.exports = { handleMentionDetection, mentionToggleCommand, setMentionCommand };