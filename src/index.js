const express = require('express');
const path = require('path');
const fileURLToPath =  require('url');
const usersRoutes = require('./routes/usersRoutes.js')
const boardRoutes = require('./routes/boardRoutes.js')
const cookieParser = require('cookie-parser')
const socketIo = require('socket.io'); // Importujemy socket.io

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static('dist'));

app.use(express.json());
app.use('/api', usersRoutes);
app.use('/api', boardRoutes);

app.get('*', (req, res) => {
    const indexFilePath = path.resolve(__dirname, '../dist', 'index.html');
    res.sendFile(indexFilePath)
})

const server = app.listen(port, () => {
  console.log(`Aplikacja działa na http://localhost:${port}`);
});

// Połączenie z Socket.io
const io = socketIo(server);

// Obsługa połączeń Socket.io
io.on('connection', (socket) => {
    console.log('Nowe połączenie WebSocket.');

    // Obsługa zdarzenia 'example'
    socket.on('example', (data) => {
        console.log('Otrzymano dane:', data);
        // Tutaj możesz wykonać odpowiednie akcje w zależności od otrzymanych danych
    });

    // Obsługa rozłączenia klienta
    socket.on('disconnect', () => {
        console.log('Klient rozłączony');
    });
});

app.get('*', (req, res) => {
    const indexFilePath = path.resolve(__dirname, '../dist', 'index.html');
    res.sendFile(indexFilePath);
});