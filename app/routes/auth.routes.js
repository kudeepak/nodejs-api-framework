module.exports = (app) => {
    const users = require('../controllers/user.controller.js');
    app.post('/auth', users.auth);
}