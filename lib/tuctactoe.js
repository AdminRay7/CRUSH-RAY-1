class TicTacToe {
    constructor(owner) {
        this.owner = owner;
        this.turn = owner;
        this.board = Array(9).fill(null);
        this.winner = null;
        this.gameEnd = false;
    }

    makeMove(position) {
        if (this.winner || this.gameEnd) return false;
        if (this.board[position] !== null) return false;
        
        this.board[position] = this.turn;
        
        this.checkWinner();
        
        if (!this.winner && !this.gameEnd) {
            this.turn = this.turn === this.owner ? null : this.owner;
        }
        
        return true;
    }

    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.winner = this.board[a];
                this.gameEnd = true;
                return;
            }
        }
        
        if (!this.board.includes(null)) {
            this.gameEnd = true;
        }
    }

    displayBoard() {
        let display = '';
        for (let i = 0; i < 9; i++) {
            const mark = this.board[i] === this.owner ? '❌' : this.board[i] === null ? '⬜' : '⭕';
            display += mark;
            if ((i + 1) % 3 === 0) display += '\n';
        }
        return display;
    }
}

module.exports = { TicTacToe };