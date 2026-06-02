const fs = require('fs');
const path = require('path');

const reactions = new Map();

async function addCommandReaction(sock, chatId, command, reaction) {
    reactions.set(command, reaction);
}

async function handleAreactCommand(sock, chatId, args, isOwner) {
    if (!isOwner) {
        await sock.sendMessage(chatId, { text: '❌ Only owner can use this command!' });
        return;
    }
    
    const [command, emoji] = args;
    if (!command || !emoji) {
        await sock.sendMessage(chatId, { text: '❌ Usage: .areact <command> <emoji>\nExample: .areact ping 🏓' });
        return;
    }
    
    await addCommandReaction(sock, command, emoji);
    await sock.sendMessage(chatId, { text: `✅ Reaction set: ${command} → ${emoji}` });
}

module.exports = { addCommandReaction, handleAreactCommand };