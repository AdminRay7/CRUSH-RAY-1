const fs = require('fs');
const path = require('path');

function isBanned(userId) {
    try {
        const bannedFile = './data/banned.json';
        if (!fs.existsSync(bannedFile)) {
            fs.writeFileSync(bannedFile, JSON.stringify([]));
            return false;
        }
        
        const banned = JSON.parse(fs.readFileSync(bannedFile));
        return banned.includes(userId);
    } catch (error) {
        console.error('Error checking ban status:', error);
        return false;
    }
}

module.exports = { isBanned };