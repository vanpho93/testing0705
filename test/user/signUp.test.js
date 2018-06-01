const { equal } = require('assert');
const request = require('supertest');
const { app } = require('../../src/app');

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
        console.log(response.body);
    });
});
