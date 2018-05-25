const express = require('express');
const { urlencoded } = require('body-parser');

const app = express();

app.use(urlencoded({ extended: false }));

app.get('/chia/:soA/:soB', (req, res) => {
    const { soA, soB } = req.params;
    if (isNaN(soA) || isNaN(soB)) {
        return res.status(400).send({ success: false, message: 'INVALID_TYPE' });
    }
    if (soB == 0) {
        return res.status(400).send({ success: false, message: 'DIVIDE_BY_ZERO' });
    }
    const result = +soA / +soB;
    res.status(200).send({ success: true, result });
});

app.post('/chia', (req, res) => {
    const { soA, soB } = req.body;
    if (isNaN(soA) || isNaN(soB)) {
        return res.status(400).send({ success: false, message: 'INVALID_TYPE' });
    }
    if (soB == 0) {
        return res.status(400).send({ success: false, message: 'DIVIDE_BY_ZERO' });
    }
    const result = +soA / +soB;
    res.status(200).send({ success: true, result });
});

module.exports = { app };
