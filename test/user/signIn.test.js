const { equal } = require('assert');
const request = require('supertest');
const { compare } = require('bcrypt');
const { app } = require('../../src/app');
const { verify } = require('../../src/helpers/jwt');
const { User } = require('../../src/models/user.model');
const { UserService } = require('../../src/services/user.service');

describe('POST /user/signin', () => {
    beforeEach('Sign up a user for test', async () => {
        await UserService.signUp('teo', 'teo@gmail.com', '123');
    });

    it('Can sign in', async () => {
        const body = { email: 'teo@gmail.com', password: '123' };
        const response = await request(app).post('/user/signin').send(body);
        const { success, user } = response.body;
        const { name, _id, token, email } = user;
        equal(response.status, 200);
        equal(success, true);
        equal(name, 'teo');
        equal(email, 'teo@gmail.com');
        const obj = await verify(token);
        equal(obj._id, _id);
    });

    it('Cannot sign in without email', async () => {
        const body = { password: '123' };
        const response = await request(app).post('/user/signin').send(body);
        const { success, user, message } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(user, undefined);
        equal(message, 'EMPTY_EMAIL');
    });

    it('Cannot sign in without password', async () => {
        const body = { email: 'a@gmail.com' };
        const response = await request(app).post('/user/signin').send(body);
        const { success, user, message } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(user, undefined);
        equal(message, 'EMPTY_PASSWORD');
    });

    it('Cannot sign in with wrong password', async () => {
        const body = { email: 'teo@gmail.com', password: '1234' };
        const response = await request(app).post('/user/signin').send(body);
        const { success, user, message } = response.body;
        equal(response.status, 404);
        equal(success, false);
        equal(user, undefined);
        equal(message, 'CANNOT_FIND_USER');
    });

    it('Cannot sign in with removed user', async () => {
        await User.remove({});
        const body = { email: 'teo@gmail.com', password: '123' };
        const response = await request(app).post('/user/signin').send(body);
        const { success, user, message } = response.body;
        equal(response.status, 404);
        equal(success, false);
        equal(user, undefined);
        equal(message, 'CANNOT_FIND_USER');
    });
});
