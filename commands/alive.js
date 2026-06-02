module.exports = async (sock, chatId) => {
    const aliveText = `💖 *CRUSH RAY IS ALIVE!* 💖

━━━━━━━━━━━━━━━━━━
✅ *Status:* Online & Active
⏰ *Time:* ${new Date().toLocaleString()}
📅 *Date:* ${new Date().toDateString()}
🤖 *Bot:* CRUSH RAY
👤 *Owner:* PRESENTER RAY
👨‍💻 *Developer:* RAY
📞 *Contact:* 0757829372
⚡ *Uptime:* 24/7
━━━━━━━━━━━━━━━━━━

Type *.menu* to see all commands!

💖 *Made with love by RAY* 💖`;

    await sock.sendMessage(chatId, { text: aliveText, ...global.channelInfo });
};