// CRUSH RAY BOT - Help Command
const fs = require('fs');

module.exports = async (sock, chatId, message, args) => {
    const helpText = `💖 *CRUSH RAY BOT - HELP MENU* 💖

━━━━━━━━━━━━━━━━━━━━━━━━
👤 *OWNER:* PRESENTER RAY
👨‍💻 *DEVELOPER:* RAY
📞 *NUMBER:* 0757829372
━━━━━━━━━━━━━━━━━━━━━━━━

📱 *GENERAL COMMANDS*
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
.menu - Show this menu
.ping - Check bot response
.alive - Bot status
.owner - Contact owner
.mode - Toggle public/private

🎮 *GAME COMMANDS*
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
.tictactoe - Play Tic Tac Toe
.surrender - Surrender game
.hangman - Play Hangman
.trivia - Answer trivia
.ship @user - Ship compatibility

🛠️ *MODERATION COMMANDS*
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
.ban @user - Ban user
.unban @user - Unban user
.warn @user - Warn user
.warnings @user - Check warnings
.kick @user - Kick from group
.promote @user - Make admin
.demote @user - Remove admin
.mute [minutes] - Mute group
.unmute - Unmute group
.tagall - Tag all members
.hidetag - Hidden tag all
.tagnotadmin - Tag non-admins

🔗 *ANTI-LINK & SECURITY*
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
.antilink on/off - Block links
.antitag on/off - Block mass tags
.antibadword on/off - Block bad words
.anticall on/off - Block calls
.pmblocker on/off - Block private messages

🎨 *MEDIA CONVERTER*
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
.sticker - Image/Video to sticker
.toimg - Sticker to image
.tourl - Upload to URL
.take - Packname & author
.emojimix 🐱+🐶 - Mix emojis
.attp text - Text to sticker

🎵 *DOWNLOADERS*
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
.play song name - Download music
.song song name - Get audio
.ytsearch query - Search YouTube
.instagram url - Download IG
.facebook url - Download FB
.tiktok url - Download TT
.spotify url - Download Spotify

✨ *AI & UTILITIES*
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
.ai question - Ask AI
.chatbot on/off - Toggle AI chat
.imagine prompt - Generate image
.tts text - Text to speech
.translate lang text - Translate
.weather city - Weather info
.news - Latest news
.fact - Random fact
.joke - Random joke
.quote - Random quote

👥 *GROUP INFO*
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
.groupinfo - Group details
.staff - List admins
.topmembers - Active members
.resetlink - Reset invite link
.setgdesc text - Set description
.setgname name - Set group name
.setpp - Set group photo

💖 *FUN COMMANDS*
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
.flirt @user - Flirt with user
.compliment @user - Give compliment
.insult @user - Playful insult
.truth - Truth question
.dare - Dare challenge
.simp - Simp percentage
.stupid - Stupidity check

━━━━━━━━━━━━━━━━━━━━━━━━
💖 *CRUSH RAY BOT* 
*Your Best WhatsApp Assistant!* 💖

Type any command to use it!
Made with 💖 by PRESENTER RAY`;

    await sock.sendMessage(chatId, { text: helpText, ...global.channelInfo });
};