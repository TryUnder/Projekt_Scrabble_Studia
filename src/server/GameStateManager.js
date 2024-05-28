class GameStateManager {
    constructor(letterMap) {
        this.letterMap = letterMap;
        this.player1 = ''
        this.player2 = ''
        this.playerFirstLetters = []
        this.playerSecondLetters = []
    }

    setPlayer1(player1) {
        this.player1 = player1;
    }

    setPlayer2(player2) {
        this.player2 = player2;
    }

    PrintLetterMap() {
        //console.log("Letter Mapxx: ", this.letterMap);
    }

    PrintPlayers() {
        //console.log("Player 1: ", this.player1, " Player 2: ", this.player2);
    }

    getLetterMap() {
        return this.letterMap
    }

    getAvailableLetters() {
        return Array.from(this.letterMap.entries()).filter(([letter, data]) => data.count > 0);
    }

    initializeLetter() {
        const availableLetters = this.getAvailableLetters();
    
        if (availableLetters.length === 0) {
            return null;
        }
    
        const randomIndex = Math.floor(Math.random() * availableLetters.length);
        const [randomLetter, letterData] = availableLetters[randomIndex];
    
        this.letterMap.get(randomLetter).count -= 1;
        return randomLetter;
    }
}

module.exports = GameStateManager;