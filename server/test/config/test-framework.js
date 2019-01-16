const mongoose = require("mongoose");
const {ObjectId} = require('mongodb');

const {Product} = require("./../../models/products");
const {User} = require("./../../models/users");
const {Cart} = require("./../../models/carts");
const {testProducts, populateDB} = require('./../seed/seed');

const mongoURI = global.__MONGO_URI__;

beforeAll(async () => {
    mongoose.connect(mongoURI, {useNewUrlParser: true}, (err) => {
        if (err) {
            console.log("Could not connect to database!");
        } else {
            console.log("Successfully connected to test database");
        }
    });
    //mongoose.Promise = Promise;
});

// Clear DB to allow for proper testing
beforeEach(populateDB);

afterEach( async () => {
    await Product.deleteMany({}); // removing all items from model!
    await User.deleteMany({});
    await Cart.deleteMany({});
    jest.clearAllMocks();
});

afterAll( async () => {
    mongoose.disconnect();
})