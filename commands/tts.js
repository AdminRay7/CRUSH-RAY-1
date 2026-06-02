const gtts = require('gtts');
const fs = require('fs');
const path = require('path');

module.exports = async (sock, chatId, args) => {
    try {
        if (!args.length) {
            await sock.sendMessage(chatId, { text: '❌ Please provide text to speak!\nExample: .tts Hello everyone!', ...global.channelInfo });
            return;
        }
        
        const text = args.join(' ');
        
        const filePath = path.join(__dirname, '../temp', `${Date.now()}.mp3`);
        const speech = new gtts(text, 'en');
        
        speech.save(filePath, async (err) => {
            if (err) throw err;
            
            await sock.sendMessage(chatId, {
                audio: fs.readFileSync(filePath),
                mimetype: 'audio/mpeg',
                fileName: 'tts.mp3'
            }, { quoted: message });
            
            fs.unlinkSync(filePath);
        });
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error generating speech!', ...global.channelInfo });
    }
};