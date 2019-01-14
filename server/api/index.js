const Router = require('express').Router;
const productRoutes = require('./routes/product.routes');

module.exports = (controller) => {
    let api = Router();
    api.use('/', productRoutes(controller));
    return api;
}