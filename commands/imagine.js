const axios = require('axios');
const { getBuffer } = require('../lib/myfunc');

module.exports = async (sock, chatId, args) => {
    try {
        if (!args.length) {
            await sock.sendMessage(chatId, { text: '❌ Please provide a prompt!\nExample: .imagine a beautiful sunset over mountains\n\n💖 *CRUSH RAY BOT*' });
            return;
        }
        
        const prompt = args.join(' ');
        
        await sock.sendMessage(chatId, { text: `🎨 *CRUSH RAY* generating image for: "${prompt}"\nPlease wait...` });
        
        // Using XTeam API from your keys
        const apiKey = global.APIKeys['https://api.xteam.xyz'];
        const response = await axios.get(`https://api.xteam.xyz/ai/diffusion?apikey=${apiKey}&text=${encodeURIComponent(prompt)}`, {
            responseType: 'arraybuffer'
        });
        
        await sock.sendMessage(chatId, {
            image: Buffer.from(response.data),
            caption: `🎨 *AI Generated Image*\n📝 Prompt: ${prompt}\n🎨 *CRUSH RAY BOT*`
        });
        
    } catch (error) {
        console.error(error);
        // Fallback to alternative API
        try {
            const response = await axios.get(`https://violetics.pw/api/ai/diffusion?apikey=beta&text=${encodeURIComponent(prompt)}`, {
                responseType: 'arraybuffer'
            });
            await sock.sendMessage(chatId, {
                image: Buffer.from(response.data),
                caption: `🎨 *AI Generated Image*\n📝 Prompt: ${prompt}\n💖 *CRUSH RAY BOT*`
            });
        } catch (e) {
            await sock.sendMessage(chatId, { text: '❌ Error generating image!\nPlease try again later.', ...global.channelInfo });
        }
    }
};