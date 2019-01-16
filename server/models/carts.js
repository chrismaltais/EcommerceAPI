const mongoose = require('mongoose');
const {CartSchema} = require('./schemas');

let Cart = mongoose.model('Cart', CartSchema);

module.exports = {Cart};