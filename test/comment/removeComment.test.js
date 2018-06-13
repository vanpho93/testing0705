const { equal } = require('assert');
const request = require('supertest');
const { app } = require('../../src/app');
const { Comment } = require('../../src/models/comment.model');
const { Story } = require('../../src/models/story.model');
const { UserService } = require('../../src/services/user.service');
const { StoryService } = require('../../src/services/story.service');
const { CommentService } = require('../../src/services/comment.service');

describe('DELETE /comment/:_id', () => {
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
        const comment = await CommentService.createComment(idUser2, idStory, 'xyz');
        idComment = comment._id;
    });

    it('Can remove comment', async () => {
        const response = await request(app)
            .delete('/comment/' + idComment)
            .set({ token: token2 });
        equal(response.status, 200);
        const { success, comment, message } = response.body;
        equal(success, true);
        equal(message, undefined);
        equal(comment.content, 'xyz');
        const commentDb = await Comment.findOne({}).populate('author');
        equal(commentDb, null);
        const storyDb = await Story.findOne({}).populate('comments');
        equal(storyDb.comments.length, 0);
    });

    it('Cannot remove comment with invalid idComment', async () => {
        const response = await request(app)
            .delete('/comment/123')
            .set({ token: token2 });
        equal(response.status, 400);
        const { success, comment, message } = response.body;
        equal(success, false);
        equal(message, 'INVALID_ID');
        equal(comment, undefined);
        const commentDb = await Comment.findOne({}).populate('author');
        equal(commentDb.content, 'xyz');
    });

    it('Cannot remove comment with invalid token', async () => {
        const response = await request(app)
            .delete('/comment/' + idComment)
            .set({ token: 'a.b.c' });
        equal(response.status, 400);
        const { success, comment, message } = response.body;
        equal(success, false);
        equal(message, 'INVALID_TOKEN');
        equal(comment, undefined);
        const commentDb = await Comment.findOne({}).populate('author');
        equal(commentDb.content, 'xyz');
    });

    it('Cannot remove comment with token-1', async () => {
        const response = await request(app)
            .delete('/comment/' + idComment)
            .set({ token: token1 });
        equal(response.status, 404);
        const { success, comment, message } = response.body;
        equal(success, false);
        equal(message, 'CANNOT_FIND_COMMENT');
        equal(comment, undefined);
        const commentDb = await Comment.findOne({}).populate('author');
        equal(commentDb.content, 'xyz');
    });

    it('Cannot remove comment twice', async () => {
        await CommentService.removeComment(idUser2, idComment);
        const response = await request(app)
            .delete('/comment/' + idComment)
            .set({ token: token2 });
        equal(response.status, 404);
        const { success, comment, message } = response.body;
        equal(success, false);
        equal(message, 'CANNOT_FIND_COMMENT');
        equal(comment, undefined);
        const commentDb = await Comment.findOne({}).populate('author');
        equal(commentDb, null);
    });

    it('Cannot remove comment of removed story', async () => {
        await StoryService.removeStory(idUser1, idStory);
        const response = await request(app)
            .delete('/comment/' + idComment)
            .set({ token: token2 });
        equal(response.status, 404);
        const { success, comment, message } = response.body;
        equal(success, false);
        equal(message, 'CANNOT_FIND_COMMENT');
        equal(comment, undefined);
        const commentDb = await Comment.findOne({}).populate('author');
        equal(commentDb, null);
    });

    it('Cannot remove comment of removed user', async () => {
        await UserService.removeUser(idUser2);
        const response = await request(app)
            .delete('/comment/' + idComment)
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
