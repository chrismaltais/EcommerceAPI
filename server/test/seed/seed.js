const jwt = require('jsonwebtoken');
const {ObjectId} = require('mongodb'); // MongoDB

const {Product} = require('./../../models/products');
const {User} = require('./../../models/users');
const {Cart} = require('./../../models/carts');

const testUserOneID = new ObjectId();
const testUserThreeID = new ObjectId();
const testUserFourID = new ObjectId();
const testUserFiveID = new ObjectId();

const testCartOneID = new ObjectId();
const testCartTwoID = new ObjectId();
const testCartThreeID = new ObjectId();

let testProducts = [{
    title: 'iPhone 11',
    price: 1000,
    sku: 1,
    inventory_count: 3
}, {
    title: 'iPad 6',
    price: 600,
    sku: 2,
    inventory_count: 2
}, {
    title: 'iLaptop',
    price: 600,
    sku: 3,
    inventory_count: 0
}];

let testUsers = [{
    _id: testUserOneID,
    email: 'chris.maltais@shopify.ca',
    password: 'IdLikeToWorkHere',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: testUserOneID, access: 'auth'}, 'JWT_SECRET').toString()
    }]
},{
    email: 'tobias.lutke@shopify.ca',
    password: 'CEOManz'
}, {
    _id: testUserThreeID,
    email: 'contact@chrismaltais.com',
    password: 'CheckOutMySite',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: testUserThreeID, access: 'auth'}, 'JWT_SECRET').toString()
    }],
    cart: testCartOneID
}, {
    _id: testUserFourID,
    email: 'toomany@tests.com',
    password: 'helpmeplease',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: testUserFourID, access: 'auth'}, 'JWT_SECRET').toString()
    }],
    cart: testCartTwoID
}, {
    _id: testUserFiveID,
    email: 'DJ@music.com',
    password: 'DJrunthatback',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: testUserFiveID, access: 'auth'}, 'JWT_SECRET').toString()
    }],
    cart: testCartThreeID
}];

let testCarts = [{
    _id: testCartOneID,
    products: [{
        title: testProducts[1].title,
        price: testProducts[1].price,
        sku: testProducts[1].sku,
        quantity: 2
    }],
    total: testProducts[1].price * 2
}, {
    _id: testCartTwoID
}, {
    _id: testCartThreeID,
    products: [{
        title: testProducts[1].title,
        price: testProducts[1].price,
        sku: testProducts[1].sku,
        quantity: 3
    }],
    total: testProducts[1].price * 3
}]

const populateDB = async () => {
    await Product.deleteMany({});
    await User.deleteMany({});
    await Cart.deleteMany({});
    await new Product(testProducts[0]).save();
    await new Product(testProducts[1]).save();
    await new Product(testProducts[2]).save();
    await new User(testUsers[0]).save();
    await new User(testUsers[1]).save();
    await new User(testUsers[2]).save();
    await new User(testUsers[3]).save();
    await new User(testUsers[4]).save();
    await new Cart(testCarts[0]).save();
    await new Cart(testCarts[1]).save();
    await new Cart(testCarts[2]).save();
} 

module.exports = {
    testProducts,
    testUsers,
    testCarts,
    populateDB
}