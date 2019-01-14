const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const IS_TEST = process.env.ENV === 'test';

let api = require('./api');
let controllers = require('./controllers');

if (!IS_TEST) {
    let {mongoose} = require('./db/mongoose');
}

// Set up Express Middleware
let app = express();
app.use(bodyParser.json());

// Hook up API routes to controllers
app.use('/', api(controllers));

if (!IS_TEST) {
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
}

module.exports = {app}




