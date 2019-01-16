const Router = require('express').Router;
const authenticate = require('./../../middleware/authenticate');

module.exports = (controller) => {
    const shopAPI = Router();
    const {product, user} = controller;

    shopAPI.post('/login', async (req, res) => {
        let token = await user.login(req.body.email, req.body.password);
        if (!token) {
            res.status(401).send();
        }
        res.header('x-auth', token).status(200).send({token: token});
    })

    return shopAPI;
}