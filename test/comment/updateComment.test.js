const { equal } = require('assert');
const request = require('supertest');
const { app } = require('../../src/app');
const { Comment } = require('../../src/models/comment.model');
const { Story } = require('../../src/models/story.model');
const { UserService } = require('../../src/services/user.service');
const { StoryService } = require('../../src/services/story.service');
const { CommentService } = require('../../src/services/comment.service');

describe('PUT /comment/:_id', () => {
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
        const comment = await CommentService.createComment(idUser2, idStory, 'ghi');
        idComment = comment._id;
    });

    it('Can update comment', async () => {
        const response = await request(app)
            .put('/comment/' + idComment)
            .send({ content: 'xyz' })
            .set({ token: token2 });
            equal(response.status, 200);
        const { success, comment, message } = response.body;
        equal(success, true);
        equal(message, undefined);
        equal(comment.content, 'xyz');
        const commentDb = await Comment.findOne({}).populate('author');
        equal(commentDb.content, 'xyz');
    });

    it('Cannot update comment with invalid id', async () => {
        const response = await request(app)
            .put('/comment/123')
            .send({ content: 'xyz' })
            .set({ token: token2 });
        equal(response.status, 400);
        const { success, comment, message } = response.body;
        equal(success, false);
        equal(message, 'INVALID_ID');
        equal(comment, undefined);
        const commentDb = await Comment.findOne({}).populate('author');
        equal(commentDb.content, 'ghi');
    });

    it('Cannot update comment with invalid token', async () => {
        const response = await request(app)
            .put('/comment/' + idComment)
            .send({ content: 'xyz' })
            .set({ token: 'a.b.c' });
        equal(response.status, 400);
        const { success, comment, message } = response.body;
        equal(success, false);
        equal(message, 'INVALID_TOKEN');
        equal(comment, undefined);
        const commentDb = await Comment.findOne({}).populate('author');
        equal(commentDb.content, 'ghi');
    });

    it('Cannot update comment with token-1', async () => {
        const response = await request(app)
            .put('/comment/' + idComment)
            .send({ content: 'xyz' })
            .set({ token: token1 });
        equal(response.status, 404);
        const { success, comment, message } = response.body;
        equal(success, false);
        equal(message, 'CANNOT_FIND_COMMENT');
        equal(comment, undefined);
        const commentDb = await Comment.findOne({}).populate('author');
        equal(commentDb.content, 'ghi');
    });

    it('Cannot update removed comment', async () => {
        await Comment.findByIdAndRemove(idComment);
        const response = await request(app)
            .put('/comment/' + idComment)
            .send({ content: 'xyz' })
            .set({ token: token2 });
        equal(response.status, 404);
        const { success, comment, message } = response.body;
        equal(success, false);
        equal(message, 'CANNOT_FIND_COMMENT');
        equal(comment, undefined);
        const commentDb = await Comment.findOne({}).populate('author');
        equal(commentDb, null);
    });
});
