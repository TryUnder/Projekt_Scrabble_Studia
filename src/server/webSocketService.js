const socketIo = require('socket.io')
const Board = require('../models/boardModel')
const GameStateManager = require('./GameStateManager')

let io;
const userSockets = new Map()

const initializeLetterMap = () => {
    return Board.initializeLetterMap()
}

const initializeWebSocket = (server) => {
    io = socketIo(server)
    const gameStateManager = new GameStateManager(initializeLetterMap())
    gameStateManager.PrintLetterMap()

    io.on('connection', (socket) => {
        socket.emit('loggedInUsers', Array.from(userSockets.keys()))

        socket.on('userLogin', (userLogin) => {
            userSockets.set(userLogin, socket.id)
            io.emit('loggedInUsers', Array.from(userSockets.keys()))
        })

        socket.on('userLogout', (userLogin) => {
            if (userSockets.has(userLogin)) {
                userSockets.delete(userLogin)
            }
            io.emit('loggedInUsers', Array.from(userSockets.keys()))
        })

        socket.on('gameRequest', ({ language, time, board, receiverPlayer, senderPlayer }) => {
            if (userSockets.has(receiverPlayer)) {
                io.to(userSockets.get(receiverPlayer)).emit('gameAccept', { language, time, board, receiverPlayer, senderPlayer })
            }
        })

        socket.on('acceptedProposal', ({ receiverPlayer, senderPlayer, time }) => {
            if (userSockets.has(senderPlayer)) {
                io.emit('senderPlayerNavigate', { receiverPlayer, senderPlayer, time })
                gameStateManager.setPlayer1(senderPlayer)
                gameStateManager.setPlayer2(receiverPlayer)
                //gameStateManager.PrintPlayers()
            }
        })

        socket.on('initializePlayerLetters', (playerLogin, numberLetterToFetch) => {
            let playerArrayLetters = []
            let letter = null
            for (let i = 0; i < numberLetterToFetch; i++) {        
                letter = gameStateManager.initializeLetter()

                playerArrayLetters = gameStateManager.player1 === playerLogin ? gameStateManager.playerFirstLetters : gameStateManager.playerSecondLetters
                if (letter !== null) {
                    playerArrayLetters.push(letter)
                }

            }

            console.log("Map: ", gameStateManager.letterMap)
            console.log("array first: ", gameStateManager.playerFirstLetters)
            console.log("array second: ", gameStateManager.playerSecondLetters)
            if (letter !== null)
                io.emit('getPlayerLetters', { playerLogin, playerArrayLetters })
        })
        
    })
}

module.exports = {
    initializeWebSocket,
}