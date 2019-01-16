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

    shopAPI.get('/cart', authenticate, async(req, res) => {
        let cartExists = await user.checkCartExists(req.user); //
        if (!cartExists) {
            req.user = await user.createCart(req.user); //
        }
        try {
            let cartID = await user.getCartID(req.user);
            let cart = await user.getCartContents(cartID); //
            return res.status(200).send(cart);
        } catch (e) {
            return res.status(400).send({error: e})
        }
    })

    // shopAPI.get('/products');
    // shopAPI.get('/products/:sku');
    
    // shopAPI.patch('/products/:sku', authenticate, async(req, res) => {
    //     // Can't add a product to cart if sku is 0

    // })

    return shopAPI;
}