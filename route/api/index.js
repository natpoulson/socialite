const routes = require('express').Router();
const users = require('./users');
const thoughts = require('./thoughts');

routes.use('/users', users);
routes.use('/thoughts', thoughts);

module.exports = routes;