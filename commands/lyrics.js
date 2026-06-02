const axios = require('axios');

module.exports = async (sock, chatId, args) => {
    try {
        if (!args.length) {
            await sock.sendMessage(chatId, { text: '❌ Please provide a song name!\nExample: .lyrics Shape of You\n\n💖 *CRUSH RAY BOT*' });
            return;
        }
        
        const song = args.join(' ');
        
        await sock.sendMessage(chatId, { text: `🔍 *CRUSH RAY* searching lyrics for "${song}"...` });
        
        // Using LolHuman API from your keys
        const apiKey = global.APIKeys['https://api.lolhuman.xyz'];
        const response = await axios.get(`https://api.lolhuman.xyz/api/lyrics?apikey=${apiKey}&query=${encodeURIComponent(song)}`);
        
        if (response.data && response.data.result) {
            const lyrics = response.data.result.lyrics || response.data.result;
            const truncatedLyrics = lyrics.substring(0, 4000);
            
            await sock.sendMessage(chatId, { 
                text: `🎵 *Lyrics for: ${song}*\n\n${truncatedLyrics}\n\n💖 *CRUSH RAY BOT*`,
                ...global.channelInfo 
            });
        } else {
            throw new Error('No lyrics found');
        }
        
    } catch (error) {
        console.error(error);
        // Fallback to alternative API
        try {
            const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(song.split(' - ')[0])}/${encodeURIComponent(song.split(' - ')[1] || song)}`);
            if (response.data && response.data.lyrics) {
                await sock.sendMessage(chatId, { 
                    text: `🎵 *Lyrics for: ${song}*\n\n${response.data.lyrics.substring(0, 4000)}\n\n💖 *CRUSH RAY BOT*`,
                    ...global.channelInfo 
                });
            }
        } catch (e) {
            await sock.sendMessage(chatId, { text: `❌ Lyrics not found for "${song}"!`, ...global.channelInfo });
        }
    }
};