const request = require('supertest');

const {app} = require('./../server');
const {Product} = require('./../models/products');
const {testProducts} = require('./seed/seed');

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

describe('GET /products/:sku', () => {
    it('should return product document', async () => {
        let testSKU = testProducts[0].sku;
        let response = await request(app).get(`/products/${testSKU}`).expect(200)
        expect(response.body.length).toBe(1);

        expect(response.body[0].sku).toBe(testSKU);
    })

    it('should return 404 if product not found', async () => {
        let fakeSKU = 5
        let response = await request(app).get(`/products/${fakeSKU}`).expect(404)
    })

    it('should return 400 if SKU is NaN', async () => {
        let fakeSKU = 'isThisASKU'
        let response = await request(app).get(`/products/${fakeSKU}`).expect(400)
    })
})