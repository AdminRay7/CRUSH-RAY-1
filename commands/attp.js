const { imageToWebp, writeExifImg } = require('../lib/exif');
const { getBuffer } = require('../lib/myfunc');
const axios = require('axios');

module.exports = async (sock, chatId, args) => {
    try {
        if (!args.length) {
            await sock.sendMessage(chatId, { text: '❌ Please provide text for the sticker!\nExample: .attp CRUSH RAY\n\n💖 *CRUSH RAY BOT*' });
            return;
        }
        
        const text = args.join(' ');
        
        await sock.sendMessage(chatId, { text: '🎨 *CRUSH RAY* creating text sticker...' });
        
        // Using XTeam API from your keys
        const apiKey = global.APIKeys['https://api.xteam.xyz'];
        const apiUrl = `https://api.xteam.xyz/maker/attp?apikey=${apiKey}&text=${encodeURIComponent(text)}`;
        
        const buffer = await getBuffer(apiUrl);
        const stickerBuffer = await imageToWebp(buffer);
        const packname = global.packname || 'CRUSH RAY';
        const author = global.author || 'PRESENTER RAY';
        const stickerWithExif = await writeExifImg(stickerBuffer, { packname, author });
        
        await sock.sendMessage(chatId, { sticker: stickerWithExif });
        
    } catch (error) {
        console.error(error);
        // Fallback to alternative API
        try {
            const apiUrl = `https://api.lolhuman.xyz/api/attp?apikey=${global.APIKeys['https://api.lolhuman.xyz']}&text=${encodeURIComponent(text)}`;
            const buffer = await getBuffer(apiUrl);
            const stickerBuffer = await imageToWebp(buffer);
            const stickerWithExif = await writeExifImg(stickerBuffer, { packname: 'CRUSH RAY', author: 'PRESENTER RAY' });
            await sock.sendMessage(chatId, { sticker: stickerWithExif });
        } catch (e) {
            await sock.sendMessage(chatId, { text: '❌ Error creating text sticker!', ...global.channelInfo });
        }
    }
};