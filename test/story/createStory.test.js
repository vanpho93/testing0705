const { equal } = require('assert');
const request = require('supertest');
const { app } = require('../../src/app');
const { User } = require('../../src/models/user.model');
const { Story } = require('../../src/models/story.model');
const { UserService } = require('../../src/services/user.service');

describe('POST /story', () => {
    let token;
    beforeEach('Sign up a user for test', async () => {
        await UserService.signUp('teo', 'teo@gmail.com', '123');
        const user = await UserService.signIn('teo@gmail.com', '123');
        token = user.token;
    });

    it('Can create new story', async () => {
        const response = await request(app)
            .post('/story')
            .send({ content: 'abcd' })
            .set({ token });
        equal(response.status, 200);
        const { success, story } = response.body;
        equal(success, true);
        equal(story.content, 'abcd');
        const storyDb = await Story.findOne({}).populate('author');
        equal(storyDb.content, 'abcd');
        equal(storyDb.author.name, 'teo');
    });

    it.only('Cannot create new story without content', async () => {
        const response = await request(app)
        .post('/story')
        .send({ content: '' })
        .set({ token });
        equal(response.status, 400);
        const { success, story, message } = response.body;
        equal(success, false);
        equal(story, undefined);
        equal(message, 'EMPTY_CONTENT');
        const storyDb = await Story.findOne({}).populate('author');
        equal(storyDb, null);
    });
    xit('Cannot create new story without token', async () => {});
    xit('Cannot create new story with invalid token', async () => {});
    xit('Cannot create new story for removed user', async () => {});
});
