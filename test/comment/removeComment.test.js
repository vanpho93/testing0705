const { equal } = require('assert');
const request = require('supertest');
const { app } = require('../../src/app');
const { User } = require('../../src/models/user.model');
const { Story } = require('../../src/models/story.model');
const { UserService } = require('../../src/services/user.service');
const { StoryService } = require('../../src/services/story.service');
const { CommentService } = require('../../src/services/comment.service');

describe('DELET /comment/:_id', () => {
    let token1, idUser1, token2, idUser2, idStory, idComment;

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
        idStory = story._id;
        const comment = await CommentService.createComment(idUser2, idStory, 'abcd');
        idComment = comment._id;
    });

    it('Can update comment', async () => {
        const response = await request(app)
            .delete('/comment/' + idComment)
            .set({ token: token1 });
        console.log(response.body);
    });
});
