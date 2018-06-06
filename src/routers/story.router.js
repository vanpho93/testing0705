const express = require('express');
const { StoryService } = require('../services/story.service');
const { Story } = require('../models/story.model');
const { verify } = require('../helpers/jwt');

const storyRouter = express.Router();

storyRouter.get('/', (req, res) => {
    Story.find({})
    .then(stories => res.send({ success: true, stories }));
});

storyRouter.post('/', async (req, res) => {
    try {
        const { content, token } = req.body;
        const { _id } = await verify(token);
        const story = await StoryService.createStory(_id, content);
        res.send({ success: true, story });
    } catch (error) {
        res.onError(error);
    }
});

storyRouter.delete('/:_id', async (req, res) => {
    try {
        const { _id } = await verify(req.headers.token);
        const story = await StoryService.removeStory(_id, req.params._id);
        res.send({ success: true, story });
    } catch (error) {
        res.onError(error);
    }
});

storyRouter.put('/:_id', async (req, res) => {
    try {
        const { content } = req.body;
        const { _id } = await verify(req.headers.token);
        const story = await StoryService.updateStory(_id, req.params._id, content);
        res.send({ success: true, story });
    } catch (error) {
        res.onError(error);
    }
});

module.exports = { storyRouter };
