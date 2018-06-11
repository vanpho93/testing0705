const { equal } = require('assert');
const request = require('supertest');
const { app } = require('../../src/app');
const { User } = require('../../src/models/user.model');
const { Story } = require('../../src/models/story.model');
const { UserService } = require('../../src/services/user.service');
const { StoryService } = require('../../src/services/story.service');

describe('DELETE /story/:_id', () => {
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

    it.only('Can remove story', async () => {
        const response = await request(app)
            .delete('/story/' + storyId)
            .set({ token: token1 });
        console.log(response.body);
        // equal(response.status, 200);
        // const { success, story } = response.body;
        // equal(success, true);
        // equal(story.content, 'abcd');
        // const storyDb = await Story.findOne({}).populate('author');
        // equal(storyDb.content, 'abcd');
        // equal(storyDb.author.name, 'teo');
        // const user = await User.findOne().populate('stories');
        // console.log(user);
    });

    xit('Cannot remove story without token', async () => { });
    xit('Cannot remove story with invalid token', async () => { });
    xit('Cannot remove story with user2-token', async () => { });
});
