// 🧹 Fix for ENOSPC / temp overflow in hosted panels
const fs = require('fs');
const path = require('path');

// Redirect temp storage away from system /tmp
const customTemp = path.join(process.cwd(), 'temp');
if (!fs.existsSync(customTemp)) fs.mkdirSync(customTemp, { recursive: true });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;

// Auto-cleaner every 3 hours
setInterval(() => {
    fs.readdir(customTemp, (err, files) => {
        if (err) return;
        for (const file of files) {
            const filePath = path.join(customTemp, file);
            fs.stat(filePath, (err, stats) => {
                if (!err && Date.now() - stats.mtimeMs > 3 * 60 * 60 * 1000) {
                    fs.unlink(filePath, () => { });
                }
            });
        }
    });
    console.log('🧹 Temp folder auto-cleaned');
}, 3 * 60 * 60 * 1000);

const settings = require('./settings');
require('./config.js');
const { isBanned } = require('./lib/isBanned');
const yts = require('yt-search');
const { fetchBuffer } = require('./lib/myfunc');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { isSudo } = require('./lib/index');
const isOwnerOrSudo = require('./lib/isOwner');

// REMOVED: autotyping and autoread imports

// Command imports
const tagAllCommand = require('./commands/tagall');
const helpCommand = require('./commands/help');
const banCommand = require('./commands/ban');
const { promoteCommand } = require('./commands/promote');
const { demoteCommand } = require('./commands/demote');
const muteCommand = require('./commands/mute');
const unmuteCommand = require('./commands/unmute');
const stickerCommand = require('./commands/sticker');
const isAdmin = require('./lib/isAdmin');
const warnCommand = require('./commands/warn');
const warningsCommand = require('./commands/warnings');
const ttsCommand = require('./commands/tts');
const { tictactoeCommand, handleTicTacToeMove } = require('./commands/tictactoe');
const { incrementMessageCount, topMembers } = require('./commands/topmembers');
const ownerCommand = require('./commands/owner');
const deleteCommand = require('./commands/delete');
const { handleAntilinkCommand, handleLinkDetection } = require('./commands/antilink');
const { handleAntitagCommand, handleTagDetection } = require('./commands/antitag');
const { Antilink } = require('./lib/antilink');
const { handleMentionDetection, mentionToggleCommand, setMentionCommand } = require('./commands/mention');
const memeCommand = require('./commands/meme');
const tagCommand = require('./commands/tag');
const tagNotAdminCommand = require('./commands/tagnotadmin');
const hideTagCommand = require('./commands/hidetag');
const jokeCommand = require('./commands/joke');
const quoteCommand = require('./commands/quote');
const factCommand = require('./commands/fact');
const weatherCommand = require('./commands/weather');
const newsCommand = require('./commands/news');
const kickCommand = require('./commands/kick');
const simageCommand = require('./commands/simage');
const attpCommand = require('./commands/attp');
const { startHangman, guessLetter } = require('./commands/hangman');
const { startTrivia, answerTrivia } = require('./commands/trivia');
const { complimentCommand } = require('./commands/compliment');
const { insultCommand } = require('./commands/insult');
const { eightBallCommand } = require('./commands/eightball');
const { lyricsCommand } = require('./commands/lyrics');
const { dareCommand } = require('./commands/dare');
const { truthCommand } = require('./commands/truth');
const { clearCommand } = require('./commands/clear');
const pingCommand = require('./commands/ping');
const aliveCommand = require('./commands/alive');
const blurCommand = require('./commands/img-blur');
const { welcomeCommand, handleJoinEvent } = require('./commands/welcome');
const { goodbyeCommand, handleLeaveEvent } = require('./commands/goodbye');
const githubCommand = require('./commands/github');
const { handleAntiBadwordCommand, handleBadwordDetection } = require('./lib/antibadword');
const antibadwordCommand = require('./commands/antibadword');
const { handleChatbotCommand, handleChatbotResponse } = require('./commands/chatbot');
const takeCommand = require('./commands/take');
const { flirtCommand } = require('./commands/flirt');
const characterCommand = require('./commands/character');
const wastedCommand = require('./commands/wasted');
const shipCommand = require('./commands/ship');
const groupInfoCommand = require('./commands/groupinfo');
const resetlinkCommand = require('./commands/resetlink');
const staffCommand = require('./commands/staff');
const unbanCommand = require('./commands/unban');
const emojimixCommand = require('./commands/emojimix');
const { handlePromotionEvent } = require('./commands/promote');
const { handleDemotionEvent } = require('./commands/demote');
const viewOnceCommand = require('./commands/viewonce');
const clearSessionCommand = require('./commands/clearsession');
const { autoStatusCommand, handleStatusUpdate } = require('./commands/autostatus');
const { simpCommand } = require('./commands/simp');
const { stupidCommand } = require('./commands/stupid');
const stickerTelegramCommand = require('./commands/stickertelegram');
const textmakerCommand = require('./commands/textmaker');
const { handleAntideleteCommand, handleMessageRevocation, storeMessage } = require('./commands/antidelete');
const clearTmpCommand = require('./commands/cleartmp');
const setProfilePicture = require('./commands/setpp');
const { setGroupDescription, setGroupName, setGroupPhoto } = require('./commands/groupmanage');
const instagramCommand = require('./commands/instagram');
const facebookCommand = require('./commands/facebook');
const spotifyCommand = require('./commands/spotify');
const playCommand = require('./commands/play');
const tiktokCommand = require('./commands/tiktok');
const songCommand = require('./commands/song');
const aiCommand = require('./commands/ai');
const urlCommand = require('./commands/url');
const { handleTranslateCommand } = require('./commands/translate');
const { handleSsCommand } = require('./commands/ss');
const { addCommandReaction, handleAreactCommand } = require('./lib/reactions');
const { goodnightCommand } = require('./commands/goodnight');
const { shayariCommand } = require('./commands/shayari');
const { rosedayCommand } = require('./commands/roseday');
const imagineCommand = require('./commands/imagine');
const videoCommand = require('./commands/video');
const sudoCommand = require('./commands/sudo');
const { miscCommand, handleHeart } = require('./commands/misc');
const { animeCommand } = require('./commands/anime');
const { piesCommand, piesAlias } = require('./commands/pies');
const stickercropCommand = require('./commands/stickercrop');
const updateCommand = require('./commands/update');
const removebgCommand = require('./commands/removebg');
const { reminiCommand } = require('./commands/remini');
const { igsCommand } = require('./commands/igs');
const { anticallCommand, readState: readAnticallState } = require('./commands/anticall');
const { pmblockerCommand, readState: readPmBlockerState } = require('./commands/pmblocker');
const settingsCommand = require('./commands/settings');
const soraCommand = require('./commands/sora');
const modeCommand = require('./commands/mode');
const toimgCommand = require('./commands/toimg');
const tourlCommand = require('./commands/tourl');
const ytsearchCommand = require('./commands/ytsearch');
const channelCommand = require('./commands/channel');
const newsletterCommand = require('./commands/newsletter');

