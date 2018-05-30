const express = require('express');
const { json } = require('body-parser');
const { UserService } = require('./services/user.service');
const { User } = require('./models/user.model');

const app = express();
app.use(json());

app.get('/user', (req, res) => {
    User.find({})
    .then(users => res.send({ success: true, users }));
});

app.post('/user/signup', async (req, res) => {
    const { name, email, password } = req.body;
    UserService.signUp(name, email, password)
    .then(user => res.send({ success: true, user }))
    .catch(error => res.send({ success: false, message: error.message }));
});

app.post('/user/signin', async (req, res) => {
    const { email, password } = req.body;
    UserService.signIn(email, password)
    .then(user => res.send({ success: true, user }))
    .catch(error => res.send({ success: false, message: error.message }));
});

module.exports = { app };

// npm intellisense
// path intellisense
