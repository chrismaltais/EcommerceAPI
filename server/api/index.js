const Router = require('express').Router;
const productRoutes = require('./routes/product.routes');
const userRoutes = require('./routes/user.routes');

module.exports = (controller) => {
    let api = Router();
    api.use('/v1/', productRoutes(controller));
    api.use('/v2/', userRoutes(controller));
    return api;
}