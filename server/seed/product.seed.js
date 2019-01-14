let {Product} = require('../models/products');
let {mongoose} = require('../db/mongoose')

let products = [
    new Product({
        title: 'iPhone 11',
        price: 1000,
        inventory_count: 3
    }), 
    new Product({
        title: 'iPad 6',
        price: 600,
        inventory_count: 2
    })
];

async function populateData() {
    try {
        await Product.deleteMany({});
        await products[0].save()
        await products[1].save()
        console.log('Data seeded successfully.')
    } catch (e) {
        console.log('Could not seed product info to database.');
    }
}
    
populateData().then(() => {
    mongoose.disconnect();
});

