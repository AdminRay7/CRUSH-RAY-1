const fs = require('fs');
const path = require('path');

const messageCountFile = './data/messageCount.json';

// Initialize message count file if not exists
function initMessageCount() {
    try {
        if (!fs.existsSync(messageCountFile)) {
            const initialData = {
                isPublic: true,
                counts: {},
                totalMessages: 0
            };
            fs.writeFileSync(messageCountFile, JSON.stringify(initialData, null, 2));
        }
    } catch (error) {
        console.error('Error initializing message count:', error);
    }
}

// Increment message count for a user
function incrementMessageCount(chatId, senderId) {
    try {
        initMessageCount();
        const data = JSON.parse(fs.readFileSync(messageCountFile));
        
        if (!data.counts[chatId]) {
            data.counts[chatId] = {};
        }
        
        data.counts[chatId][senderId] = (data.counts[chatId][senderId] || 0) + 1;
        data.totalMessages = (data.totalMessages || 0) + 1;
        
        fs.writeFileSync(messageCountFile, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error incrementing message count:', error);
    }
}

// Get top members in a group
async function topMembers(sock, chatId, args) {
    try {
        initMessageCount();
        const data = JSON.parse(fs.readFileSync(messageCountFile));
        
        const groupCounts = data.counts[chatId] || {};
        
        // Sort users by message count
        const sortedUsers = Object.entries(groupCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        if (sortedUsers.length === 0) {
            await sock.sendMessage(chatId, { 
                text: '📊 *TOP MEMBERS*\n\nNo message data yet. Start chatting to see rankings!\n\n💖 CRUSH RUSH BOT',
                ...global.channelInfo 
            });
            return;
        }
        
        let text = `📊 *TOP MEMBERS - ACTIVE CHATTERS* 📊\n\n━━━━━━━━━━━━━━━━━━\n`;
        
        for (let i = 0; i < sortedUsers.length; i++) {
            const [userId, count] = sortedUsers[i];
            const name = userId.split('@')[0];
            text += `${i + 1}. @${name} - ${count} messages\n`;
        }
        
        text += `\n━━━━━━━━━━━━━━━━━━\n📝 Total messages in group: ${Object.values(groupCounts).reduce((a, b) => a + b, 0)}\n\n💖 *CRUSH RUSH BOT*`;
        
        const mentions = sortedUsers.map(u => u[0]);
        
        await sock.sendMessage(chatId, { text, mentions, ...global.channelInfo });
        
    } catch (error) {
        console.error('Error getting top members:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Error fetching top members!\n\n💖 CRUSH RUSH BOT',
            ...global.channelInfo 
        });
    }
}

module.exports = { incrementMessageCount, topMembers };