const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

let api = require('./api');
let controllers = require('./controllers');
let {mongoose} = require('./db/mongoose');

// Set up Express Middleware
let app = express();
app.use(bodyParser.json());

// Hook up API routes to controllers
app.use('/', api(controllers));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});



