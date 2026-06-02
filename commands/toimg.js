const { extractWebpInfo } = require('../lib/converter');
const fs = require('fs');
const path = require('path');

module.exports = async (sock, chatId, message) => {
    try {
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quotedMessage?.stickerMessage) {
            await sock.sendMessage(chatId, { text: '❌ Please reply to a sticker!\nExample: Reply to sticker and type .toimg', ...global.channelInfo });
            return;
        }
        
        const stream = await sock.downloadMediaMessage(message);
        const buffer = Buffer.from(await stream.toBuffer());
        
        // Convert sticker to image
        const outputPath = path.join(__dirname, '../temp', `${Date.now()}.png`);
        
        // Use sharp or jimp to convert
        const sharp = require('sharp');
        await sharp(buffer).png().toFile(outputPath);
        
        await sock.sendMessage(chatId, {
            image: fs.readFileSync(outputPath),
            caption: `🖼️ *Sticker converted to image*\n\n💖 *CRUSH RAY BOT*`
        }, { quoted: message });
        
        fs.unlinkSync(outputPath);
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error converting sticker to image!', ...global.channelInfo });
    }
};