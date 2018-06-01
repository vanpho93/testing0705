const { equal } = require('assert');
const request = require('supertest');
const { compare } = require('bcrypt');
const { app } = require('../../src/app');
const { User } = require('../../src/models/user.model');

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
        equal(success, false);
        // equal(message, undefined);
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
        equal(success, false);
        // equal(message, undefined);
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
        equal(success, false);
        // equal(message, undefined);
        equal(user, undefined);
        const userDb = await User.findOne({});
        equal(userDb, null);
    });
    xit('Cannot sign up with duplicated email', async () => {});
});