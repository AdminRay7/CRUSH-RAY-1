const dares = [
    "Send the last photo in your gallery! 📸",
    "Share a funny secret about yourself! 🤫",
    "Send a voice note singing your favorite song! 🎤",
    "Post an embarrassing photo! 😅",
    "Text 'I love you' to the 5th person in your contacts! 💌",
    "Change your profile picture for 10 minutes! 🖼️",
    "Record yourself dancing! 💃",
    "Send a meme that describes your current mood! 🎭",
    "Share something you've never told anyone! 🤐",
    "Do 10 pushups right now! 💪"
];

module.exports = async (sock, chatId, message) => {
    const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    let target = mentionedJid[0];
    
    const randomDare = dares[Math.floor(Math.random() * dares.length)];
    
    if (target) {
        await sock.sendMessage(chatId, { 
            text: `🎭 *DARE* 🎭\n\n@${target.split('@')[0]}, ${randomDare}\n\n💖 *CRUSH RAY BOT*`,
            mentions: [target],
            ...global.channelInfo 
        });
    } else {
        await sock.sendMessage(chatId, { 
            text: `🎭 *DARE* 🎭\n\n${randomDare}\n\n💖 *CRUSH RAY BOT*`,
            ...global.channelInfo 
        });
    }
};