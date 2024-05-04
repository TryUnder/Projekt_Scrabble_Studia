// Importowanie modułu Socket.io
const io = require("socket.io-client");

// Połączenie z serwerem WebSocket
const socket = io("http://localhost:3000");

// Obsługa zdarzenia 'connect'
socket.on('connect', () => {
    console.log('Połączono z serwerem WebSocket');
    
    // Wysłanie przykładowej wiadomości na serwer
    socket.emit('example', { message: 'To jest przykładowa wiadomość' });
});

// Obsługa zdarzenia 'exampleResponse'
socket.on('exampleResponse', (data) => {
    console.log('Otrzymano odpowiedź:', data);
});

// Obsługa zdarzenia 'disconnect'
socket.on('disconnect', () => {
    console.log('Rozłączono z serwerem WebSocket');
});
