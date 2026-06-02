const axios = require('axios');

module.exports = async (sock, chatId, message, args) => {
    try {
        if (!args.length) {
            await sock.sendMessage(chatId, { text: '❌ Please provide a question!\nExample: .ai What is love?\n\n💖 *CRUSH RAY BOT*' });
            return;
        }
        
        const question = args.join(' ');
        
        await sock.sendMessage(chatId, { text: `💖 *CRUSH RAY AI* is thinking...` });
        
        // Using LolHuman API from your keys
        const apiKey = global.APIKeys['https://api.lolhuman.xyz'];
        const response = await axios.get(`https://api.lolhuman.xyz/api/ai/gpt?apikey=${apiKey}&text=${encodeURIComponent(question)}`);
        
        let answer = response.data?.result || response.data?.message || "I couldn't understand that. Please try again!";
        
        const aiResponse = `💖 *CRUSH RAY AI* 💖\n\n❓ *Question:* ${question}\n\n💬 *Answer:* ${answer}\n\n━━━━━━━━━━━━━━━━━━\n💖 *CRUSH RAY* - Your AI Assistant!`;
        
        await sock.sendMessage(chatId, { text: aiResponse, ...global.channelInfo });
        
    } catch (error) {
        console.error(error);
        // Fallback to SimSimi if main API fails
        try {
            const response = await axios.get(`https://api.simsimi.v1/v1/?text=${encodeURIComponent(question)}&lc=en`);
            let answer = response.data?.message || response.data?.response || "I couldn't understand that.";
            await sock.sendMessage(chatId, { text: `💖 *CRUSH RAY AI:* ${answer}\n\n💖 *CRUSH RAY BOT*`, ...global.channelInfo });
        } catch (e) {
            await sock.sendMessage(chatId, { text: '❌ AI service error. Please try again later!', ...global.channelInfo });
        }
    }
};