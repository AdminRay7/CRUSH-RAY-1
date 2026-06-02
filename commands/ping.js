module.exports = async (sock, chatId, message) => {
    const start = Date.now();
    const sent = await sock.sendMessage(chatId, { text: '🏓 *CRUSH RAY* checking connection...' });
    const end = Date.now();
    
    await sock.sendMessage(chatId, {
        text: `🏓 *PONG!*\n\n⏱️ *Response Time:* ${end - start}ms\n💖 *Status:* Online\n🤖 *Bot:* CRUSH RAY\n👤 *Owner:* PRESENTER RAY\n\n*CRUSH RAY is ready!* 💖`,
        edit: sent.key
    });
};