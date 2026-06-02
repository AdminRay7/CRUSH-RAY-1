const truthQuestions = [
    "What's the biggest lie you've ever told?",
    "What's your biggest fear?",
    "What's something you've never told anyone?",
    "Who is your secret crush? 💕",
    "What's the worst thing you've ever done?",
    "What's something you're insecure about?",
    "What's the biggest mistake you've made?",
    "What's something you regret buying?",
    "What's the last thing you searched on your phone? 📱",
    "What's something you think about late at night?"
];

module.exports = async (sock, chatId, message) => {
    const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    let target = mentionedJid[0];
    
    const randomTruth = truthQuestions[Math.floor(Math.random() * truthQuestions.length)];
    
    if (target) {
        await sock.sendMessage(chatId, { 
            text: `🎭 *TRUTH* 🎭\n\n@${target.split('@')[0]}, ${randomTruth}\n\n💖 *CRUSH RAY BOT*`,
            mentions: [target],
            ...global.channelInfo 
        });
    } else {
        await sock.sendMessage(chatId, { 
            text: `🎭 *TRUTH* 🎭\n\n${randomTruth}\n\n💖 *CRUSH RAY BOT*`,
            ...global.channelInfo 
        });
    }
};