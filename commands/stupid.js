module.exports = async (sock, chatId, message) => {
    const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    let target = mentionedJid[0] || message.key.participant || message.key.remoteJid;
    
    const percentage = Math.floor(Math.random() * 101);
    
    let rating = "";
    if (percentage >= 80) rating = "Genius Level! 🧠✨";
    else if (percentage >= 60) rating = "Pretty Smart! 📚";
    else if (percentage >= 40) rating = "Average Joe! 🤷";
    else if (percentage >= 20) rating = "A Little Slow... 🐢";
    else rating = "ULTIMATE STUPID! 🤪";
    
    const stupidText = `🤪 *STUPIDITY METER* 🤪\n\n━━━━━━━━━━━━━━━━━━\n👤 @${target.split('@')[0]}\n\n📊 *Stupidity Level:* ${percentage}%\n💬 *Rating:* ${rating}\n━━━━━━━━━━━━━━━━━━\n\n💖 *CRUSH RAY BOT*`;
    
    await sock.sendMessage(chatId, { 
        text: stupidText,
        mentions: [target],
        ...global.channelInfo 
    });
};