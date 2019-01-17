let mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    products: [{
        title: {
            type: String
        },
        price: {
            type: Number
        },
        sku: {
            type: Number,
        },
        quantity: {
            type: Number
        }
    }],
    total: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = CartSchema;