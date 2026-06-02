const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('../lib/exif');
const fs = require('fs');
const { getBuffer } = require('../lib/myfunc');

module.exports = async (sock, chatId, message, args, isGroup, senderId) => {
    try {
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quotedMessage) {
            await sock.sendMessage(chatId, { text: '❌ Please reply to an image or video with .sticker\nExample: Reply to image and type .sticker', ...global.channelInfo });
            return;
        }
        
        let mediaData;
        let isVideo = false;
        
        if (quotedMessage.imageMessage) {
            mediaData = quotedMessage.imageMessage;
        } else if (quotedMessage.videoMessage) {
            mediaData = quotedMessage.videoMessage;
            isVideo = true;
        } else {
            await sock.sendMessage(chatId, { text: '❌ Please reply to an image or video!', ...global.channelInfo });
            return;
        }
        
        const stream = await sock.downloadMediaMessage(message);
        const buffer = Buffer.from(await stream.toBuffer());
        
        let stickerBuffer;
        if (isVideo) {
            stickerBuffer = await videoToWebp(buffer);
        } else {
            stickerBuffer = await imageToWebp(buffer);
        }
        
        const packname = global.packname || 'CRUSH RAY';
        const author = global.author || 'PRESENTER RAY';
        
        const stickerWithExif = await writeExifImg(stickerBuffer, { packname, author });
        
        await sock.sendMessage(chatId, { sticker: stickerWithExif }, { quoted: message });
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Failed to create sticker!\nMake sure the media is valid.', ...global.channelInfo });
    }
};