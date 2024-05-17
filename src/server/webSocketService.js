const socketIo = require('socket.io')
const Board = require('../models/boardModel')
const GameStateManager = require('./GameStateManager')

let io;
const userSockets = new Map()
let boardDataToSend = new Array(15).fill(null).map(() => new Array(15).fill(null)) 
let newTurn = ''
let playerArrayLetters = []

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
            let letter = null
            for (let i = 0; i < numberLetterToFetch; i++) {        
                letter = gameStateManager.initializeLetter()

                if (letter !== null) {
                    playerArrayLetters.push(letter)
                }

            }

            //console.log("Map: ", gameStateManager.letterMap)
            console.log("array first: ", gameStateManager.playerFirstLetters)
            console.log("array second: ", gameStateManager.playerSecondLetters)
            
            if (letter !== null) {
                const map = gameStateManager.letterMap
                const letterMapJSON = JSON.stringify(map)
                //console.log("letter map json: ", letterMapJSON)
                io.emit('getPlayerLetters', { playerLogin, playerArrayLetters })
                playerArrayLetters = []
            }
        })

        socket.on('increaseLetterCount', (arrayBcgCopy) => {
            console.log("letter map przed: ", gameStateManager.letterMap)
            for (let i = 0; i < arrayBcgCopy.length; i++) {
                const count = gameStateManager.letterMap.get(arrayBcgCopy[i]).count
                if (count >= 0) {
                    gameStateManager.letterMap.get(arrayBcgCopy[i]).count += 1
                }
            }
            console.log("letter map po: ", gameStateManager.letterMap)
        })

        socket.on('boardSend', ({boardData, newTurn}) => {
            boardDataToSend = boardData
            newTurn = newTurn
            io.emit('boardReceive', { boardDataToSend, newTurn })
        })

        socket.on('emitNewTurn', newTurn => {
            io.emit('receiveNewTurn', newTurn)
        })

        socket.on('punktyPierwszego', (firstUserPointsCopy) => {
            console.log("Punkty pierwszego odebrane po stronie serwera: ", firstUserPointsCopy)
            io.emit('otrzymanePunktyPierwszego', firstUserPointsCopy)
        })

        socket.on('punktyDrugiego', (secondUserPointsCopy) => {
            console.log("Punkty drugiego odebrane po stronie serwera: ", secondUserPointsCopy)
            io.emit('otrzymanePunktyDrugiego', secondUserPointsCopy)
        })

        socket.on('sendMessage', ({message, playerLogin}) => {
            const newMessage = {
                sender: playerLogin, 
                text: message,
                date: new Date().toLocaleString()
            };
            socket.broadcast.emit('receiveMessage', newMessage); 
            socket.emit('receiveMessage', { ...newMessage, playerLogin }); 
        });
    })
}

module.exports = {
    initializeWebSocket,
}