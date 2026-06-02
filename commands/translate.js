const translate = require('translate-google-api');

async function handleTranslateCommand(sock, chatId, args) {
    try {
        if (args.length < 2) {
            await sock.sendMessage(chatId, { text: '❌ Please provide language and text!\nExample: .translate es Hello world\n\nSupported codes: en, es, fr, de, it, pt, ru, ja, ko, zh, ar, hi\n\n💖 *CRUSH RAY BOT*' });
            return;
        }
        
        const targetLang = args[0];
        const text = args.slice(1).join(' ');
        
        const result = await translate(text, { to: targetLang });
        
        await sock.sendMessage(chatId, {
            text: `🌐 *Translation*\n\n📝 Original: ${text}\n🔤 Translated: ${result[0]}\n🎯 Language: ${targetLang}\n\n💖 *CRUSH RAY BOT*`,
            ...global.channelInfo
        });
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, { text: '❌ Error translating text!', ...global.channelInfo });
    }
}

module.exports = { handleTranslateCommand };