const { equal } = require('assert');
const request = require('supertest');
const { compare } = require('bcrypt');
const { app } = require('../../src/app');
const { User } = require('../../src/models/user.model');
const { UserService } = require('../../src/services/user.service');

describe('POST /user/signin', () => {
    beforeEach('Sign up a user for test', async () => {
        await UserService.signUp('teo', 'teo@gmail.com', '123');
    });

    it.only('Can sign in', async () => {
    });

    xit('Cannot sign in without email', async () => {
    });

    xit('Cannot sign in without password', async () => {
    });

    xit('Cannot sign in with wrong password', async () => {
    });

    xit('Cannot sign in with removed user', async () => {
    });
});
