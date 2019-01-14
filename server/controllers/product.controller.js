const {Product} = require('./../models/products');

// Async functions automatically wrap returns as promises (to be used in route logic)
async function getAllProducts() {
    try {
        let products = await Product.find({})
        return products;
    } catch (e) {
        return {message: "Products not found."};
    }
};

async function getStockedProducts() {
    try {
        let products = await Product.find({ inventory_count: { $gt: 0} })
        return products;
    } catch (e) {
        return {message: "Products not found."};
    }
};

module.exports = {
    getAllProducts,
    getStockedProducts
}