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

    shopAPI.delete('/logout', authenticate, async (req, res) => {
        try {
            await req.user.deleteToken(req.token);
            res.status(200).send({message: 'Successfully logged out.'});
        } catch (e) {
            res.status(400).send(e);
        }
    })

    shopAPI.get('/products', async (req, res) => {
        try {
            let products = 'initial'
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

    shopAPI.put('/products/:sku', authenticate, async (req, res) => {
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
    });

    shopAPI.post('/cart', authenticate, async (req, res) => {
        let cartExists = await user.checkCartExists(req.user); 
        if (!cartExists) {
            req.user = await user.createCart(req.user); 
            let cartID = await user.getCartID(req.user);
            let cart = await user.getCart(cartID); 
            return res.status(200).send(cart);
        }
        return res.status(400).send({error: `Cart already exists with ID: ${req.user.cart}.`})
    });

    shopAPI.get('/cart', authenticate, async(req, res) => {
        let cartExists = await user.checkCartExists(req.user); 
        if (!cartExists) {
            req.user = await user.createCart(req.user); 
        }
        try {
            let cartID = await user.getCartID(req.user);
            let cart = await user.getCart(cartID); 
            return res.status(200).send(cart);
        } catch (e) {
            return res.status(400).send({error: e})
        }
    });

    shopAPI.post('/cart/checkout', authenticate, async (req, res) => {
        // If no cart -> 400 (must create a cart to checkout!)
        if (!req.user.cart) {
            return res.status(400).send({error: `Did not purchase cart. You must create a cart before purchasing.`});
        }
        let products = await user.getCartProducts(req.user.cart);
        // If nothing in cart -> 400 (must have items in cart to purchase!)
        if (products.length === 0) {
            return res.status(400).send({error: 'Did not purchase cart. You must have products in your cart before purchasing.'});
        }
        // Check if items are in stock
        let invalidProducts = await user.checkValidInventory(req.user.cart);

        if(invalidProducts.length != 0) {
            return res.status(400).send({error: 'Did not purchase cart. There are too many of the following products in your cart.',
                                        invalidProducts: invalidProducts});
        }

        let total = await user.purchaseCart(req.user.cart);
        await user.removeCart(req.user);

        res.status(200).send({message: `Cart purchased successfully! Total: $${total} CAD`});
    });

    shopAPI.put('/cart/:sku/:quantity', authenticate, async (req, res) => {
        let sku = req.params.sku;
        let quantity = req.params.quantity;
        if (isNaN(sku) || sku < 0) {
            res.status(400).send({error: `Unable to change SKU: ${sku} to ${quantity} units in your cart. SKU must be a positive number.`})
        }
        if (isNaN(quantity) || quantity < 0) {
            res.status(400).send({error: `Unable to change SKU: ${sku} to ${quantity} units in your cart. Quantity must be a positive number.`})
        }

        let isProduct = await product.checkIfIsProduct(sku);
        if (!isProduct) {
            return res.status(404).send({message: `Unable to add SKU: ${sku} to cart. Product does not exist.`})
        }

        let cartExists = await user.checkCartExists(req.user); 
        if (!cartExists) {
            req.user = await user.createCart(req.user); 
        }
        try {
            let cartID = await user.getCartID(req.user);
            let cart = await user.editCart(req.user, cartID, sku, quantity); 
            return res.status(200).send(cart);
        } catch (e) {
            return res.status(400).send({error: e})
        }    
    })

    return shopAPI;
}