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

    productAPI.get('/products/:sku', async (req, res)=> {
        let sku = req.params.sku;
        if (isNaN(sku)) {
            return res.status(400).send({error: 'SKU must be a number.'})
        }
        try {
            let requestedProduct = await product.getProductBySKU(sku);
            if (requestedProduct.length === 0) {
                return res.status(404).send({message: `SKU ${sku} not found.`});
            }
            res.status(200).send(requestedProduct);
        } catch (e) {
            res.status(400).send(e);
        }
    })

    return productAPI;
}