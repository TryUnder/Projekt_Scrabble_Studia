const socketIo = require('socket.io')

let io;
const loggedInUsers = []

const initializeWebSocket = (server) => {
    io = socketIo(server)
    const loggedInUser = []

    io.on('connection', (socket) => {

        socket.emit('loggedInUsers', loggedInUsers)

        socket.on('disconnect', () => {
        })

        socket.on('userLogout', (userLogin) => {
            const index = loggedInUsers.indexOf(userLogin)
            if (index !== -1) {
                loggedInUsers.splice(index, 1)
            }
        })
    })
}

const emitLoggedInUser = (userLogin) => {
    loggedInUsers.push(userLogin)
    io.emit('loggedInUsers', loggedInUsers)
}

module.exports = {
    initializeWebSocket,
    emitLoggedInUser
}