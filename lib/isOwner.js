const fs = require('fs');
const path = require('path');

async function isOwnerOrSudo(userId, sock, chatId) {
    try {
        const ownerFile = './data/owner.json';
        let owners = [];
        
        if (fs.existsSync(ownerFile)) {
            owners = JSON.parse(fs.readFileSync(ownerFile));
        }
        
        // Check if user is in owner list
        if (owners.includes(userId)) {
            return true;
        }
        
        // Check if user is bot owner (from settings)
        if (global.ownerNumber && global.ownerNumber.includes(userId)) {
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error checking owner status:', error);
        return false;
    }
}

module.exports = isOwnerOrSudo;