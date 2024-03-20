import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;

// Obsługa plików statycznych
app.use(express.static('dist'));


app.get('*', (req, res) => {
  res.sendFile(path.resolve('dist','index.html'))
})

app.listen(port, () => {
  console.log(`Aplikacja działa na http://localhost:${port}`);
});
