module.exports = async (sock, chatId, message) => {
    const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    
    if (mentionedJid.length < 2) {
        await sock.sendMessage(chatId, { text: '❌ Please mention two users to ship!\nExample: .ship @user1 @user2', ...global.channelInfo });
        return;
    }
    
    const user1 = mentionedJid[0];
    const user2 = mentionedJid[1];
    
    const percentage = Math.floor(Math.random() * 101);
    
    let heartEmoji = '💔';
    if (percentage >= 80) heartEmoji = '💖💖💖';
    else if (percentage >= 60) heartEmoji = '💖💖';
    else if (percentage >= 40) heartEmoji = '💖';
    else if (percentage >= 20) heartEmoji = '💕';
    
    let message_text = "";
    if (percentage >= 80) message_text = "Perfect match! Meant to be! 💘";
    else if (percentage >= 60) message_text = "Great chemistry! 💕";
    else if (percentage >= 40) message_text = "Good potential! 💗";
    else if (percentage >= 20) message_text = "Friends maybe? 💝";
    else message_text = "Better as friends! 💔";
    
    const shipText = `💕 *SHIP COMPATIBILITY* 💕\n\n━━━━━━━━━━━━━━━━━━\n💑 @${user1.split('@')[0]} ❤️ @${user2.split('@')[0]}\n\n📊 *Compatibility:* ${percentage}% ${heartEmoji}\n💬 ${message_text}\n━━━━━━━━━━━━━━━━━━\n\n💖 *CRUSH RAY BOT*`;
    
    await sock.sendMessage(chatId, { 
        text: shipText,
        mentions: [user1, user2],
        ...global.channelInfo 
    });
};