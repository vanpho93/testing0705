const { equal } = require('assert');
const request = require('supertest');
const { app } = require('../../src/app');
const { User } = require('../../src/models/user.model');
const { Story } = require('../../src/models/story.model');
const { UserService } = require('../../src/services/user.service');
const { StoryService } = require('../../src/services/story.service');

describe('POST /story/dislike/:_id', () => {
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
        await StoryService.likeStory(idUser2, storyId);
    });

    it('Can dislike story', async () => {
        const response = await request(app)
            .post('/story/dislike/' + storyId)
            .set({ token: token2 });
        equal(response.status, 200);
        const { success, story, message } = response.body;
        equal(success, true);
        equal(story.fans.length, 0);
        equal(message, undefined);
        const storyDb = await Story.findOne({});
        equal(storyDb.fans.length, 0);
    });

    it('Cannot dislike story with invalid id', async () => {
        const response = await request(app)
            .post('/story/dislike/' + 123)
            .set({ token: token2 });
        equal(response.status, 400);
        const { success, story, message } = response.body;
        equal(success, false);
        equal(story, undefined);
        equal(message, 'INVALID_ID');
        const storyDb = await Story.findOne({});
        equal(storyDb.fans.length, 1);
    });

    it('Cannot dislike story with invalid token', async () => {
        const response = await request(app)
            .post('/story/dislike/' + storyId)
            .set({ token: 'a.b.c' });
        equal(response.status, 400);
        const { success, story, message } = response.body;
        equal(success, false);
        equal(story, undefined);
        equal(message, 'INVALID_TOKEN');
        const storyDb = await Story.findOne({});
        equal(storyDb.fans.length, 1);
    });

    it('Cannot dislike story twice', async () => {
        await StoryService.dislikeStory(idUser2, storyId);
        const response = await request(app)
            .post('/story/dislike/' + storyId)
            .set({ token: token2 });
        equal(response.status, 404);
        const { success, story, message } = response.body;
        equal(success, false);
        equal(story, undefined);
        equal(message, 'CANNOT_FIND_STORY');
        const storyDb = await Story.findOne({});
        equal(storyDb.fans.length, 0);
    });

    it('Cannot dislike story with token 1', async () => {
        const response = await request(app)
            .post('/story/dislike/' + storyId)
            .set({ token: token1 });
        equal(response.status, 404);
        const { success, story, message } = response.body;
        equal(success, false);
        equal(story, undefined);
        equal(message, 'CANNOT_FIND_STORY');
        const storyDb = await Story.findOne({});
        equal(storyDb.fans.length, 1);
    });

    it('Cannot dislike a removed story', async () => {
        await StoryService.removeStory(idUser1, storyId);
        const response = await request(app)
            .post('/story/dislike/' + storyId)
            .set({ token: token2 });
        equal(response.status, 404);
        const { success, story, message } = response.body;
        equal(success, false);
        equal(story, undefined);
        equal(message, 'CANNOT_FIND_STORY');
        const storyDb = await Story.findOne({});
        equal(storyDb, null);
    });
});
