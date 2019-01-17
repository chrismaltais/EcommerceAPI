let mongoose = require('mongoose');
let _ = require('lodash');

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
    sku: {
        type: Number,
        trim: true,
        required: true,
        unique: true,
    },
    inventory_count: {
        type: Number,
        time: true,
        require: true
    }
})

// Modify returned User JSON object to hide password
ProductSchema.methods.toJSON = function () {
    var product = this;
    var productObject = product.toObject(); // converts to mongoose document to POJO
    
    let finalProduct = _.pick(productObject, ['title', 'price', 'sku', 'inventory_count']);
    return finalProduct;
};

module.exports = ProductSchema;