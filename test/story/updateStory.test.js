const { equal } = require('assert');
const request = require('supertest');
const { app } = require('../../src/app');
const { User } = require('../../src/models/user.model');
const { Story } = require('../../src/models/story.model');
const { UserService } = require('../../src/services/user.service');
const { StoryService } = require('../../src/services/story.service');

describe('UPDATE /story/:_id', () => {
    let token1, idUser1, token2, idUser2, storyId;

    beforeEach('Sign up a user and create new story for test', async () => {
        await UserService.signUp('teo', 'teo@gmail.com', '123');
        const user1 = await UserService.signIn('teo@gmail.com', '123');
        token1 = user1.token;
        idUser1 = user1._id;
        await UserService.signUp('ti', 'ti@gmail.com', '123');
        const user2 = await UserService.signIn('ti@gmail.com', '123');
        token2 = user2.token;
        idUser2 = user2._id;
        const story = await StoryService.createStory(idUser1, 'abcd');
        storyId = story._id;
    });

    it('Can update story', async () => {
        const response = await request(app)
            .put('/story/' + storyId)
            .send({ content: 'xyz' })
            .set({ token: token1 });
        equal(response.status, 200);
        const { success, story, message } = response.body;
        equal(success, true);
        equal(message, undefined);
        equal(story.content, 'xyz');
        const storyDb = await Story.findOne({}).populate('author');
        equal(storyDb.content, 'xyz');
    });

    it('Cannot update story without token', async () => {
        const response = await request(app)
            .put('/story/' + storyId)
            .send({ content: 'xyz' });
        equal(response.status, 400);
        const { success, story, message } = response.body;
        equal(success, false);
        equal(story, undefined);
        equal(message, 'INVALID_TOKEN');
        const storyDb = await Story.findOne({}).populate('author');
        equal(storyDb.content, 'abcd');
    });

    it('Cannot update story with invalid token', async () => {
        const response = await request(app)
            .put('/story/' + storyId)
            .send({ content: 'xyz' })
            .set({ token: 'a.b.c' });
        equal(response.status, 400);
        const { success, story, message } = response.body;
        equal(success, false);
        equal(story, undefined);
        equal(message, 'INVALID_TOKEN');
        const storyDb = await Story.findOne({}).populate('author');
        equal(storyDb.content, 'abcd');
    });

    it('Cannot update story with user2-token', async () => {
        const response = await request(app)
            .put('/story/' + storyId)
            .send({ content: 'xyz' })
            .set({ token: token2 });
        equal(response.status, 404);
        const { success, story, message } = response.body;
        equal(success, false);
        equal(story, undefined);
        equal(message, 'CANNOT_FIND_STORY');
        const storyDb = await Story.findOne({}).populate('author');
        equal(storyDb.content, 'abcd');
    });

    it('Cannot update a removed story', async () => {
        await StoryService.removeStory(idUser1, storyId);
        const response = await request(app)
            .put('/story/' + storyId)
            .send({ content: 'xyz' })
            .set({ token: token1 });
        equal(response.status, 404);
        const { success, story, message } = response.body;
        equal(success, false);
        equal(story, undefined);
        equal(message, 'CANNOT_FIND_STORY');
        const storyDb = await Story.findOne({}).populate('author');
        equal(storyDb, null);
    });
});
