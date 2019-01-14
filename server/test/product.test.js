const request = require('supertest');
// const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Product} = require('./../models/products');
const {testMembers} = require('./seed/seed');

describe('GET /products', () => {
    it('should get all products', async () => {
        let response = await request(app).get('/products').expect(200)
        expect(response.body.length).toBe(3);
    });

    it('should get only stocked products if ?stocked=true', async () => {
        let response = await request(app).get('/products?stocked=true').expect(200)
        expect(response.body.length).toBe(2);

        for (i = 0; i < response.body.length; i++) {
            expect(response.body[i].inventory_count).not.toBe(0); 
        }
    });

    it('should get all products if ?stocked=false', async () => {
        let response = await request(app).get('/products?stocked=false').expect(200)
        expect(response.body.length).toBe(3);
    });
});