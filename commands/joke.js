const axios = require('axios');

module.exports = async (sock, chatId) => {
    try {
        const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
        
        const joke = response.data;
        
        const jokeText = `🎭 *RANDOM JOKE* 🎭\n\n━━━━━━━━━━━━━━━━━━\n❓ ${joke.setup}\n\n😂 ${joke.punchline}\n━━━━━━━━━━━━━━━━━━\n\n💖 *CRUSH RAY BOT*`;
        
        await sock.sendMessage(chatId, { text: jokeText, ...global.channelInfo });
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❓ Why did the scarecrow win an award?\n\nBecause he was outstanding in his field! 🤣\n\n💖 *CRUSH RAY BOT*', ...global.channelInfo });
    }
};