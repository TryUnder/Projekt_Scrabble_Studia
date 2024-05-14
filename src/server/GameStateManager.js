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

    initializeLetter() {
        if (this.letterMap.size <= 0) {
            return null
        }

        const randomNumber = Math.floor(Math.random() * this.letterMap.size)
        const randomLetter = Array.from(this.letterMap.keys())[randomNumber]

        const letterCount = this.letterMap.get(randomLetter).count
        if (letterCount <= 0) {
            return this.initializeLetter()
        }

        this.letterMap.get(randomLetter).count = letterCount - 1
        return randomLetter
    }
}

module.exports = GameStateManager;