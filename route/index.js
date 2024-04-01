const routes = require('express').Router();
const api = require('./api');

routes.use('/api', api);

routes.get('/', (req, res) => {
    res.status(200).send("Express routes OK. Access API endpoints with /api");
});

module.exports = routes;