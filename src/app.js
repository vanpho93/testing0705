const express = require('express');
const { json } = require('body-parser');
const cors = require('cors');
const { storyRouter } = require('./routers/story.router');
const { userRouter } = require('./routers/user.router');
const { commentRouter } = require('./routers/comment.router');
const { friendRouter } = require('./routers/friend.router');

const app = express();
app.use(cors());
app.use(json());

app.use((req, res, next) => {
    res.onError = error => {
        if (!error.status) console.log(error);
        const body = { success: false, message: error.message };
        res.status(error.status || 500).send(body);
    }
    next();
});

app.use('/user', userRouter);
app.use('/story', storyRouter);
app.use('/comment', commentRouter);
app.use('/friend', friendRouter);

module.exports = { app };
