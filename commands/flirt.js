const flirtyLines = [
    "Are you made of sugar? Because you're so sweet! 💖",
    "Do you have a map? I keep getting lost in your eyes! 😍",
    "Is your name Google? Because you have everything I'm searching for! 🔍",
    "Are you a magician? Because whenever I look at you, everyone else disappears! ✨",
    "Do you have a Band-Aid? Because I just scraped my knee falling for you! 💕",
    "Can I follow you home? Cause my parents always told me to follow my dreams! 🌟",
    "Are you a time traveler? Because I see you in my future! ⏰",
    "Is your name Wi-Fi? Because I'm feeling a connection! 📶",
    "Are you a camera? Every time I look at you, I smile! 📸",
    "Do you believe in love at first sight, or should I walk by again? 💘"
];

module.exports = async (sock, chatId, message) => {
    const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    let target = mentionedJid[0];
    
    const randomLine = flirtyLines[Math.floor(Math.random() * flirtyLines.length)];
    
    if (target) {
        await sock.sendMessage(chatId, { 
            text: `💕 *FLIRT ALERT* 💕\n\n@${target.split('@')[0]}, ${randomLine}\n\n💖 *CRUSH RAY BOT*`,
            mentions: [target],
            ...global.channelInfo 
        });
    } else {
        await sock.sendMessage(chatId, { 
            text: `💕 ${randomLine}\n\n💖 *CRUSH RAY BOT*`,
            ...global.channelInfo 
        });
    }
};