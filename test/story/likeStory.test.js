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
        console.log(response.body);
        // equal(response.status, 200);
        // const { success, story } = response.body;
        // equal(success, true);
        // equal(story.content, 'abcd');
        // const storyDb = await Story.findOne({}).populate('author');
        // equal(storyDb, null);
        // const user1 = await User.findById(idUser1);
        // equal(user1.stories.length, 0);
    });
});
