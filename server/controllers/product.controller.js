const {Product} = require('./../models/products');

// Async functions automatically wrap returns as promises (to be used in route logic)
async function getAllProducts() {
    try {
        let products = await Product.find({})
        return products;
    } catch (e) {
        return {error: e};
    }
};

async function getStockedProducts() {
    try {
        let products = await Product.find({ inventory_count: { $gt: 0} })
        return products;
    } catch (e) {
        return {error: e};
    }
};

async function getProductBySKU(sku) {
    try {
        let product = await Product.find({ sku: sku })
        return product;
    } catch (e) {
        return {error: e};
    }
};

module.exports = {
    getAllProducts,
    getStockedProducts,
    getProductBySKU
}