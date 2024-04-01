const routes = require('express').Router();
const {
    getAll,
    getById,
    newUser,
    addFriend,
    updateUser,
    deleteUser,
    removeFriend
} = require('../../controller/user');

routes.route('/')
    .get(getAll)
    .post(newUser);

routes.route('/:id')
    .get(getById)
    .put(updateUser)
    .delete(deleteUser);

routes.route('/:id/friends/:friendId')
    .post(addFriend)
    .delete(removeFriend);

module.exports = routes;