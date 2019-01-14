let mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        minlength: 1,
        required: true
    },
    price: {
        type: Number,
        trim: true,
        required: true
    },
    inventory_count: {
        type: Number,
        time: true,
        require: true
    }
})

module.exports = ProductSchema;