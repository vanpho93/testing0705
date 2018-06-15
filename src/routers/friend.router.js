const express = require('express');
const { FriendService } = require('../services/friend.service');
const { mustBeUser } = require('./mustBeUser.middleware');

const friendRouter = express.Router();
friendRouter.use(mustBeUser);

friendRouter.post('/add/:idOther', (req, res) => {
    FriendService.addFriend(req.idUser, req.params.idOther)
    .then(user => res.send({ success: true, user }))
    .catch(res.onError);
});

module.exports = { friendRouter };
