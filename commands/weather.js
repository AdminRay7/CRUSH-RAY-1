const axios = require('axios');

module.exports = async (sock, chatId, args) => {
    try {
        if (!args.length) {
            await sock.sendMessage(chatId, { text: '❌ Please provide a city name!\nExample: .weather Nairobi\n\n💖 *CRUSH RAY BOT*' });
            return;
        }
        
        const city = args.join(' ');
        
        // Using LolHuman API from your keys
        const apiKey = global.APIKeys['https://api.lolhuman.xyz'];
        const response = await axios.get(`https://api.lolhuman.xyz/api/weather?apikey=${apiKey}&query=${encodeURIComponent(city)}`);
        
        if (response.data && response.data.result) {
            const data = response.data.result;
            
            const weatherText = `🌤️ *WEATHER INFORMATION*\n\n━━━━━━━━━━━━━━━━━━\n📍 *City:* ${data.city || city}\n🌡️ *Temperature:* ${data.temp || 'N/A'}°C\n🔥 *Feels like:* ${data.feels_like || 'N/A'}°C\n💧 *Humidity:* ${data.humidity || 'N/A'}%\n🌬️ *Wind:* ${data.wind || 'N/A'} m/s\n☁️ *Condition:* ${data.description || 'N/A'}\n━━━━━━━━━━━━━━━━━━\n\n💖 *CRUSH RAY BOT*`;
            
            await sock.sendMessage(chatId, { text: weatherText, ...global.channelInfo });
        } else {
            throw new Error('No weather data');
        }
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ City not found! Please check the spelling.', ...global.channelInfo });
    }
};