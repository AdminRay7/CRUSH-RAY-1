const fs = require('fs');

// Bot Configuration
global.botname = "CRUSH RAY";
global.ownername = "PRESENTER RAY";
global.developer = "RAY";
global.ownernumber = "0794376595";
global.ownerNumber = ["254794376595@s.whatsapp.net"];
global.themeemoji = "💖";
global.packname = "CRUSH RAY";
global.author = "PRESENTER RAY";
global.version = "1.0.0";

// Channel and Social Links
global.channelLink = "https://whatsapp.com/channel/0029VbCne5677qVRVvdVAn1b";
global.newsletterJid = "0029VbCne5677qVRVvdVAn1b@newsletter";
global.newsletterName = "CRUSH RAY UPDATES";
global.ytch = "PRESENTER RAY";
global.github = "https://github.com/yourusername/crush-ray-bot.git";

// Bot Settings
global.sessionName = "./session";
global.storeWriteInterval = 10000;
global.autoRead = false;
global.autoTyping = false;
global.autoRecord = false;

// Feature Toggles
global.antiCall = true;
global.antiDelete = true;
global.antiBadword = false;
global.antiLink = false;
global.antiTag = false;

// Timezone
global.timezone = "Africa/Nairobi";

// Warning Settings
global.maxWarn = 3;

// Premium Settings
global.premium = [];

// Message Settings
global.autoReadMessages = false;
global.autoStatusRead = false;

// Console Log Startup
console.log('╔═══════════════════════════════════════╗');
console.log('║      💖 CRUSH RAY BOT SETTINGS 💖      ║');
console.log('╚═══════════════════════════════════════╝');
console.log(`🤖 Bot Name: ${global.botname}`);
console.log(`👤 Owner: ${global.ownername}`);
console.log(`👨‍💻 Developer: ${global.developer}`);
console.log(`📞 Number: ${global.ownernumber}`);
console.log(`📢 Channel: ${global.channelLink}`);
console.log(`📦 GitHub: ${global.github}`);
console.log('✅ Settings loaded successfully!\n');

// Export settings
module.exports = {
    botname: global.botname,
    ownername: global.ownername,
    ownernumber: global.ownernumber,
    packname: global.packname,
    author: global.author,
    version: global.version,
    github: global.github,
    channelLink: global.channelLink,
    newsletterJid: global.newsletterJid,
    newsletterName: global.newsletterName,
    sessionName: global.sessionName,
    storeWriteInterval: global.storeWriteInterval,
    autoRead: global.autoRead,
    autoTyping: global.autoTyping,
    autoRecord: global.autoRecord,
    antiCall: global.antiCall,
    antiDelete: global.antiDelete,
    antiBadword: global.antiBadword,
    antiLink: global.antiLink,
    antiTag: global.antiTag,
    timezone: global.timezone,
    maxWarn: global.maxWarn,
    premium: global.premium,
    autoReadMessages: global.autoReadMessages,
    autoStatusRead: global.autoStatusRead
};