const mongoose = require('mongoose');
let root;
if (process.env.ENV === 'local') {
    root = 'localhost';
} else {
    root = 'mongo';
}

process.env.MONGODB_URI = `mongodb://${root}:27017/BarebonesEcommerce`

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});

module.exports = {mongoose}