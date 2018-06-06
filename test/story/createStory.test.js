const { equal } = require('assert');
const request = require('supertest');
const { app } = require('../../src/app');
const { User } = require('../../src/models/user.model');
const { Story } = require('../../src/models/story.model');
const { UserService } = require('../../src/services/user.service');

describe('POST /user/check', () => {
    let token;
    beforeEach('Sign up a user for test', async () => {
        await UserService.signUp('teo', 'teo@gmail.com', '123');
        const user = await UserService.signIn('teo@gmail.com', '123');
        token = user.token;
    });

    it.only('Can create new story', async () => {
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
});
