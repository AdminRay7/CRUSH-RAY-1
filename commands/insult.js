const playfulInsults = [
    "You're like a cloud... When you disappear, it's a beautiful day! ☁️",
    "You're not stupid, you just have bad luck thinking! 😜",
    "I'd agree with you, but then we'd both be wrong! 🤪",
    "You're proof that evolution can go in reverse! 🔄",
    "You bring everyone so much joy... when you leave! 🚪",
    "You're like a software update: I see you, but I ignore you! 📱",
    "You have the right to remain silent, but I doubt you have the ability! 🤐",
    "You're not the sharpest tool in the shed, but you're definitely a tool! 🔧"
];

module.exports = async (sock, chatId, message) => {
    const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    let target = mentionedJid[0];
    
    const randomInsult = playfulInsults[Math.floor(Math.random() * playfulInsults.length)];
    
    if (target) {
        await sock.sendMessage(chatId, { 
            text: `😜 *PLAYFUL INSULT* 😜\n\n@${target.split('@')[0]}, ${randomInsult}\n\n💖 *CRUSH RAY BOT*`,
            mentions: [target],
            ...global.channelInfo 
        });
    } else {
        await sock.sendMessage(chatId, { 
            text: `😜 ${randomInsult}\n\n💖 *CRUSH RAY BOT*`,
            ...global.channelInfo 
        });
    }
};