const { equal } = require('assert');
const request = require('supertest');
const { app } = require('../../src/app');
const { Story } = require('../../src/models/story.model');
const { Comment } = require('../../src/models/comment.model');
const { UserService } = require('../../src/services/user.service');
const { StoryService } = require('../../src/services/story.service');

describe('POST /comment', () => {
    let token1, idUser1, token2, idUser2, idStory;

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
    });

    it('Can create comment', async () => {
        const response = await request(app)
            .post('/comment')
            .send({ content: 'xyz', idStory })
            .set({ token: token2 });
        equal(response.status, 200);
        const { success, comment, message } = response.body;
        equal(success, true);
        equal(message, undefined);
        equal(comment.content, 'xyz');
        const commentDb = await Comment.findOne({}).populate('author');
        equal(commentDb.content, 'xyz');
        equal(commentDb.author.name, 'ti');
        const storyDb = await Story.findOne({}).populate('comments');
        equal(storyDb.comments[0].content, 'xyz');
    });

    it('Cannot create comment without content', async () => {
        const response = await request(app)
            .post('/comment')
            .send({ content: '', idStory })
            .set({ token: token2 });
        equal(response.status, 400);
        const { success, comment, message } = response.body;
        equal(success, false);
        equal(comment, undefined);
        equal(message, 'EMPTY_CONTENT');
        const commentDb = await Comment.findOne({}).populate('author');
        equal(commentDb, null);
        const storyDb = await Story.findOne({}).populate('comments');
        equal(storyDb.comments.length, 0);
    });

    it('Cannot create comment with invalid id story', async () => {
        const response = await request(app)
            .post('/comment')
            .send({ content: 'xyz', idStory: 'abcd' })
            .set({ token: token2 });
        equal(response.status, 400);
        const { success, comment, message } = response.body;
        equal(success, false);
        equal(comment, undefined);
        equal(message, 'INVALID_ID');
        const commentDb = await Comment.findOne({}).populate('author');
        equal(commentDb, null);
        const storyDb = await Story.findOne({}).populate('comments');
        equal(storyDb.comments.length, 0);
    });

    it('Cannot create comment with invalid token', async () => {
        const response = await request(app)
            .post('/comment')
            .send({ content: 'xyz', idStory })
            .set({ token: '1.2.3' });
        equal(response.status, 400);
        const { success, comment, message } = response.body;
        equal(success, false);
        equal(comment, undefined);
        equal(message, 'INVALID_TOKEN');
        const commentDb = await Comment.findOne({}).populate('author');
        equal(commentDb, null);
        const storyDb = await Story.findOne({}).populate('comments');
        equal(storyDb.comments.length, 0);
    });

    it('Cannot create comment with removed story', async () => {
        await Story.findByIdAndRemove(idStory);
        const response = await request(app)
            .post('/comment')
            .send({ content: 'xyz', idStory })
            .set({ token: token2 });
        equal(response.status, 404);
        const { success, comment, message } = response.body;
        equal(success, false);
        equal(comment, undefined);
        equal(message, 'CANNOT_FIND_STORY');
        const commentDb = await Comment.findOne({}).populate('author');
        equal(commentDb, null);
        const storyDb = await Story.findOne({}).populate('comments');
        equal(storyDb, null);
    });
});
