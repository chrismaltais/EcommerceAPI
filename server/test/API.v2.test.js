const request = require('supertest');

const {app} = require('./../server');
const {Product} = require('./../models/products');
const {User} = require('./../models/users')
const {testProducts, testUsers} = require('./seed/seed');

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

describe('GET /api/v2/cart', () => {
    it('should return an empty cart with no products if cart not previously created', async () => {
        let response = await request(app).get('/api/v2/cart')
        .set('x-auth', testUsers[0].tokens[0].token) // Set the header!
        .expect(200)
        
        expect(response.body).toBeTruthy(); // Empty Array

        let userFromDB = await User.findOne({email: testUsers[0].email});
        expect(userFromDB.cart).toBeTruthy();
    });

    it('should return 401 if user is not logged in', async() => {
        let response = await request(app).get('/api/v2/cart').expect(401)
    });
})