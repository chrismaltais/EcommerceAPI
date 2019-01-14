const mongoose = require("mongoose");
const {ObjectId} = require('mongodb');

const {Product} = require("./../../models/products");
const {testProducts, populateProducts} = require('./../seed/seed');

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
beforeEach(populateProducts);

afterEach( async () => {
    await Product.deleteMany({}); // removing all items from model!
    jest.clearAllMocks();
});

afterAll( async () => {
    mongoose.disconnect();
})