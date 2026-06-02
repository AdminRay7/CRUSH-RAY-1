const axios = require('axios');

module.exports = async (sock, chatId) => {
    try {
        const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
        
        const fact = response.data.text;
        
        const factText = `🔍 *RANDOM FACT* 🔍\n\n━━━━━━━━━━━━━━━━━━\n${fact}\n━━━━━━━━━━━━━━━━━━\n\n💖 *CRUSH RAY BOT*`;
        
        await sock.sendMessage(chatId, { text: factText, ...global.channelInfo });
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '🔍 Did you know? Honey never spoils. Archaeologists found 3000-year-old honey in Egyptian tombs that was still edible!\n\n💖 *CRUSH RAY BOT*', ...global.channelInfo });
    }
};