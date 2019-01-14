const Router = require('express').Router;

module.exports = (controller) => {
    const productAPI = Router();
    const {product} = controller;

    productAPI.get('/products', async (req, res) => {
        try {
            let products;
            if (req.query.stocked === 'true') {
                products = await product.getStockedProducts()
            } else {
                products = await product.getAllProducts();
            }
            res.status(200).send(products);
        } catch (e) {
            res.status(400).send(e);
        }
    })

    return productAPI;
}