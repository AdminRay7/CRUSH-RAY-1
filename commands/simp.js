module.exports = async (sock, chatId, message) => {
    const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    let target = mentionedJid[0] || message.key.participant || message.key.remoteJid;
    
    const percentage = Math.floor(Math.random() * 101);
    
    let rating = "";
    if (percentage >= 80) rating = "ULTIMATE SIMP! 👑";
    else if (percentage >= 60) rating = "Professional Simp! 🎓";
    else if (percentage >= 40) rating = "Casual Simp! 😅";
    else if (percentage >= 20) rating = "Secret Simp! 🤫";
    else rating = "Not a Simp! 🏆";
    
    const simpText = `😍 *SIMP METER* 😍\n\n━━━━━━━━━━━━━━━━━━\n👤 @${target.split('@')[0]}\n\n📊 *Simp Level:* ${percentage}%\n💬 *Rating:* ${rating}\n━━━━━━━━━━━━━━━━━━\n\n💖 *CRUSH RAY BOT*`;
    
    await sock.sendMessage(chatId, { 
        text: simpText,
        mentions: [target],
        ...global.channelInfo 
    });
};