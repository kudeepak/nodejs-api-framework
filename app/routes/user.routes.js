module.exports = (app) => {
    const users = require('../controllers/user.controller.js');
    const VerifyToken = require('../../util/verifyJWT.js');
    // Create a new user
    app.post('/user', users.create);

    // Retrieve all users
    app.get('/user', VerifyToken, users.findAll);

    // Retrieve a single user with userId
    app.get('/user/:userId', VerifyToken, users.findOne);

    // Update a user with userId
    app.put('/user/:userId', VerifyToken, users.update);

    // Delete a user with userId
    app.delete('/user/:userId', VerifyToken, users.delete);
}
