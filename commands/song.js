const ytdl = require('ytdl-core');
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');

module.exports = async (sock, chatId, message, args) => {
    try {
        if (!args.length) {
            await sock.sendMessage(chatId, { text: '❌ Please provide a song name!\nExample: .song Shape of You\n\n💖 *CRUSH RAY BOT*' });
            return;
        }
        
        const query = args.join(' ');
        
        await sock.sendMessage(chatId, { text: `🔍 *CRUSH RAY* searching for "${query}"...` });
        
        const searchResults = await yts(query);
        const video = searchResults.videos[0];
        
        if (!video) {
            await sock.sendMessage(chatId, { text: '❌ No results found!', ...global.channelInfo });
            return;
        }
        
        await sock.sendMessage(chatId, { 
            text: `🎵 *Downloading:* ${video.title}\n⏱️ *Duration:* ${video.duration.timestamp}\n📺 *Channel:* ${video.author.name}\n\nPlease wait...`,
            ...global.channelInfo
        });
        
        const stream = ytdl(video.url, { filter: 'audioonly', quality: 'highestaudio' });
        const filePath = path.join(__dirname, '../temp', `${Date.now()}.mp3`);
        const writeStream = fs.createWriteStream(filePath);
        
        stream.pipe(writeStream);
        
        writeStream.on('finish', async () => {
            await sock.sendMessage(chatId, {
                audio: fs.readFileSync(filePath),
                mimetype: 'audio/mpeg',
                fileName: `${video.title}.mp3`,
                caption: `🎵 *${video.title}*\n💖 *CRUSH RAY BOT*`
            }, { quoted: message });
            
            fs.unlinkSync(filePath);
        });
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error downloading audio!', ...global.channelInfo });
    }
};