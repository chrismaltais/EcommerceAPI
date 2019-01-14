const mongoose = require('mongoose');
process.env.MONGODB_URI = 'mongodb://localhost:27017/BarebonesEcommerce'

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});

module.exports = {mongoose}