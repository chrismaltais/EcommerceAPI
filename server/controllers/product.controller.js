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

async function getOutOfStockProducts() {
    try {
        let products = await Product.find({ inventory_count: { $eq: 0} })
        return products;
    } catch (e) {
        return {error: e};
    }
};

async function getProductBySKU(sku) {
    try {
        let product = await Product.findOne({ sku: sku })
        return product;
    } catch (e) {
        return {error: e};
    }
};

async function checkIfStocked(sku) {
    try {
        let productExist = await Product.findOne({"sku": sku });
        if (!productExist) {
            return false;
        }
        if (productExist.inventory_count <= 0) {
            return 0;
        }
        return true;
    } catch (e) {
        return {error: e};
    }        
}

async function checkIfIsProduct(sku) {
    let isProduct = await Product.findOne({"sku": sku });
    if(!isProduct) {
        return false;
    }
    return true;
}

async function purchaseProductBySKU(sku) {
    try {
        let productExist = await Product.findOne({"sku": sku });
        if (!productExist) {
            return null;
        }
        if (productExist.inventory_count <= 0) {
            return 0;
        }
        let product = await Product.findOneAndUpdate({"sku": sku }, {$inc : {"inventory_count" : -1} }, {new: true});
        return product;
    } catch (e) {
        return {error: e};
    }
}

module.exports = {
    getAllProducts,
    getStockedProducts,
    getOutOfStockProducts,
    getProductBySKU,
    purchaseProductBySKU,
    checkIfStocked,
    checkIfIsProduct
}