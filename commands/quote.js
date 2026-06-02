const axios = require('axios');

module.exports = async (sock, chatId) => {
    try {
        const response = await axios.get('https://api.quotable.io/random');
        
        const quote = response.data;
        
        const quoteText = `💭 *INSPIRATIONAL QUOTE* 💭\n\n━━━━━━━━━━━━━━━━━━\n"${quote.content}"\n\n— *${quote.author}*\n━━━━━━━━━━━━━━━━━━\n\n💖 *CRUSH RAY BOT*`;
        
        await sock.sendMessage(chatId, { text: quoteText, ...global.channelInfo });
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '💭 "The only way to do great work is to love what you do." — Steve Jobs\n\n💖 *CRUSH RAY BOT*', ...global.channelInfo });
    }
};