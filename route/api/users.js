const routes = require('express').Router();
const {
    getAll,
    getById
} = require('../../controller/user');

routes.route('/').get(getAll);

routes.route('/:id').get(getById);

module.exports = routes;