// Global settings for CRUSH RAY
global.packname = "CRUSH RAY";
global.author = "PRESENTER RAY";
global.botname = "CRUSH RAY";
global.ownername = "PRESENTER RAY";
global.developer = "RAY";
global.ownernumber = "0794376595";
global.channelLink = "https://whatsapp.com/channel/0029VbCne5677qVRVvdVAn1b";
global.ytch = "PRESENTER RAY";
global.github = "https://github.com/yourusername/crush-ray-bot.git";

// Channel info for CRUSH RAY
const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: "0029VbCne5677qVRVvdVAn1b@newsletter",
            newsletterName: "CRUSH RAY UPDATES",
            serverMessageId: -1
        }
    }
};

// Make channelInfo globally available
global.channelInfo = channelInfo;

async function handleMessages(sock, messageUpdate, printLog) {
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;

        const message = messages[0];
        if (!message?.message) return;

        // REMOVED: handleAutoread

        // Store message for antidelete feature
        if (message.message) {
            storeMessage(sock, message);
        }

        // Handle message revocation (deleted messages)
        if (message.message?.protocolMessage?.type === 0) {
            await handleMessageRevocation(sock, message);
            return;
        }

        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');
        const senderIsSudo = await isSudo(senderId);
        const senderIsOwnerOrSudo = await isOwnerOrSudo(senderId, sock, chatId);

        // Handle button responses
        if (message.message?.buttonsResponseMessage) {
            const buttonId = message.message.buttonsResponseMessage.selectedButtonId;
            
            if (buttonId === 'channel') {
                await sock.sendMessage(chatId, {
                    text: `📢 *Join CRUSH RAY Channel:*\n${global.channelLink}`
                }, { quoted: message });
                return;
            } else if (buttonId === 'owner') {
                await ownerCommand(sock, chatId);
                return;
            } else if (buttonId === 'menu') {
                await helpCommand(sock, chatId, message, []);
                return;
            }
        }

        const userMessage = (
            message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            message.message?.buttonsResponseMessage?.selectedButtonId?.trim() ||
            ''
        ).toLowerCase().replace(/\.\s+/g, '.').trim();

        // Preserve raw message for commands that need original casing
        const rawText = message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            '';

        // Only log command usage
        if (userMessage.startsWith('.')) {
            console.log(`📝 Command used in ${isGroup ? 'group' : 'private'}: ${userMessage}`);
        }
        
        // Read bot mode
        let isPublic = true;
        try {
            const data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
            if (typeof data.isPublic === 'boolean') isPublic = data.isPublic;
        } catch (error) {
            isPublic = true;
        }
        
        const isOwnerOrSudoCheck = message.key.fromMe || senderIsOwnerOrSudo;
        
        // Check if user is banned
        if (isBanned(senderId) && !userMessage.startsWith('.unban')) {
            if (Math.random() < 0.1) {
                await sock.sendMessage(chatId, {
                    text: '❌ You are banned from using CRUSH RAY BOT. Contact an admin to get unbanned.',
                    ...channelInfo
                });
            }
            return;
        }

        // Check for game moves
        if (/^[1-9]$/.test(userMessage) || userMessage.toLowerCase() === 'surrender') {
            await handleTicTacToeMove(sock, chatId, senderId, userMessage);
            return;
        }

        // CRUSH RAY greeting in private chat
        if (!isGroup && (userMessage === 'hi' || userMessage === 'hello' || userMessage === 'crush' || userMessage === 'ray' || userMessage === 'bot' || userMessage === 'hey')) {
            await sock.sendMessage(chatId, {
                text: `💖 *CRUSH RAY BOT* 💖\n\nHi! I'm CRUSH RAY, your WhatsApp assistant.\n👤 Owner: PRESENTER RAY\n👨‍💻 Developer: RAY\n📞 Number: 0794376595\n📢 Channel: ${global.channelLink}\n🔧 Type *.menu* to see all 85+ commands!\n\nMade with 💖 by RAY`,
                ...channelInfo
            });
            return;
        }

        if (!message.key.fromMe) incrementMessageCount(chatId, senderId);

        // Check for bad words and antilink FIRST (moderation)
        if (isGroup) {
            if (userMessage) {
                await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
            }
            await Antilink(message, sock);
        }

        // PM blocker - block non-owner DMs when enabled
        if (!isGroup && !message.key.fromMe && !senderIsSudo) {
            try {
                const pmState = readPmBlockerState();
                if (pmState.enabled) {
                    await sock.sendMessage(chatId, { text: pmState.message || 'Private messages are blocked. Please contact the owner in groups only.' });
                    await new Promise(r => setTimeout(r, 1500));
                    try { await sock.updateBlockStatus(chatId, 'block'); } catch (e) { }
                    return;
                }
            } catch (e) { }
        }

        // Check for command prefix
        if (!userMessage.startsWith('.')) {
            // REMOVED: handleAutotypingForMessage

            if (isGroup) {
                await handleTagDetection(sock, chatId, message, senderId);
                await handleMentionDetection(sock, chatId, message);

                if (isPublic || isOwnerOrSudoCheck) {
                    await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                }
            }
            return;
        }
        
        // In private mode, only owner/sudo can run commands
        if (!isPublic && !isOwnerOrSudoCheck) {
            return;
        }

        // List of admin commands
        const adminCommands = ['.mute', '.unmute', '.ban', '.unban', '.promote', '.demote', '.kick', '.tagall', '.tagnotadmin', '.hidetag', '.antilink', '.antitag', '.antibadword', '.setgdesc', '.setgname', '.setpp', '.resetlink'];
        const isAdminCommand = adminCommands.some(cmd => userMessage.startsWith(cmd));

        // List of owner commands
        const ownerCommands = ['.mode', '.autostatus', '.antidelete', '.cleartmp', '.setpp', '.clearsession', '.areact', '.autoreact', '.pmblocker', '.anticall', '.sudo', '.update'];
        const isOwnerCommand = ownerCommands.some(cmd => userMessage.startsWith(cmd));

        let isSenderAdmin = false;
        let isBotAdmin = false;

        // Check admin status for admin commands in groups
        if (isGroup && isAdminCommand) {
            const adminStatus = await isAdmin(sock, chatId, senderId);
            isSenderAdmin = adminStatus.isSenderAdmin;
            isBotAdmin = adminStatus.isBotAdmin;

            if (!isBotAdmin) {
                await sock.sendMessage(chatId, { text: '❌ Please make the bot an admin to use admin commands.', ...channelInfo }, { quoted: message });
                return;
            }

            if (userMessage.startsWith('.mute') || userMessage === '.unmute' ||
                userMessage.startsWith('.ban') || userMessage.startsWith('.unban') ||
                userMessage.startsWith('.promote') || userMessage.startsWith('.demote') ||
                userMessage.startsWith('.kick')) {
                if (!isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, {
                        text: '❌ Sorry, only group admins can use this command.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
            }
        }

        // Check owner status for owner commands
        if (isOwnerCommand) {
            if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                await sock.sendMessage(chatId, { text: '❌ This command is only available for the owner or sudo!' }, { quoted: message });
                return;
            }
        }

        // Split command and args
        const args = rawText.trim().split(/\s+/);
        const command = args[0].toLowerCase();
        const commandArgs = args.slice(1);

        // ========== ALL COMMAND HANDLERS ==========
        
        // 📱 GENERAL COMMANDS
        if (command === '.menu' || command === '.help') {
            await helpCommand(sock, chatId, message, commandArgs);
        }
        else if (command === '.ping') {
            await pingCommand(sock, chatId, message);
        }
        else if (command === '.alive') {
            await aliveCommand(sock, chatId);
        }
        else if (command === '.owner') {
            await ownerCommand(sock, chatId);
        }
        else if (command === '.github') {
            await githubCommand(sock, chatId);
        }
        else if (command === '.channel') {
            await channelCommand(sock, chatId);
        }
        else if (command === '.newsletter') {
            await newsletterCommand(sock, chatId);
        }
        else if (command === '.mode') {
            await modeCommand(sock, chatId, commandArgs, message.key.fromMe || senderIsOwnerOrSudo);
        }
        
        // 🛠️ MODERATION COMMANDS
        else if (command === '.ban') {
            await banCommand(sock, chatId, message);
        }
        else if (command === '.unban') {
            await unbanCommand(sock, chatId, message);
        }
        else if (command === '.warn') {
            await warnCommand(sock, chatId, message);
        }
        else if (command === '.warnings') {
            await warningsCommand(sock, chatId, message);
        }
        else if (command === '.kick') {
            const mentionedJidListKick = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            await kickCommand(sock, chatId, senderId, mentionedJidListKick, message);
        }
        else if (command === '.promote') {
            const mentionedJidListPromote = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            await promoteCommand(sock, chatId, senderId, mentionedJidListPromote, message);
        }
        else if (command === '.demote') {
            const mentionedJidListDemote = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            await demoteCommand(sock, chatId, senderId, mentionedJidListDemote, message);
        }
        else if (command === '.mute') {
            const muteDuration = commandArgs[0] ? parseInt(commandArgs[0]) : undefined;
            if (commandArgs[0] && (isNaN(muteDuration) || muteDuration <= 0)) {
                await sock.sendMessage(chatId, { text: '❌ Please provide a valid number of minutes.', ...channelInfo }, { quoted: message });
            } else {
                await muteCommand(sock, chatId, senderId, message, muteDuration);
            }
        }
        else if (command === '.unmute') {
            await unmuteCommand(sock, chatId, senderId);
        }
        else if (command === '.tagall') {
            await tagAllCommand(sock, chatId, message, isGroup);
        }
        else if (command === '.hidetag') {
            await hideTagCommand(sock, chatId, message, isGroup, commandArgs);
        }
        else if (command === '.tagnotadmin') {
            await tagNotAdminCommand(sock, chatId, isGroup);
        }
        else if (command === '.delete') {
            await deleteCommand(sock, chatId, message, isGroup);
        }
        else if (command === '.clear') {
            await clearCommand(sock, chatId, isGroup, isSenderAdmin, isBotAdmin);
        }
        else if (command === '.resetlink') {
            await resetlinkCommand(sock, chatId, isGroup, isSenderAdmin, isBotAdmin);
        }
        
        // 🔗 ANTI-SPAM COMMANDS
        else if (command === '.antilink') {
            await handleAntilinkCommand(sock, chatId, commandArgs, isGroup, isSenderAdmin);
        }
        else if (command === '.antitag') {
            await handleAntitagCommand(sock, chatId, commandArgs, isGroup, isSenderAdmin);
        }
        else if (command === '.antibadword') {
            await antibadwordCommand(sock, chatId, commandArgs, isGroup, isSenderAdmin);
        }
        else if (command === '.anticall') {
            await anticallCommand(sock, chatId, commandArgs, isGroup, message.key.fromMe || senderIsOwnerOrSudo);
        }
        else if (command === '.pmblocker') {
            await pmblockerCommand(sock, chatId, commandArgs, isGroup, message.key.fromMe || senderIsOwnerOrSudo);
        }
        else if (command === '.antidelete') {
            await handleAntideleteCommand(sock, chatId, commandArgs, message.key.fromMe || senderIsOwnerOrSudo);
        }
        
        // 🎨 MEDIA COMMANDS
        else if (command === '.sticker') {
            await stickerCommand(sock, chatId, message, commandArgs, isGroup, senderId);
        }
        else if (command === '.toimg') {
            await toimgCommand(sock, chatId, message);
        }
        else if (command === '.tourl') {
            await tourlCommand(sock, chatId, message);
        }
        else if (command === '.attp') {
            await attpCommand(sock, chatId, commandArgs);
        }
        else if (command === '.emojimix') {
            await emojimixCommand(sock, chatId, commandArgs);
        }
        else if (command === '.take') {
            await takeCommand(sock, chatId, message, commandArgs);
        }
        else if (command === '.simage') {
            const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (quotedMessage?.stickerMessage) {
                await simageCommand(sock, quotedMessage, chatId);
            } else {
                await sock.sendMessage(chatId, { text: '❌ Please reply to a sticker with .simage to convert it.', ...channelInfo }, { quoted: message });
            }
        }
        
        // 🎵 DOWNLOADER COMMANDS
        else if (command === '.play') {
            await playCommand(sock, chatId, message, commandArgs);
        }
        else if (command === '.song') {
            await songCommand(sock, chatId, message, commandArgs);
        }
        else if (command === '.ytsearch') {
            await ytsearchCommand(sock, chatId, commandArgs);
        }
        else if (command === '.instagram') {
            await instagramCommand(sock, chatId, commandArgs);
        }
        else if (command === '.facebook') {
            await facebookCommand(sock, chatId, commandArgs);
        }
        else if (command === '.tiktok') {
            await tiktokCommand(sock, chatId, commandArgs);
        }
        else if (command === '.spotify') {
            await spotifyCommand(sock, chatId, commandArgs);
        }
        
        // 🤖 AI COMMANDS
        else if (command === '.ai') {
            await aiCommand(sock, chatId, message, commandArgs);
        }
        else if (command === '.chatbot') {
            await handleChatbotCommand(sock, chatId, commandArgs, isGroup, message.key.fromMe || senderIsOwnerOrSudo);
        }
        else if (command === '.imagine') {
            await imagineCommand(sock, chatId, commandArgs);
        }
        else if (command === '.tts') {
            await ttsCommand(sock, chatId, commandArgs);
        }
        else if (command === '.translate') {
            await handleTranslateCommand(sock, chatId, commandArgs);
        }
        
        // 📰 UTILITY COMMANDS
        else if (command === '.weather') {
            await weatherCommand(sock, chatId, commandArgs);
        }
        else if (command === '.news') {
            await newsCommand(sock, chatId);
        }
        else if (command === '.fact') {
            await factCommand(sock, chatId);
        }
        else if (command === '.joke') {
            await jokeCommand(sock, chatId);
        }
        else if (command === '.quote') {
            await quoteCommand(sock, chatId);
        }
        else if (command === '.lyrics') {
            await lyricsCommand(sock, chatId, commandArgs);
        }
        
        // 💖 FUN COMMANDS
        else if (command === '.flirt') {
            await flirtCommand(sock, chatId, message);
        }
        else if (command === '.compliment') {
            await complimentCommand(sock, chatId, message);
        }
        else if (command === '.insult') {
            await insultCommand(sock, chatId, message);
        }
        else if (command === '.truth') {
            await truthCommand(sock, chatId, message);
        }
        else if (command === '.dare') {
            await dareCommand(sock, chatId, message);
        }
        else if (command === '.ship') {
            await shipCommand(sock, chatId, message);
        }
        else if (command === '.simp') {
            await simpCommand(sock, chatId, message);
        }
        else if (command === '.stupid') {
            await stupidCommand(sock, chatId, message);
        }
        else if (command === '.8ball') {
            await eightBallCommand(sock, chatId, commandArgs);
        }
        else if (command === '.meme') {
            await memeCommand(sock, chatId);
        }
        
        // 👥 GROUP INFO COMMANDS
        else if (command === '.groupinfo') {
            await groupInfoCommand(sock, chatId, isGroup);
        }
        else if (command === '.staff') {
            await staffCommand(sock, chatId, isGroup);
        }
        else if (command === '.topmembers') {
            await topMembers(sock, chatId, commandArgs);
        }
        
        // 🎮 GAME COMMANDS
        else if (command === '.tictactoe') {
            await tictactoeCommand(sock, chatId, senderId, commandArgs);
        }
        
        // ⚙️ AUTO SETTINGS COMMANDS
        else if (command === '.autostatus') {
            await autoStatusCommand(sock, chatId, commandArgs, message.key.fromMe || senderIsOwnerOrSudo);
        }
        else if (command === '.cleartmp') {
            await clearTmpCommand(sock, chatId);
        }
        else if (command === '.clearsession') {
            await clearSessionCommand(sock, chatId);
        }
        
        // Unknown command
        else if (userMessage.startsWith('.')) {
            await sock.sendMessage(chatId, {
                text: `❌ Unknown command: ${command}\n\nType .menu to see all 85+ commands available.\n\n💖 *CRUSH RAY BOT*`,
                ...channelInfo
            }, { quoted: message });
        }

    } catch (err) {
        console.error('Error in handleMessages:', err);
        try {
            if (message?.key?.remoteJid) {
                await sock.sendMessage(message.key.remoteJid, {
                    text: '❌ An error occurred while processing your command. Please try again later.\n\n💖 *CRUSH RAY BOT*',
                    ...channelInfo
                });
            }
        } catch (e) {}
    }
}

