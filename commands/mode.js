const fs = require('fs');

async function modeCommand(sock, chatId, args, isOwner) {
    if (!isOwner) {
        await sock.sendMessage(chatId, { text: '❌ Only owner can change bot mode!', ...global.channelInfo });
        return;
    }
    
    const modeFile = './data/messageCount.json';
    let data = JSON.parse(fs.readFileSync(modeFile));
    
    const action = args[0]?.toLowerCase();
    
    if (action === 'public') {
        data.isPublic = true;
        fs.writeFileSync(modeFile, JSON.stringify(data, null, 2));
        await sock.sendMessage(chatId, { text: '🌐 *Bot Mode:* PUBLIC\nEveryone can use the bot!\n\n💖 *CRUSH RAY BOT*', ...global.channelInfo });
    } else if (action === 'private') {
        data.isPublic = false;
        fs.writeFileSync(modeFile, JSON.stringify(data, null, 2));
        await sock.sendMessage(chatId, { text: '🔒 *Bot Mode:* PRIVATE\nOnly owner can use the bot!\n\n💖 *CRUSH RAY BOT*', ...global.channelInfo });
    } else {
        const status = data.isPublic ? 'PUBLIC' : 'PRIVATE';
        await sock.sendMessage(chatId, { text: `🌐 *Current Mode:* ${status}\nUse .mode public or .mode private to change.\n\n💖 *CRUSH RAY BOT*`, ...global.channelInfo });
    }
}

module.exports = modeCommand;