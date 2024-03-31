const routes = require('express').Router();
const {
    getAll,
    getById,
    newThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction
} = require('../../controller/thought');

routes.route('/')
    .get(getAll)
    .post(newThought);

routes.route('/:id')
    .get(getById)
    .put(updateThought)
    .delete(deleteThought);

routes.route('/:id/reactions')
    .post(addReaction);

routes.route('/:id/reactions/:reactionId')
    .delete(removeReaction);

module.exports = routes;