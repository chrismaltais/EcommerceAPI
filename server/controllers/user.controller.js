const {User} = require('./../models/users');
const {Cart} = require('./../models/carts');

async function login (email, password) {
    let foundUser = await User.findByCredentials(email, password);
    if (!foundUser) {
        return null;
    }
    let token = await foundUser.generateAuthToken();
    return token;
}

async function checkCartExists (user) {
    if (!user.cart) {
        return false;
    } 
    return true;
}

async function createCart(user) {
    let cart = await new Cart();
    cart.save();
    return await User.findByIdAndUpdate(user._id, { $set: { cart: cart._id }}, {new: true});
}

async function getCartID(user) {
    return user.cart;
}

async function getCartContents(cartId) {
    let cart = await Cart.findById(cartId);
    return cart.products;
}

module.exports = {
    login,
    checkCartExists,
    getCartID,
    createCart,
    getCartContents

}