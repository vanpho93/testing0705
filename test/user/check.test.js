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
    });

    it('Cannot check without token', async () => {
    });

    it('Cannot check with invalid token', async () => {
    });
});
