const { equal } = require('assert');
const request = require('supertest');
const { compare } = require('bcrypt');
const { app } = require('../../src/app');
const { User } = require('../../src/models/user.model');
const { UserService } = require('../../src/services/user.service');

describe('POST /user/signup', () => {
    it('Can sign up', async () => {
        const body = {
            email: 'abc1@gmail.com',
            name: 'ABC Nguyen',
            password: '123'
        };
        const response = await request(app)
        .post('/user/signup')
        .send(body);
        const { success, user, message } = response.body;
        equal(response.status, 200);
        equal(success, true);
        equal(message, undefined);
        equal(user.name, 'ABC Nguyen');
        equal(user.email, 'abc1@gmail.com');
        const userDb = await User.findOne({});
        equal(userDb.name, 'ABC Nguyen');
        equal(userDb.email, 'abc1@gmail.com');
        const same = await compare('123', userDb.password);
        equal(same, true);
    });

    it('Cannot sign up without name', async () => {
        const body = {
            email: 'abc1@gmail.com',
            name: '',
            password: '123'
        };
        const response = await request(app)
        .post('/user/signup')
        .send(body);
        const { success, user, message } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(message, 'EMPTY_NAME');
        equal(user, undefined);
        const userDb = await User.findOne({});
        equal(userDb, null);
    });

    it('Cannot sign up without password', async () => {
        const body = {
            email: 'abc1@gmail.com',
            name: 'ABCD',
            password: ''
        };
        const response = await request(app)
        .post('/user/signup')
        .send(body);
        const { success, user, message } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(message, 'EMPTY_PASSWORD');
        equal(user, undefined);
        const userDb = await User.findOne({});
        equal(userDb, null);
    });

    it('Cannot sign up without email', async () => {
        const body = {
            email: '',
            name: 'ABCD',
            password: 'abcd'
        };
        const response = await request(app)
        .post('/user/signup')
        .send(body);
        const { success, user, message } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(message, 'EMPTY_EMAIL');
        equal(user, undefined);
        const userDb = await User.findOne({});
        equal(userDb, null);
    });

    it('Cannot sign up with duplicated email', async () => {
        await UserService.signUp('Teo', 'teo@gmail.com', '123');
        const body = {
            email: 'teo@gmail.com',
            name: 'ABC Nguyen',
            password: '123'
        };
        const response = await request(app)
        .post('/user/signup')
        .send(body);
        const { success, user, message } = response.body;
        equal(response.status, 419);
        equal(success, false);
        equal(message, 'EMAIL_EXISTED');
        equal(user, undefined);
        const userDb = await User.findOne({ name: 'ABC Nguyen' });
        equal(userDb, null);
    });
});
