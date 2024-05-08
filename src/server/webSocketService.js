const socketIo = require('socket.io')

let io;
const userSockets = new Map()

const initializeWebSocket = (server) => {
    io = socketIo(server)

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
            }
        })
        
    })
}

module.exports = {
    initializeWebSocket,
}