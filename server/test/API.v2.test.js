const request = require('supertest');

const {app} = require('./../server');
const {Product} = require('./../models/products');
const {User} = require('./../models/users')
const {Cart} = require('./../models/carts')
const {testProducts, testUsers, testCarts} = require('./seed/seed');

describe('POST /api/v2/login', () => {
    it('should login user and return auth token', async () => {
        let response = await request(app).post('/api/v2/login').send({
            email: testUsers[1].email,
            password: testUsers[1].password
        })
        .expect(200);

        // Test that token was properly given
        expect(response.headers['x-auth']).toBeDefined();

        // Test that the token given to the user is correct in the DB
        let userFromDB = await User.findOne({email: testUsers[1].email});
        expect(userFromDB.tokens[0]).toMatchObject({
            access: 'auth',
            token: response.header['x-auth']
        });
    });

    it('should reject invalid login', async() => {
        let response = await request(app).post('/api/v2/login').send({
            email: testUsers[1].email,
            password: 'FakePassword'
        })
        .expect(401)

        expect(response.headers['x-auth']).toBeUndefined();

        let userFromDB = await User.findOne({email: testUsers[1].email});
        expect(userFromDB.tokens.length).toBe(0);
    });
});

describe('DELETE /api/v2/logout', () => {
    it('should remove auth token on logout', async () => {
        let response = await request(app).delete('/api/v2/logout')
        .set('x-auth', testUsers[0].tokens[0].token) // Set the header!
        .expect(200)

        let userFromDB = await User.findById(testUsers[0]._id);
        expect(userFromDB.tokens.length).toBe(0);
    })
})

describe('POST /api/v2/cart', () => {
    it('should create a new cart if one does not already exist', async () => {
        let response = await request(app).post('/api/v2/cart')
        .set('x-auth', testUsers[0].tokens[0].token) // Set the header!
        .expect(200)

        let userFromDB = await User.findById(testUsers[0]._id);
        expect()
    });

    it('should return 400 if a cart already exists', async () => {
        let response = await request(app).post('/api/v2/cart')
        .set('x-auth', testUsers[2].tokens[0].token) // Set the header!
        .expect(400)
    });

    it('should return 401 if user is not logged in', async() => {
        let response = await request(app).post('/api/v2/cart').expect(401)
    });
})

describe('GET /api/v2/cart', () => {
    it('should return an empty cart with no products if cart not previously created', async () => {
        let response = await request(app).get('/api/v2/cart')
        .set('x-auth', testUsers[0].tokens[0].token)
        .expect(200)
        
        expect(response.body).toBeTruthy(); // Empty Array

        let userFromDB = await User.findOne({email: testUsers[0].email});
        expect(userFromDB.cart).toBeTruthy();
    });

    it('should return 401 if user is not logged in', async() => {
        let response = await request(app).get('/api/v2/cart').expect(401)
    });
})

describe('PUT /api/v2/products/:sku', () => {
    it('should add product to cart if cart exists', async () => {
        let sku = testProducts[0].sku
        let response = await request(app).put(`/api/v2/products/${sku}`)
        .set('x-auth', testUsers[3].tokens[0].token)
        .expect(200);

        let userFromDB = await User.findById(testUsers[3]._id);
        let cartFromDB = await Cart.findById(userFromDB.cart);

        expect(cartFromDB.products[0].sku).toBe(sku);
    });

    it('should create cart, and add product to cart if cart does not exist', async () => {
        let sku = testProducts[0].sku
        let response = await request(app).put(`/api/v2/products/${sku}`)
        .set('x-auth', testUsers[0].tokens[0].token)
        .expect(200);

        let userFromDB = await User.findById(testUsers[0]._id);

        expect(userFromDB.cart).toBeTruthy();
        
        let cartFromDB = await Cart.findById(userFromDB.cart);

        expect(cartFromDB.products[0].sku).toBe(sku);
    });

    it('should return 401 if user is not logged in', async () => {
        let sku = testProducts[0].sku;
        let response = await request(app).put(`/api/v2/products/${sku}`).expect(401);
    });

    it('should return 400 if SKU is NaN', async () => {
        let sku = 'memes';
        let response = await request(app).put(`/api/v2/products/${sku}`)
        .set('x-auth', testUsers[0].tokens[0].token)
        .expect(400);
    });

    it('should return 404 if the SKU has no remaining inventory', async () => {
        let sku = testProducts[2].sku
        let response = await request(app).put(`/api/v2/products/${sku}`)
        .set('x-auth', testUsers[0].tokens[0].token)
        .expect(404);
    });

    it('should return 404 if the SKU does not exist', async () => {
        let sku = 100
        let response = await request(app).put(`/api/v2/products/${sku}`)
        .set('x-auth', testUsers[0].tokens[0].token)
        .expect(404);
    });
});

