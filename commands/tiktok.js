const axios = require('axios');

module.exports = async (sock, chatId, args) => {
    try {
        if (!args.length) {
            await sock.sendMessage(chatId, { text: '❌ Please provide a TikTok URL!\nExample: .tiktok https://www.tiktok.com/@user/video/xxxxx\n\n💖 *CRUSH RAY BOT*' });
            return;
        }
        
        const url = args[0];
        
        if (!url.includes('tiktok.com')) {
            await sock.sendMessage(chatId, { text: '❌ Invalid TikTok URL!', ...global.channelInfo });
            return;
        }
        
        await sock.sendMessage(chatId, { text: '📥 *CRUSH RAY* downloading TikTok video...' });
        
        // Using XTeam API from your keys
        const apiKey = global.APIKeys['https://api.xteam.xyz'];
        const response = await axios.get(`https://api.xteam.xyz/dl/tiktok?apikey=${apiKey}&url=${encodeURIComponent(url)}`);
        
        if (response.data && response.data.result && response.data.result.nowatermark) {
            await sock.sendMessage(chatId, {
                video: { url: response.data.result.nowatermark },
                caption: `🎵 *TikTok Downloader (No Watermark)*\n💖 *CRUSH RAY BOT*`
            });
        } else {
            throw new Error('No video found');
        }
        
    } catch (error) {
        console.error(error);
        // Fallback to FGMods API
        try {
            const fgKey = global.APIKeys['https://api-fgmods.ddns.net'];
            const response = await axios.get(`https://api-fgmods.ddns.net/api/download/tiktok?apikey=${fgKey}&url=${encodeURIComponent(url)}`);
            if (response.data && response.data.result) {
                await sock.sendMessage(chatId, {
                    video: { url: response.data.result },
                    caption: `🎵 *TikTok Downloader*\n💖 *CRUSH RAY BOT*`
                });
            }
        } catch (e) {
            await sock.sendMessage(chatId, { text: '❌ Error downloading TikTok video!', ...global.channelInfo });
        }
    }
};