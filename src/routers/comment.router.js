const express = require('express');
const { CommentService } = require('../services/comment.service');
const { mustBeUser } = require('./mustBeUser.middleware');
const commentRouter = express.Router();

commentRouter.use(mustBeUser);

commentRouter.post('/', async (req, res) => {
    const { idStory, content } = req.body;
    CommentService.createComment(req.idUser, idStory, content)
    .then(comment => res.send({ success: true, comment }))
    .catch(res.onError);
});

commentRouter.delete('/:_id', async (req, res) => {
    CommentService.removeComment(req.idUser, req.params._id)
    .then(comment => res.send({ success: true, comment }))
    .catch(res.onError);
});

commentRouter.put('/:_id', async (req, res) => {
    CommentService.updateComment(req.idUser, req.params._id, req.body.content)
    .then(comment => res.send({ success: true, comment }))
    .catch(res.onError);
});

module.exports = { commentRouter };
