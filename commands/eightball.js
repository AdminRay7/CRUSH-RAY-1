const responses = [
    "Yes! 🎱",
    "No! 🎱",
    "Maybe... 🎱",
    "Ask again later 🎱",
    "Definitely! 🎱",
    "I don't think so 🎱",
    "Most likely 🎱",
    "Outlook not so good 🎱",
    "Signs point to yes 🎱",
    "Very doubtful 🎱",
    "Without a doubt 🎱",
    "My sources say no 🎱"
];

module.exports = async (sock, chatId, args) => {
    if (!args.length) {
        await sock.sendMessage(chatId, { text: '❌ Please ask a question!\nExample: .8ball Will I win the lottery?\n\n💖 *CRUSH RAY BOT*' });
        return;
    }
    
    const question = args.join(' ');
    const answer = responses[Math.floor(Math.random() * responses.length)];
    
    await sock.sendMessage(chatId, {
        text: `🎱 *Magic 8 Ball* 🎱\n\n❓ Question: ${question}\n💬 Answer: ${answer}\n\n💖 *CRUSH RAY BOT*`,
        ...global.channelInfo
    });
};