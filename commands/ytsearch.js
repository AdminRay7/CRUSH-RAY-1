const yts = require('yt-search');

module.exports = async (sock, chatId, args) => {
    try {
        if (!args.length) {
            await sock.sendMessage(chatId, { text: '❌ Please provide a search query!\nExample: .ytsearch Shape of You', ...global.channelInfo });
            return;
        }
        
        const query = args.join(' ');
        
        await sock.sendMessage(chatId, { text: `🔍 Searching YouTube for "${query}"...` });
        
        const results = await yts(query);
        const videos = results.videos.slice(0, 5);
        
        if (videos.length === 0) {
            await sock.sendMessage(chatId, { text: '❌ No results found!', ...global.channelInfo });
            return;
        }
        
        let resultText = `🎵 *YOUTUBE SEARCH RESULTS* 🎵\n\n━━━━━━━━━━━━━━━━━━\n🔍 Query: ${query}\n━━━━━━━━━━━━━━━━━━\n\n`;
        
        for (let i = 0; i < videos.length; i++) {
            const v = videos[i];
            resultText += `${i + 1}. *${v.title}*\n`;
            resultText += `   ⏱️ Duration: ${v.duration.timestamp}\n`;
            resultText += `   👤 Channel: ${v.author.name}\n`;
            resultText += `   👀 Views: ${v.views}\n`;
            resultText += `   🔗 ${v.url}\n\n`;
        }
        
        resultText += `━━━━━━━━━━━━━━━━━━\n💖 *CRUSH RAY BOT*`;
        
        await sock.sendMessage(chatId, { text: resultText, ...global.channelInfo });
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error searching YouTube!', ...global.channelInfo });
    }
};