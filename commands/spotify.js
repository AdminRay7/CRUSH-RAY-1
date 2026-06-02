const axios = require('axios');

module.exports = async (sock, chatId, args) => {
    try {
        if (!args.length) {
            await sock.sendMessage(chatId, { text: '❌ Please provide a Spotify URL!\nExample: .spotify https://open.spotify.com/track/xxxxx\n\n💖 *CRUSH RAY BOT*' });
            return;
        }
        
        const url = args[0];
        
        if (!url.includes('spotify.com')) {
            await sock.sendMessage(chatId, { text: '❌ Invalid Spotify URL!', ...global.channelInfo });
            return;
        }
        
        await sock.sendMessage(chatId, { text: '🎵 *CRUSH RAY* downloading Spotify track...' });
        
        // Using XTeam API from your keys
        const apiKey = global.APIKeys['https://api.xteam.xyz'];
        const response = await axios.get(`https://api.xteam.xyz/dl/spotify?apikey=${apiKey}&url=${encodeURIComponent(url)}`);
        
        if (response.data && response.data.result && response.data.result.url) {
            await sock.sendMessage(chatId, {
                audio: { url: response.data.result.url },
                mimetype: 'audio/mpeg',
                fileName: `${response.data.result.title || 'track'}.mp3`
            });
        } else {
            throw new Error('No audio found');
        }
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error downloading Spotify track!', ...global.channelInfo });
    }
};