const {ObjectId} = require('mongodb'); // MongoDB
const {Product} = require('./../../models/products');

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

const populateProducts = async () => {
    await Product.deleteMany({});
    await new Product(testProducts[0]).save();
    await new Product(testProducts[1]).save();
    await new Product(testProducts[2]).save();
} 

module.exports = {
    testProducts,
    populateProducts
}