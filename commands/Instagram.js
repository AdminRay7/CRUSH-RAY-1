const axios = require('axios');

module.exports = async (sock, chatId, args) => {
    try {
        if (!args.length) {
            await sock.sendMessage(chatId, { text: '❌ Please provide an Instagram URL!\nExample: .instagram https://www.instagram.com/p/xxxxx\n\n💖 *CRUSH RAY BOT*' });
            return;
        }
        
        const url = args[0];
        
        if (!url.includes('instagram.com')) {
            await sock.sendMessage(chatId, { text: '❌ Invalid Instagram URL!', ...global.channelInfo });
            return;
        }
        
        await sock.sendMessage(chatId, { text: '📥 *CRUSH RAY* downloading Instagram media...' });
        
        // Using XTeam API from your keys
        const apiKey = global.APIKeys['https://api.xteam.xyz'];
        const response = await axios.get(`https://api.xteam.xyz/dl/ig?apikey=${apiKey}&url=${encodeURIComponent(url)}`);
        
        if (response.data && response.data.result && response.data.result.url) {
            await sock.sendMessage(chatId, {
                video: { url: response.data.result.url },
                caption: `📸 *Instagram Downloader*\n💖 *CRUSH RAY BOT*`
            });
        } else {
            throw new Error('No media found');
        }
        
    } catch (error) {
        console.error(error);
        // Fallback to FGMods API
        try {
            const fgKey = global.APIKeys['https://api-fgmods.ddns.net'];
            const response = await axios.get(`https://api-fgmods.ddns.net/api/download/instagram?apikey=${fgKey}&url=${encodeURIComponent(url)}`);
            if (response.data && response.data.result) {
                await sock.sendMessage(chatId, {
                    video: { url: response.data.result },
                    caption: `📸 *Instagram Downloader*\n💖 *CRUSH RAY BOT*`
                });
            }
        } catch (e) {
            await sock.sendMessage(chatId, { text: '❌ Error downloading Instagram media!\nMake sure the URL is correct.', ...global.channelInfo });
        }
    }
};