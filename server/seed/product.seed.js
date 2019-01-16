let {Product} = require('./../models/products');
let {User} = require('./../models/users');
let {Cart} = require('./../models/carts')
let {mongoose} = require('../db/mongoose')

let products = [{
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

let user = {
    email: 'chris.maltais@shopify.ca',
    password: 'IdLikeToWorkHere'
}

async function populateData() {
    try {
        await Product.deleteMany({});
        await User.deleteMany({});
        await Cart.deleteMany({});
        await new Product(products[0]).save();
        await new Product(products[1]).save();
        await new Product(products[2]).save();
        await new User(user).save();
        await new Cart().save();
        console.log('Data seeded successfully.');
    } catch (e) {
        console.log('Could not seed product info to database.');
    }
}
    
populateData().then(() => {
    mongoose.disconnect();
});

