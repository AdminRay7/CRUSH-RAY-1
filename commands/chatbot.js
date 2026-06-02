const fs = require('fs');

const chatbotStatus = new Map();

async function handleChatbotCommand(sock, chatId, args, isGroup, isOwner) {
    const action = args[0]?.toLowerCase();
    
    if (action === 'on') {
        chatbotStatus.set(chatId, true);
        await sock.sendMessage(chatId, { text: '🤖 *Chatbot* has been ENABLED!\nI will respond to messages automatically.\n\n💖 *CRUSH RAY BOT*', ...global.channelInfo });
    } else if (action === 'off') {
        chatbotStatus.set(chatId, false);
        await sock.sendMessage(chatId, { text: '🤖 *Chatbot* has been DISABLED!\n\n💖 *CRUSH RAY BOT*', ...global.channelInfo });
    } else {
        const status = chatbotStatus.get(chatId) ? 'ENABLED' : 'DISABLED';
        await sock.sendMessage(chatId, { text: `🤖 *Chatbot* is currently ${status}\nUse .chatbot on/off to change.\n\n💖 *CRUSH RAY BOT*`, ...global.channelInfo });
    }
}

async function handleChatbotResponse(sock, chatId, message, userMessage, senderId) {
    if (!chatbotStatus.get(chatId)) return false;
    
    // Don't respond to commands
    if (userMessage.startsWith('.')) return false;
    
    // Don't respond to short messages
    if (userMessage.length < 3) return false;
    
    try {
        // Using free AI API
        const axios = require('axios');
        const response = await axios.get(`https://api.simsimi.v1/v1/?text=${encodeURIComponent(userMessage)}&lc=en`);
        
        let reply = response.data?.message || response.data?.response || "I'm sorry, I didn't understand that. 💖";
        
        await sock.sendMessage(chatId, { 
            text: `🤖 *CRUSH RAY AI:* ${reply}\n\n💖 *CRUSH RAY BOT*`,
            ...global.channelInfo 
        });
        
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = { handleChatbotCommand, handleChatbotResponse };