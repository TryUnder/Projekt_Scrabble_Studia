const express = require('express');
const path = require('path');
const fileURLToPath =  require('url');
const usersRoutes = require('../routes/usersRoutes.js')
const boardRoutes = require('../routes/boardRoutes.js')
const webSocketService = require('../server/webSocketService.js')

const cookieParser = require('cookie-parser')
const { isObject } = require('util');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static('dist'));

app.use(express.json());
app.use('/api', usersRoutes);
app.use('/api', boardRoutes);

app.get('*', (req, res) => {
    const indexFilePath = path.resolve(__dirname, '../../dist', 'index.html');
    res.sendFile(indexFilePath)
})

const server = app.listen(port, () => {
  console.log(`Aplikacja działa na http://localhost:${port}`);
});

webSocketService.initializeWebSocket(server)