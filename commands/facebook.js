const axios = require('axios');

module.exports = async (sock, chatId, args) => {
    try {
        if (!args.length) {
            await sock.sendMessage(chatId, { text: '❌ Please provide a Facebook URL!\nExample: .facebook https://www.facebook.com/watch?v=xxxxx\n\n💖 *CRUSH RAY BOT*' });
            return;
        }
        
        const url = args[0];
        
        if (!url.includes('facebook.com') && !url.includes('fb.com')) {
            await sock.sendMessage(chatId, { text: '❌ Invalid Facebook URL!', ...global.channelInfo });
            return;
        }
        
        await sock.sendMessage(chatId, { text: '📥 *CRUSH RAY* downloading Facebook video...' });
        
        // Using XTeam API from your keys
        const apiKey = global.APIKeys['https://api.xteam.xyz'];
        const response = await axios.get(`https://api.xteam.xyz/dl/fb?apikey=${apiKey}&url=${encodeURIComponent(url)}`);
        
        if (response.data && response.data.result && response.data.result.url) {
            await sock.sendMessage(chatId, {
                video: { url: response.data.result.url },
                caption: `📘 *Facebook Downloader*\n💖 *CRUSH RAY BOT*`
            });
        } else {
            throw new Error('No video found');
        }
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error downloading Facebook video!', ...global.channelInfo });
    }
};