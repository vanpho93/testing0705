const { equal } = require('assert');
const request = require('supertest');
const { app } = require('../../src/app');
const { User } = require('../../src/models/user.model');
const { Story } = require('../../src/models/story.model');
const { UserService } = require('../../src/services/user.service');
const { StoryService } = require('../../src/services/story.service');

describe('POST /story/like/:_id', () => {
    let token1, idUser1, token2, idUser2, storyId;

    beforeEach('Sign up a user for test', async () => {
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

    it('Can like story', async () => {
        const response = await request(app)
            .post('/story/like/' + storyId)
            .set({ token: token2 });
        equal(response.status, 200);
        const { success, story } = response.body;
        equal(success, true);
        equal(story.fans[0], idUser2);
        const storyDb = await Story.findOne({}).populate('fans');
        equal(storyDb.fans[0].name, 'ti');
    });

    it('Cannot like story with invalid _id', async () => {
        const response = await request(app)
            .post('/story/like/' + 123)
            .set({ token: token2 });
        equal(response.status, 400);
        const { success, story, message } = response.body;
        equal(success, false);
        equal(story, undefined);
        equal(message, 'INVALID_ID');
        const storyDb = await Story.findOne({}).populate('fans');
        equal(storyDb.fans.length, 0);
    });

    it('Cannot like story with invalid token', async () => {
        const response = await request(app)
            .post('/story/like/' + storyId)
            .set({ token: 'a.b.c' });
        equal(response.status, 400);
        const { success, story, message } = response.body;
        equal(success, false);
        equal(story, undefined);
        equal(message, 'INVALID_TOKEN');
        const storyDb = await Story.findOne({}).populate('fans');
        equal(storyDb.fans.length, 0);
    });

    it('Cannot like story twice', async () => {
        await StoryService.likeStory(idUser2, storyId);
        const response = await request(app)
            .post('/story/like/' + storyId)
            .set({ token: token2 });
        equal(response.status, 404);
        const { success, story, message } = response.body;
        equal(success, false);
        equal(story, undefined);
        equal(message, 'CANNOT_FIND_STORY');
        const storyDb = await Story.findOne({}).populate('fans');
        equal(storyDb.fans[0].name, 'ti');
    });

    it('Cannot like a removed story', async () => {
        await StoryService.removeStory(idUser1, storyId);
        const response = await request(app)
            .post('/story/like/' + storyId)
            .set({ token: token2 });
        equal(response.status, 404);
        const { success, story, message } = response.body;
        equal(success, false);
        equal(story, undefined);
        equal(message, 'CANNOT_FIND_STORY');
        const storyDb = await Story.findOne({}).populate('fans');
        equal(storyDb, null);
    });
});
