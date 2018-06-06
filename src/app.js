const express = require('express');
const { json } = require('body-parser');
const { UserService } = require('./services/user.service');
const { StoryService } = require('./services/story.service');
const { User } = require('./models/user.model');
const { Story } = require('./models/story.model');
const { verify } = require('./helpers/jwt');

const app = express();
app.use(json());

app.use((req, res, next) => {
    res.onError = error => {
        if (!error.status) console.log(error);
        const body = { success: false, message: error.message };
        res.status(error.status || 500).send(body);
    }
    next();
});

app.get('/user', (req, res) => {
    User.find({})
    .then(users => res.send({ success: true, users }));
});

app.post('/user/signup', (req, res) => {
    const { name, email, password } = req.body;
    UserService.signUp(name, email, password)
    .then(user => res.send({ success: true, user }))
    .catch(res.onError);
});

app.post('/user/signin', (req, res) => {
    const { email, password } = req.body;
    UserService.signIn(email, password)
    .then(user => res.send({ success: true, user }))
    .catch(res.onError);
});

app.post('/user/check', (req, res) => {
    const { token } = req.body;
    UserService.checkToken(token)
    .then(user => res.send({ success: true, user }))
    .catch(res.onError);
});

app.get('/story', (req, res) => {
    Story.find({})
    .then(stories => res.send({ success: true, stories }));
});

app.post('/story', async (req, res) => {
    try {
        const { content, token } = req.body;
        const { _id } = await verify(token);
        const story = await StoryService.createStory(_id, content);
        res.send({ success: true, story });
    } catch (error) {
        res.onError(error);
    }
});

app.delete('/story/:_id', async (req, res) => {
    try {
        const { _id } = await verify(req.headers.token);
        const story = await StoryService.removeStory(_id, req.params._id);
        res.send({ success: true, story });
    } catch (error) {
        res.onError(error);
    }
});

module.exports = { app };
