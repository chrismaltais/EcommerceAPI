const _ = require('lodash');

const {User} = require('./../models/users');
const {Product} = require('./../models/products');
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

async function getCartProducts(cartId) {
    let cart = await Cart.findById(cartId);
    return cart.products;
}

async function getCart(cartId) {
    let allCartInfo = await Cart.findById(cartId);
    let cart = _.pick(allCartInfo, ['total', 'products']);
    return cart;
}

async function editCart(user, cartId, sku, quantity) {
    // Find product with SKU and edit quantity to be: 
    let productExists = await checkProductExistsInCart(cartId, sku);
    if (!productExists) {
        await addToCart(user, sku);
    }
    
    if (quantity == 0) {
        await Cart.findOneAndUpdate({_id: cartId, "products.sku": sku}, { $pull: {products: { sku : sku } } }, {new: true});
    } else {
        await Cart.findOneAndUpdate({_id: cartId, "products.sku": sku}, {"products.$.quantity": quantity});
    }

    let total = await calculateCartTotal(cartId);
    let cartBloated = await Cart.findByIdAndUpdate(cartId, {total: total}, {new: true} );
    let cart = _.pick(cartBloated, ['total', 'products']);
    return cart;
}

async function calculateCartTotal(cartId) {
    let products = await getCartProducts(cartId);
    total = 0;
    for (let i = 0; i < products.length; i++) {
        total = total + products[i].quantity * products[i].price;
    }
    return total;
}

async function checkProductExistsInCart(cartId, sku) { 
    let exists = await Cart.findOne({_id: cartId, "products.sku": sku});
    if (!exists) {
        return false;
    }
    return true;
}

async function addToCart(user, sku) {
    let cartExists = await checkCartExists(user);
    if (!cartExists) {
        user = await createCart(user);
    }
    let cartID = await getCartID(user);

    let product = await Product.findOne({sku: sku});
    let coreProductInfo = _.pick(product, ['title', 'price', 'sku']);

    let isInCart = await checkProductExistsInCart(cartID, sku);
    if(!isInCart) {
        coreProductInfo.quantity = 1;
        await Cart.findByIdAndUpdate(cartID, { $push: { products : coreProductInfo} });
    } else {
        await Cart.findOneAndUpdate({_id: cartID, "products.sku": sku },  { $inc: { "products.$.quantity" : 1}})
    }
    let productAdded = await Cart.findOneAndUpdate({_id: cartID, "products.sku": sku },  { $inc: { total : product.price}}, {new: true});
    return productAdded;
}

async function checkValidInventory(cartId) {
    productsFromCart = await getCartProducts(cartId);
    let invalidProducts = [];
    for (let i = 0; i < productsFromCart.length; i++) {
        let product = await Product.findOne({ sku : productsFromCart[i].sku});
        if (productsFromCart[i].quantity > product.inventory_count) {
            let item = {
                title: product.title,
                sku: product.sku,
                quantityInCart: productsFromCart[i].quantity,
                inventoryAvailable: product.inventory_count
            }
            invalidProducts.push(item);
        }
    }
    return invalidProducts;
}

async function purchaseCart(cartId) {
    productsFromCart = await getCartProducts(cartId);
    for (let i = 0; i < productsFromCart.length; i++) {
        let product = await Product.findOneAndUpdate({ 
            sku : productsFromCart[i].sku
        }, { 
            $inc: {
                inventory_count: -productsFromCart[i].quantity
            }
        });
    }
    let cart = await Cart.findById(cartId);
    return cart.total;
}

async function removeCart(user) {
    await User.findByIdAndUpdate(user._id, { $set: {cart: null}}, {new: true});
}

module.exports = {
    login,
    checkCartExists,
    getCartID,
    createCart,
    getCartProducts,
    checkValidInventory,
    getCart,
    addToCart,
    editCart,
    purchaseCart,
    removeCart
}