const express = require('express');
const { StoryService } = require('../services/story.service');
const { Story } = require('../models/story.model');
const { verify } = require('../helpers/jwt');

const storyRouter = express.Router();

storyRouter.get('/', (req, res) => {
    Story.find({})
    .then(stories => res.send({ success: true, stories }));
});

storyRouter.use((req, res, next) => {
    verify(req.headers.token)
    .then(obj => {
        req.idUser = obj._id;
        next();
    })
    .catch(() => res.status(400).send({ success: false, message: 'INVALID_TOKEN' }))
});

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

module.exports = { storyRouter };