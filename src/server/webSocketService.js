const socketIo = require('socket.io')

let io;
const userSockets = new Map()

const initializeWebSocket = (server) => {
    io = socketIo(server)

    io.on('connection', (socket) => {
        socket.emit('loggedInUsers', Array.from(userSockets.keys()))

        socket.on('userLogin', (userLogin) => {
            console.log("socket: ", socket.id)
            userSockets.set(userLogin, socket.id)
            console.log("User Sockets: ", userSockets)
            io.emit('loggedInUsers', Array.from(userSockets.keys()))
        })

        socket.on('userLogout', (userLogin) => {
            if (userSockets.has(userLogin)) {
                userSockets.delete(userLogin)
            }
            io.emit('loggedInUsers', Array.from(userSockets.keys()))
        })

        socket.on('gameRequest', ({ language, time, board, player }) => {
            console.log("test before")
            if (userSockets.has(player)) {
                console.log("test after")
                const playerSocketId = userSockets.get(player);
                io.to(playerSocketId).emit('gameAccept', { language, time, board, player: socket.id })
            }
        })
        
    })
}

module.exports = {
    initializeWebSocket,
}