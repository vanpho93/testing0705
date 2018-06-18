const { equal } = require('assert');
const request = require('supertest');
const { app } = require('../../src/app');
const { User } = require('../../src/models/user.model');
const { UserService } = require('../../src/services/user.service');
const { FriendService } = require('../../src/services/friend.service');

describe('POST /friend/cancel/:_id', () => {
    let token1, idUser1, token2, idUser2, idUser3, token3;

    beforeEach('Sign up users for test', async () => {
        await UserService.signUp('teo', 'teo@gmail.com', '123');
        const user1 = await UserService.signIn('teo@gmail.com', '123');
        token1 = user1.token;
        idUser1 = user1._id;
        await UserService.signUp('ti', 'ti@gmail.com', '123');
        const user2 = await UserService.signIn('ti@gmail.com', '123');
        token2 = user2.token;
        idUser2 = user2._id;
        await UserService.signUp('tun', 'tun@gmail.com', '123');
        const user3 = await UserService.signIn('tun@gmail.com', '123');
        token3 = user3.token;
        idUser3 = user3._id;
        await FriendService.addFriend(idUser1, idUser2);
    });

    it('Can cancel request', async () => {
        const response = await request(app)
            .post('/friend/cancel/' + idUser2)
            .set({ token: token1 });
        equal(response.status, 200);
        const { success, user, message } = response.body;
        equal(success, true);
        equal(message, undefined);
        equal(user.name, 'ti');
        const user1 = await User.findById(idUser1);
        equal(user1.friends.length, 0);
        equal(user1.sentRequests.length, 0);
        const user2 = await User.findById(idUser2);
        equal(user2.friends.length, 0);
        equal(user2.incommingRequests.length, 0);
    });

    it('Cannot cancel friend with invalid id', async () => {
        const response = await request(app)
            .post('/friend/cancel/' + 123)
            .set({ token: token1 });
        equal(response.status, 400);
        const { success, user, message } = response.body;
        equal(success, false);
        equal(message, 'INVALID_ID');
        equal(user, undefined);
        const user2 = await User.findById(idUser1);
        equal(user2.friends.length, 0);
        equal(user2.sentRequests.length, 1);
    });

    it('Cannot cancel friend with invalid token', async () => {
        const response = await request(app)
            .post('/friend/cancel/' + idUser2)
            .set({ token: 'a.b.c' });
        equal(response.status, 400);
        const { success, user, message } = response.body;
        equal(success, false);
        equal(message, 'INVALID_TOKEN');
        equal(user, undefined);
        const user2 = await User.findById(idUser1);
        equal(user2.friends.length, 0);
        equal(user2.sentRequests.length, 1);
    });

    it('Cannot cancel friend for idUser3', async () => {
        const response = await request(app)
            .post('/friend/cancel/' + idUser3)
            .set({ token: token1 });
        equal(response.status, 404);
        const { success, user, message } = response.body;
        equal(success, false);
        equal(message, 'CANNOT_FIND_USER');
        equal(user, undefined);
        const user2 = await User.findById(idUser1);
        equal(user2.friends.length, 0);
        equal(user2.sentRequests.length, 1);
    });
});
