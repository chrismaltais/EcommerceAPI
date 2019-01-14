const request = require('supertest');
// const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Product} = require('./../models/products');

describe('GET /products', () => {
    it('should get all members', async () => {
        let response = await request(app).get('/products').expect(200)
        expect(response.body.length).toBe(2);
    });
});