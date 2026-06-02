const fs = require('fs');
const chalk = require('chalk');
require('dotenv').config();

// Bot Configuration
try {
    if (fs.existsSync('./assets/bot_image.jpg')) {
        global.thumb = fs.readFileSync('./assets/bot_image.jpg');
    }
} catch (e) {
    console.log('No bot image found');
}

global.owner = JSON.parse(fs.readFileSync('./data/owner.json'));

// CRUSH RAY Bot Info
global.botname = "CRUSH RAY";
global.ownername = "PRESENTER RAY";
global.developer = "RAY";
global.ownernumber = "0794376595";

// GitHub Repository
global.githubRepo = "https://github.com/yourusername/crush-ray-bot.git";

// WhatsApp Channel & Newsletter
global.whatsappChannel = "https://whatsapp.com/channel/0029VbCne5677qVRVvdVAn1b";
global.newsletterJid = "0029VbCne5677qVRVvdVAn1b@newsletter";
global.newsletterName = "CRUSH RAY UPDATES";

// API Configuration
global.APIs = {
    xteam: 'https://api.xteam.xyz',
    dzx: 'https://api.dhamzxploit.my.id',
    lol: 'https://api.lolhuman.xyz',
    violetics: 'https://violetics.pw',
    neoxr: 'https://api.neoxr.my.id',
    zenzapis: 'https://zenzapis.xyz',
    akuari: 'https://api.akuari.my.id',
    akuari2: 'https://apimu.my.id',
    nrtm: 'https://fg-nrtm.ddns.net',
    bg: 'http://bochil.ddns.net',
    fgmods: 'https://api-fgmods.ddns.net'
};

global.APIKeys = {
    'https://api.xteam.xyz': 'd90a9e986e18778b',
    'https://api.lolhuman.xyz': '85faf717d0545d14074659ad',
    'https://api.neoxr.my.id': 'yourkey',
    'https://violetics.pw': 'beta',
    'https://zenzapis.xyz': 'yourkey',
    'https://api-fgmods.ddns.net': 'fg-dylux'
};

global.WARN_COUNT = 3;

// Message Context Info for CRUSH RAY with Newsletter
global.channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: global.newsletterJid,
            newsletterName: global.newsletterName,
            serverMessageId: -1
        }
    }
};

// Additional settings
global.packname = "CRUSH RAY";
global.author = "PRESENTER RAY";
global.themeemoji = "💖";
global.version = "1.0.0";
global.timezone = "Africa/Nairobi";

// Console logs
console.log(chalk.green('╔═══════════════════════════════════════╗'));
console.log(chalk.green('║      💖 CRUSH RAY BOT CONFIG 💖        ║'));
console.log(chalk.green('╚═══════════════════════════════════════╝\n'));
console.log(chalk.cyan(`🤖 Bot Name: ${global.botname}`));
console.log(chalk.cyan(`👤 Owner: ${global.ownername}`));
console.log(chalk.cyan(`📞 Number: ${global.ownernumber}`));
console.log(chalk.cyan(`📢 Channel: ${global.whatsappChannel}`));
console.log(chalk.green(`\n✅ API Keys loaded!`));
console.log(chalk.green(`✅ ${Object.keys(global.APIs).length} APIs configured\n`));

module.exports = {
    WARN_COUNT: global.WARN_COUNT,
    APIs: global.APIs,
    APIKeys: global.APIKeys
};