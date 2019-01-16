const mongoose = require('mongoose');
const {UserSchema} = require('./schemas');

let User = mongoose.model('User', UserSchema);

module.exports = {User};