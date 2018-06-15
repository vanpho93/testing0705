const express = require('express');
const { StoryService } = require('../services/story.service');
const { Story } = require('../models/story.model');
const { mustBeUser } = require('./mustBeUser.middleware');
const storyRouter = express.Router();

storyRouter.get('/', (req, res) => {
    Story.find({})
    .populate('author', 'email name avatar')
    .populate({ path: 'comments', populate: { path: 'author', select: 'name' } })
    .then(stories => res.send({ success: true, stories }));
});

storyRouter.use(mustBeUser);

storyRouter.post('/', async (req, res) => {
    StoryService.createStory(req.idUser, req.body.content)
    .then(story => res.send({ success: true, story }))
    .catch(res.onError);
});

storyRouter.delete('/:_id', async (req, res) => {
    StoryService.removeStory(req.idUser, req.params._id)
    .then(story => res.send({ success: true, story }))
    .catch(res.onError);
});

storyRouter.put('/:_id', async (req, res) => {
    StoryService.updateStory(req.idUser, req.params._id, req.body.content)
    .then(story => res.send({ success: true, story }))
    .catch(res.onError);
});

storyRouter.post('/like/:_id', async (req, res) => {
    StoryService.likeStory(req.idUser, req.params._id)
    .then(story => res.send({ success: true, story }))
    .catch(res.onError);
});

storyRouter.post('/dislike/:_id', async (req, res) => {
    StoryService.dislikeStory(req.idUser, req.params._id)
    .then(story => res.send({ success: true, story }))
    .catch(res.onError);
});

module.exports = { storyRouter };
