const request = require('supertest');

const {app} = require('./../server');
const {Product} = require('./../models/products');
const {testProducts} = require('./seed/seed');

describe('GET /products', () => {
    it('should get all products', async () => {
        let response = await request(app).get('/api/v1/products').expect(200);
        expect(response.body.length).toBe(3);
    });

    it('should get only stocked products if ?stocked=true', async () => {
        let response = await request(app).get('/api/v1/products?stocked=true').expect(200);
        expect(response.body.length).toBe(2);

        for (i = 0; i < response.body.length; i++) {
            expect(response.body[i].inventory_count).not.toBe(0); 
        }
    });

    it('should get all products if ?stocked=false', async () => {
        let response = await request(app).get('/api/v1/products?stocked=false').expect(200);
        expect(response.body.length).toBe(3);
    });
});

describe('GET /products/:sku', () => {
    it('should return product document', async () => {
        let testSKU = testProducts[0].sku;
        let response = await request(app).get(`/api/v1/products/${testSKU}`).expect(200);
        expect(response.body).toMatchObject(testProducts[0]);
    });

    it('should return 404 if product not found', async () => {
        let fakeSKU = 5;
        let response = await request(app).get(`/api/v1/products/${fakeSKU}`).expect(404);
    });

    it('should return 400 if SKU is NaN', async () => {
        let fakeSKU = 'isThisASKU';
        let response = await request(app).get(`/api/v1/products/${fakeSKU}`).expect(400);
    });
});

describe('PATCH /products/:sku', () => {
    it('should decrement a product inventory count by 1', async () => {
        let testSKU = testProducts[0].sku;
        let response = await request(app).patch(`/api/v1/products/${testSKU}`).expect(200);

        expect(response.body.sku).toBe(testSKU);
        expect(response.body.inventory_count).toBe(testProducts[0].inventory_count - 1);

        let productFromDB = await Product.findOne({"sku" : testSKU});
        expect(productFromDB.inventory_count).toBe(testProducts[0].inventory_count - 1);
    });

    it('should return 404 if product not found', async () => {
        let fakeSKU = 5;
        let response = await request(app).patch(`/api/v1/products/${fakeSKU}`).expect(404);
    });

    it('should return 400 if SKU is NaN', async () => {
        let fakeSKU = 'isThisASKU';
        let response = await request(app).patch(`/api/v1/products/${fakeSKU}`).expect(400);
    });

    it('should return 404 if product has no inventory', async () => {
        let testSKU = testProducts[2].sku;
        let response = await request(app).patch(`/api/v1/products/${testSKU}`).expect(404);
    });
})