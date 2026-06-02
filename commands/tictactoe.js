const { TicTacToe } = require('../lib/tictactoe');

const games = new Map();

async function tictactoeCommand(sock, chatId, senderId, args) {
    if (args[0] === 'end') {
        if (games.has(chatId)) {
            games.delete(chatId);
            await sock.sendMessage(chatId, { text: '🎮 Game ended!', ...global.channelInfo });
        } else {
            await sock.sendMessage(chatId, { text: '❌ No active game in this chat!', ...global.channelInfo });
        }
        return;
    }
    
    if (games.has(chatId)) {
        await sock.sendMessage(chatId, { text: '❌ A game is already in progress!', ...global.channelInfo });
        return;
    }
    
    const game = new TicTacToe(senderId);
    games.set(chatId, game);
    
    const board = game.displayBoard();
    await sock.sendMessage(chatId, { 
        text: `🎮 *TIC TAC TOE* 🎮\n\n${board}\n\nYour turn! Use numbers 1-9 to place your move.\nType "surrender" to give up.\n\n💖 *CRUSH RAY BOT*`,
        ...global.channelInfo 
    });
}

async function handleTicTacToeMove(sock, chatId, senderId, move) {
    const game = games.get(chatId);
    if (!game) return false;
    
    if (game.turn !== senderId) {
        await sock.sendMessage(chatId, { text: '❌ Not your turn!', ...global.channelInfo });
        return true;
    }
    
    if (move.toLowerCase() === 'surrender') {
        games.delete(chatId);
        await sock.sendMessage(chatId, { text: `🏳️ ${senderId.split('@')[0]} surrendered! Game ended.`, ...global.channelInfo });
        return true;
    }
    
    const position = parseInt(move) - 1;
    if (isNaN(position) || position < 0 || position > 8) {
        await sock.sendMessage(chatId, { text: '❌ Invalid move! Use numbers 1-9.', ...global.channelInfo });
        return true;
    }
    
    const result = game.makeMove(position);
    
    if (!result) {
        await sock.sendMessage(chatId, { text: '❌ That position is already taken!', ...global.channelInfo });
        return true;
    }
    
    const board = game.displayBoard();
    
    if (game.winner) {
        games.delete(chatId);
        await sock.sendMessage(chatId, { 
            text: `🎉 *GAME OVER!* 🎉\n\n${board}\n\n🏆 Winner: @${game.winner.split('@')[0]}!\n\n💖 *CRUSH RAY BOT*`,
            mentions: [game.winner],
            ...global.channelInfo 
        });
    } else if (game.gameEnd) {
        games.delete(chatId);
        await sock.sendMessage(chatId, { 
            text: `🤝 *DRAW!*\n\n${board}\n\nGame ended in a tie!\n\n💖 *CRUSH RAY BOT*`,
            ...global.channelInfo 
        });
    } else {
        await sock.sendMessage(chatId, { 
            text: `${board}\n\n@${game.turn.split('@')[0]}'s turn!\n\n💖 *CRUSH RAY BOT*`,
            mentions: [game.turn],
            ...global.channelInfo 
        });
    }
    
    return true;
}

module.exports = { tictactoeCommand, handleTicTacToeMove };