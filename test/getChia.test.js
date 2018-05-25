const { app } = require('../src/app');
const request = require('supertest');
const { equal } = require('assert');

describe('GET /chia/:soA/:soB', () => {
    it('Can divide 2 numbers', async () => {
        const response = await request(app).get('/chia/10/5');
        const { status, body } = response;
        const { success, result } = body;
        equal(status, 200);
        equal(success, true);
        equal(result, 2);
    });
    
    it('Cannot divide by zero', async () => {
    });
    
    it('Cannot divide a string', async () => {
    });
});
