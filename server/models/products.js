const mongoose = require('mongoose');
const {ProductSchema} = require('./schemas');

let Product = mongoose.model('Product', ProductSchema);

module.exports = {Product};