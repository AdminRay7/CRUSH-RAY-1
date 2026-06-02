module.exports = async (sock, chatId) => {
    const ownerInfo = `👤 *OWNER INFORMATION*

━━━━━━━━━━━━━━━━━━━━━━━━
*Bot Name:* CRUSH RAY
*Owner:* PRESENTER RAY
*Developer:* RAY
*Number:* 0757829372
*WhatsApp:* wa.me/254757829372
*Status:* Active 24/7
━━━━━━━━━━━━━━━━━━━━━━━━

💖 *CRUSH RAY Features:*
✅ 24/7 Online Operation
✅ Fast Response Time
✅ 50+ Commands
✅ Free to Use
✅ Regular Updates

📞 *Contact for:*
• Bot Support
• Report Issues
• Feature Requests
• Collaboration

*Thanks for using CRUSH RAY!* 💖`;

    await sock.sendMessage(chatId, { text: ownerInfo, ...global.channelInfo });
};