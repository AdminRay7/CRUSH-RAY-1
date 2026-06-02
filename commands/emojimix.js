const axios = require('axios');
const { getBuffer } = require('../lib/myfunc');
const { imageToWebp, writeExifImg } = require('../lib/exif');

module.exports = async (sock, chatId, args) => {
    try {
        if (args.length < 2) {
            await sock.sendMessage(chatId, { text: '❌ Please provide two emojis!\nExample: .emojimix 🐱 🐶\n\n💖 *CRUSH RAY BOT*' });
            return;
        }
        
        const emoji1 = args[0];
        const emoji2 = args[1];
        
        await sock.sendMessage(chatId, { text: '🎨 Mixing emojis...' });
        
        const apiUrl = `https://emojimix.vercel.app/api/v1/${encodeURIComponent(emoji1)}/${encodeURIComponent(emoji2)}`;
        
        try {
            const buffer = await getBuffer(apiUrl);
            const stickerBuffer = await imageToWebp(buffer);
            const packname = global.packname || 'CRUSH RAY';
            const author = global.author || 'PRESENTER RAY';
            const stickerWithExif = await writeExifImg(stickerBuffer, { packname, author });
            
            await sock.sendMessage(chatId, { sticker: stickerWithExif });
        } catch (error) {
            await sock.sendMessage(chatId, { text: `❌ Cannot mix ${emoji1} and ${emoji2}\nTry different emojis!`, ...global.channelInfo });
        }
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error mixing emojis!', ...global.channelInfo });
    }
};