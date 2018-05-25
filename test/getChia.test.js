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
        const response = await request(app).get('/chia/10/0');
        const { status, body } = response;
        const { success, result, message } = body;
        equal(status, 400);
        equal(success, false);
        equal(result, undefined);
        equal(message, 'DIVIDE_BY_ZERO');
    });
    
    it('Cannot divide a string', async () => {
        const response = await request(app).get('/chia/10/x');
        const { status, body } = response;
        const { success, result, message } = body;
        equal(status, 400);
        equal(success, false);
        equal(result, undefined);
        equal(message, 'INVALID_TYPE');
    });
});

describe('POST /chia', () => {
    it('Can divide 2 numbers', async () => {
        const response = await request(app).post('/chia').send({ soA: 20, soB: 5 });
        const { status, body } = response;
        const { success, result } = body;
        equal(status, 200);
        equal(success, true);
        equal(result, 4);
    });
    
    it('Cannot divide by zero', async () => {
        const response = await request(app).post('/chia').send({ soA: 20, soB: 0 });
        const { status, body } = response;
        const { success, result, message } = body;
        equal(status, 400);
        equal(success, false);
        equal(result, undefined);
        equal(message, 'DIVIDE_BY_ZERO');
    });
    
    it('Cannot divide a string', async () => {
        const response = await request(app).post('/chia').send({ soA: 20, soB: 'a' });
        const { status, body } = response;
        const { success, result, message } = body;
        equal(status, 400);
        equal(success, false);
        equal(result, undefined);
        equal(message, 'INVALID_TYPE');
    });
});

