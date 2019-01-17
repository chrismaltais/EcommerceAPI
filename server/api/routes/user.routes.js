const Router = require('express').Router;
const authenticate = require('./../../middleware/authenticate');

module.exports = (controller) => {
    const shopAPI = Router();
    const {product, user} = controller;

    shopAPI.post('/login', async (req, res) => {
        let token = await user.login(req.body.email, req.body.password);
        if (!token) {
            return res.status(401).send();
        }
        res.header('x-auth', token).status(200).send({token: token});
    })

    shopAPI.get('/products', async (req, res) => {
        try {
            let products;
            if (req.query.stocked === 'true') {
                products = await product.getStockedProducts();
            } else if (req.query.stocked === 'false') {
                products = await product.getOutOfStockProducts();
            } else {
                products = await product.getAllProducts();
            }
            res.status(200).send(products);
        } catch (e) {
            res.status(400).send(e);
        }
    });

    shopAPI.get('/products/:sku', async (req, res)=> {
        let sku = req.params.sku;
        if (isNaN(sku)) {
            return res.status(400).send({error: 'SKU must be a number.'})
        }
        try {
            let requestedProduct = await product.getProductBySKU(sku);
            if (!requestedProduct) {
                return res.status(404).send({message: `SKU ${sku} not found.`});
            }
            res.status(200).send(requestedProduct);
        } catch (e) {
            res.status(400).send(e);
        }
    })

    shopAPI.patch('/products/:sku', authenticate, async (req, res) => {
        let sku = req.params.sku;
        if (isNaN(sku)) {
            return res.status(400).send({error: `Unable to add SKU: ${sku} to cart. Invalid SKU, must be a number).`})
        }
        try {
            let inventory = await product.checkIfStocked(sku);
            if (inventory === 0) {
                return res.status(404).send({message: `Unable to add SKU: ${sku} to cart. No inventory available.`})
            }
            if (!inventory) {
                return res.status(404).send({message: `Unable to add SKU: ${sku} to cart. Product does not exist.`})
            }
            await user.addToCart(req.user, sku);
            res.status(200).send(`Added SKU: ${sku} to cart! View your cart at /api/v2/cart`);
        } catch (e) {
            res.status(400).send(e);
        }
    })

    shopAPI.get('/cart', authenticate, async(req, res) => {
        let cartExists = await user.checkCartExists(req.user); //
        if (!cartExists) {
            req.user = await user.createCart(req.user); //
        }
        try {
            let cartID = await user.getCartID(req.user);
            let cart = await user.getCart(cartID); //
            return res.status(200).send(cart);
        } catch (e) {
            return res.status(400).send({error: e})
        }
    })

    // shopAPI.post('/logout)
    // shopAPI.patch('/cart/:sku')
    // shopAPI.post('/cart')
    // shoAPI

    return shopAPI;
}