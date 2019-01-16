const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// Modify returned User JSON object to hide password
UserSchema.methods.toJSON = async function () {
    var user = this;
    var userObject = user.toObject(); // converts to mongoose document to POJO
  
    return _.pick(userObject, ['_id', 'email']);
};

// Generates tokens and populates tokens field of schema
// Instance method
UserSchema.methods.generateAuthToken = async function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'JWT_SECRET').toString();
  
    user.tokens.push({access, token});
  
    return user.save().then(() => {
        return token;
    });
};

// Deletes a member's token
// $pull lets you remove an item from an array tht match certain criteria
// Instance method
UserSchema.methods.deleteToken = async function (token) {
    user = this;
    return await user.update({ $pull: { tokens: {token} } })
}

// Model method
UserSchema.statics.findByToken = async function (token) {
    let User = this;
    let decoded;
    try {
        decoded = jwt.verify(token, 'JWT_SECRET');
    } catch (e) {
        return null;
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

// Find a user by credentials (i.e. login)
// Model method
UserSchema.statics.findByCredentials = async function (email, password) {
    let User = this;
    let foundUser = await User.findOne({email});

    if (!foundUser) {
        return null;
    }

    let isValidUser = await bcrypt.compare(password, foundUser.password);

    if (isValidUser) {
        return foundUser;
    } else {
        return null;
    }
}

// Hashes the password on save (required when we seed the data)
// Instance method
UserSchema.pre('save', async function(next) {
    let user = this;

    if (user.isModified('password')) {
        let salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } else {
        next();
    }
})

module.exports = UserSchema;