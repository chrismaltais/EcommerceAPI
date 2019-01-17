let mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    products: [{
        title: {
            title: String
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