const axios = require('axios');

module.exports = async (sock, chatId) => {
    try {
        await sock.sendMessage(chatId, { text: '🎭 *CRUSH RAY* fetching a random meme...' });
        
        // Using LolHuman API from your keys
        const apiKey = global.APIKeys['https://api.lolhuman.xyz'];
        const response = await axios.get(`https://api.lolhuman.xyz/api/random/meme?apikey=${apiKey}`);
        
        if (response.data && response.data.result) {
            await sock.sendMessage(chatId, {
                image: { url: response.data.result },
                caption: `🎭 *Random Meme*\n💖 *CRUSH RAY BOT*`
            });
        } else {
            throw new Error('No meme found');
        }
        
    } catch (error) {
        console.error(error);
        // Fallback to alternative API
        try {
            const response = await axios.get('https://meme-api.com/gimme');
            if (response.data && response.data.url) {
                await sock.sendMessage(chatId, {
                    image: { url: response.data.url },
                    caption: `🎭 *Random Meme*\n📝 Title: ${response.data.title}\n💖 *CRUSH RAY BOT*`
                });
            }
        } catch (e) {
            await sock.sendMessage(chatId, { text: '❌ Error fetching meme!\nPlease try again later.', ...global.channelInfo });
        }
    }
};