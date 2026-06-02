const compliments = [
    "You're awesome! 🌟",
    "You have a great sense of humor! 😂",
    "You're a great listener! 👂",
    "You're so creative! 🎨",
    "You're a fantastic friend! 🤝",
    "You light up the room! 💡",
    "You're really smart! 🧠",
    "You're so kind! 💝",
    "You're incredibly talented! 🎭",
    "You're one of a kind! 💎"
];

module.exports = async (sock, chatId, message) => {
    const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    let target = mentionedJid[0];
    
    const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
    
    if (target) {
        await sock.sendMessage(chatId, { 
            text: `💝 *COMPLIMENT* 💝\n\n@${target.split('@')[0]}, ${randomCompliment}\n\n💖 *CRUSH RAY BOT*`,
            mentions: [target],
            ...global.channelInfo 
        });
    } else {
        await sock.sendMessage(chatId, { 
            text: `💝 ${randomCompliment}\n\n💖 *CRUSH RAY BOT*`,
            ...global.channelInfo 
        });
    }
};