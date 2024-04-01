// Declare express, mongo database, and routes
const express = require('express');
const mongo = require('./config/database');
const routes = require('./route');

// Initialisers - Express
const PORT = 3001;
const app = express();

// Middleware and Route Declaration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);

// Wait until DB service is active to start listening for requests
mongo.once('open', () => {
    app.listen(PORT, () => {
        console.log(`Now listening on port ${PORT}`);
    });
});