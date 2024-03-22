const express = require('express');
const path = require('path');
const fileURLToPath =  require('url');
const usersRoutes = require('./routes/usersRoutes.js')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('dist'));

app.use(express.json());
app.use('/api', usersRoutes);

app.get('*', (req, res) => {
    const indexFilePath = path.resolve(__dirname, '../dist', 'index.html');
    res.sendFile(indexFilePath)
})

app.listen(port, () => {
  console.log(`Aplikacja działa na http://localhost:${port}`);
});