async function handleGroupParticipantUpdate(sock, update) {
    try {
        const { id, participants, action } = update;
        
        if (action === 'add') {
            for (const participant of participants) {
                const welcomeText = `💖 *WELCOME TO CRUSH RAY BOT GROUP* 💖\n\n@${participant.split('@')[0]}\n\nWelcome to the group! Enjoy using CRUSH RAY bot.\nType .menu to see all 85+ commands.\n\n📢 Channel: ${global.channelLink}\n\nMade with 💖 by PRESENTER RAY`;
                await sock.sendMessage(id, { text: welcomeText, mentions: [participant], ...channelInfo });
            }
        }
        
        if (action === 'remove') {
            for (const participant of participants) {
                const goodbyeText = `👋 Goodbye @${participant.split('@')[0]}! We'll miss you!\n\n💖 *CRUSH RAY BOT*`;
                await sock.sendMessage(id, { text: goodbyeText, mentions: [participant], ...channelInfo });
            }
        }
        
        if (action === 'promote') {
            for (const participant of participants) {
                const promoteText = `👑 @${participant.split('@')[0]} has been promoted to admin!\n\n💖 *CRUSH RAY BOT*`;
                await sock.sendMessage(id, { text: promoteText, mentions: [participant], ...channelInfo });
            }
        }
        
        if (action === 'demote') {
            for (const participant of participants) {
                const demoteText = `📉 @${participant.split('@')[0]} has been demoted from admin!\n\n💖 *CRUSH RAY BOT*`;
                await sock.sendMessage(id, { text: demoteText, mentions: [participant], ...channelInfo });
            }
        }
    } catch (err) {
        console.error('Error in handleGroupParticipantUpdate:', err);
    }
}

async function handleStatus(sock, statusUpdate) {
    try {
        const autoStatusConfig = JSON.parse(fs.readFileSync('./data/autoStatus.json'));
        if (autoStatusConfig.enabled) {
            if (statusUpdate.messages) {
                for (const msg of statusUpdate.messages) {
                    if (msg.key && msg.key.remoteJid === 'status@broadcast') {
                        await sock.readMessages([msg.key]);
                    }
                }
            }
        }
    } catch (err) {
        // Silently fail
    }
}

module.exports = { handleMessages, handleGroupParticipantUpdate, handleStatus };
