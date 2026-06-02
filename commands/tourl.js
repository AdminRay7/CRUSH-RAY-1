const { getBuffer } = require('../lib/myfunc');
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');

module.exports = async (sock, chatId, message) => {
    try {
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quotedMessage) {
            await sock.sendMessage(chatId, { text: '❌ Please reply to an image/video!\nExample: Reply to media and type .tourl', ...global.channelInfo });
            return;
        }
        
        let mediaBuffer;
        let mediaType;
        
        if (quotedMessage.imageMessage) {
            const stream = await sock.downloadMediaMessage(message);
            mediaBuffer = Buffer.from(await stream.toBuffer());
            mediaType = 'image';
        } else if (quotedMessage.videoMessage) {
            const stream = await sock.downloadMediaMessage(message);
            mediaBuffer = Buffer.from(await stream.toBuffer());
            mediaType = 'video';
        } else {
            await sock.sendMessage(chatId, { text: '❌ Please reply to an image or video!', ...global.channelInfo });
            return;
        }
        
        // Upload to temporary hosting (replace with your preferred service)
        const formData = new FormData();
        formData.append('file', mediaBuffer, { filename: `file.${mediaType === 'image' ? 'jpg' : 'mp4'}` });
        
        const response = await axios.post('https://telegra.ph/upload', formData, {
            headers: formData.getHeaders()
        });
        
        const url = 'https://telegra.ph' + response.data[0].src;
        
        await sock.sendMessage(chatId, { 
            text: `✅ *Upload Successful!*\n\n🔗 URL: ${url}\n📁 Type: ${mediaType}\n\n💖 *CRUSH RAY BOT*`,
            ...global.channelInfo 
        });
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error uploading file!', ...global.channelInfo });
    }
};