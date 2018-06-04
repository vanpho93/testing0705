const { equal } = require('assert');
const request = require('supertest');
const { compare } = require('bcrypt');
const { app } = require('../../src/app');
const { verify } = require('../../src/helpers/jwt');
const { User } = require('../../src/models/user.model');
const { UserService } = require('../../src/services/user.service');

describe('POST /user/check', () => {
    let token;
    beforeEach('Sign up a user for test', async () => {
        await UserService.signUp('teo', 'teo@gmail.com', '123');
        const user = await UserService.signIn('teo@gmail.com', '123');
        token = user.token;
    });

    it('Can check', async () => {
        const response = await request(app).post('/user/check').send({ token });
        const { success, user, message } = response.body;
        const { name, _id, email } = user;
        equal(response.status, 200);
        equal(success, true);
        equal(message, undefined);
        equal(name, 'teo');
        equal(email, 'teo@gmail.com');
        const obj = await verify(user.token);
        equal(obj._id, _id);
    });

    it('Cannot check without token', async () => {
        const response = await request(app).post('/user/check').send({});
        const { success, user, message } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(message, 'INVALID_TOKEN');
    });

    it('Cannot check with invalid token', async () => {
        const response = await request(app).post('/user/check').send({ token: 'a.b.c' });
        const { success, user, message } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(message, 'INVALID_TOKEN');
    });

    it('Cannot check token for removed user', async () => {
        await User.remove({});
        const response = await request(app).post('/user/check').send({ token });
        const { success, user, message } = response.body;
        equal(response.status, 404);
        equal(success, false);
        equal(message, 'CANNOT_FIND_USER');
    });
});
