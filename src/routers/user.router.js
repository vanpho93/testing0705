const express = require('express');
const { UserService } = require('../services/user.service');
const { User } = require('../models/user.model');

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
    User.find({})
    .then(users => res.send({ success: true, users }));
});

userRouter.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    UserService.signUp(name, email, password)
    .then(user => res.send({ success: true, user }))
    .catch(res.onError);
});

userRouter.post('/signin', (req, res) => {
    const { email, password } = req.body;
    UserService.signIn(email, password)
    .then(user => res.send({ success: true, user }))
    .catch(res.onError);
});

userRouter.post('/check', (req, res) => {
    const { token } = req.body;
    UserService.checkToken(token)
    .then(user => res.send({ success: true, user }))
    .catch(res.onError);
});

module.exports = { userRouter };
