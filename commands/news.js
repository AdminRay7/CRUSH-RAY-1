const axios = require('axios');

module.exports = async (sock, chatId) => {
    try {
        await sock.sendMessage(chatId, { text: '📰 *CRUSH RAY* fetching latest news...' });
        
        // Using LolHuman API from your keys
        const apiKey = global.APIKeys['https://api.lolhuman.xyz'];
        const response = await axios.get(`https://api.lolhuman.xyz/api/news/kompas?apikey=${apiKey}`);
        
        if (response.data && response.data.result) {
            const news = response.data.result.slice(0, 5);
            
            let newsText = `📰 *LATEST NEWS* 📰\n\n━━━━━━━━━━━━━━━━━━\n`;
            
            for (let i = 0; i < news.length; i++) {
                const item = news[i];
                newsText += `${i + 1}. *${item.title}*\n`;
                newsText += `   📅 ${item.date || 'Recent'}\n`;
                newsText += `   🔗 ${item.link}\n\n`;
            }
            
            newsText += `━━━━━━━━━━━━━━━━━━\n💖 *CRUSH RAY BOT*`;
            
            await sock.sendMessage(chatId, { text: newsText, ...global.channelInfo });
        } else {
            throw new Error('No news found');
        }
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error fetching news!', ...global.channelInfo });
    }
};