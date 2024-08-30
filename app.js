const express = require('express');
const verifySignature = require('./middlewares/verifySignature');
const app = express();

const PORT = 3000;

app.use(express.json());

app.get('/webhook', (req, res) => res.status(200).json('OK'));
app.post('/webhook', verifySignature, async (req, res) => res.status(200).json('OK'));

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