describe('PUT /api/v2/cart/:sku/:quantity', () => {
    it('should return 400 if SKU is NaN', async () => {
        let response = await request(app).put(`/api/v2/cart/iphone/3`)
        .set('x-auth', testUsers[2].tokens[0].token)
        .expect(400);
    });

    it('should return 400 if quantity is NaN', async () => {

    });

    it('should return 401 if user if not logged in', async () => {

    });
});

describe('POST /api/v2/cart/checkout', () => {
    it('should reduce product inventory count by quantity of product in cart', async() => {
        let response = await request(app).post(`/api/v2/cart/checkout`)
        .set('x-auth', testUsers[2].tokens[0].token)
        .expect(200);

        let productFromDB = await Product.findOne({sku: testProducts[1].sku});
        expect(productFromDB.inventory_count).toBe(0);
    });

    it('should delete the cart field for a user but keep the cart collection', async () => {
        let response = await request(app).post(`/api/v2/cart/checkout`)
        .set('x-auth', testUsers[2].tokens[0].token)
        .expect(200);

        let userFromDB = await User.findById(testUsers[2]._id);
        expect(userFromDB.cart).toBe(null);

        let cartFromDB = await Cart.findById(testCarts[0]._id);
        expect(cartFromDB).toBeTruthy();
    });

    it('should return 400 if there is a higher quantity of a product in your cart than in inventory', async () => {
        let response = await request(app).post(`/api/v2/cart/checkout`)
        .set('x-auth', testUsers[4].tokens[0].token)
        .expect(400);
    });

    it('should return 400 if a cart has not been made', async () => {
        let response = await request(app).post(`/api/v2/cart/checkout`)
        .set('x-auth', testUsers[0].tokens[0].token)
        .expect(400);
    });

    it('should return 400 if there are no products in the cart', async () => {
        let response = await request(app).post(`/api/v2/cart/checkout`)
        .set('x-auth', testUsers[3].tokens[0].token)
        .expect(400);
    });

    it('should return 401 if user is not logged in', async () => {
        let response = await request(app).post(`/api/v2/cart/checkout`).expect(401);
    });
});

describe('GET /api/v2/products', () => {
    it('should get all products', async () => {
        let response = await request(app).get('/api/v2/products').expect(200);
        expect(response.body.length).toBe(3);
    });

    it('should get only stocked products if ?stocked=true', async () => {
        let response = await request(app).get('/api/v2/products?stocked=true').expect(200);
        expect(response.body.length).toBe(2);

        for (i = 0; i < response.body.length; i++) {
            expect(response.body[i].inventory_count).not.toBe(0); 
        }
    });

    it('should get only unstocked products if ?stocked=false', async () => {
        let response = await request(app).get('/api/v2/products?stocked=false').expect(200);
        expect(response.body.length).toBe(1);
    });
});

describe('GET /api/v2/products/:sku', () => {
    it('should return product document', async () => {
        let testSKU = testProducts[0].sku;
        let response = await request(app).get(`/api/v2/products/${testSKU}`).expect(200);
        expect(response.body).toMatchObject(testProducts[0]);
    });

    it('should return 404 if product not found', async () => {
        let fakeSKU = 5;
        let response = await request(app).get(`/api/v2/products/${fakeSKU}`).expect(404);
    });

    it('should return 400 if SKU is NaN', async () => {
        let fakeSKU = 'isThisASKU';
        let response = await request(app).get(`/api/v2/products/${fakeSKU}`).expect(400);
    });
});