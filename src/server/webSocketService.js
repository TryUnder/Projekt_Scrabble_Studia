const socketIo = require('socket.io')

let io;
const loggedInUsers = []

const initializeWebSocket = (server) => {
    io = socketIo(server)
    const loggedInUser = []

    io.on('connection', (socket) => {
        console.log("Nowe połączenie WebSocket.")

        socket.on('disconnect', () => {
            console.log("Klient rozłączony")
        })
    })
}

const emitLoggedInUser = (userLogin) => {
    console.log("Nowy uzytkownik zalogowany!")
    loggedInUsers.push(userLogin)
    console.log("uzytkownicy: ", loggedInUsers)
    io.emit('loggedInUser', loggedInUsers)
}

module.exports = {
    initializeWebSocket,
    emitLoggedInUser
}