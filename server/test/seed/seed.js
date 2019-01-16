const jwt = require('jsonwebtoken');
const {ObjectId} = require('mongodb'); // MongoDB

const {Product} = require('./../../models/products');
const {User} = require('./../../models/users');
const {Cart} = require('./../../models/carts');

const testUserID = new ObjectId();

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
    _id: testUserID,
    email: 'chris.maltais@shopify.ca',
    password: 'IdLikeToWorkHere',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: testUserID, access: 'auth'}, 'JWT_SECRET').toString()
    }]
},{
    email: 'tobias.lutke@shopify.ca',
    password: 'CEOManz'
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
} 

module.exports = {
    testProducts,
    testUsers,
    populateDB
}