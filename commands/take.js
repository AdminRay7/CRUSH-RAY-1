const { writeExifImg } = require('../lib/exif');
const fs = require('fs');

module.exports = async (sock, chatId, message, args) => {
    try {
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quotedMessage?.stickerMessage) {
            await sock.sendMessage(chatId, { text: '❌ Please reply to a sticker!\nExample: .take packname | author\n\n💖 *CRUSH RAY BOT*' });
            return;
        }
        
        let packname = global.packname || 'CRUSH RAY';
        let author = global.author || 'PRESENTER RAY';
        
        if (args.length) {
            const text = args.join(' ');
            const splitText = text.split('|');
            if (splitText[0]) packname = splitText[0].trim();
            if (splitText[1]) author = splitText[1].trim();
        }
        
        const stream = await sock.downloadMediaMessage(message);
        const buffer = Buffer.from(await stream.toBuffer());
        
        const stickerWithExif = await writeExifImg(buffer, { packname, author });
        
        await sock.sendMessage(chatId, { sticker: stickerWithExif });
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error editing sticker!', ...global.channelInfo });
    }
};