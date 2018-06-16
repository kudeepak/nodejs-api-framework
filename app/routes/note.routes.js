module.exports = (app) => {
    const notes = require('../controllers/note.controller.js');
    const VerifyToken = require('../../util/verifyJWT.js');
    // Create a new Note
    app.post('/note', VerifyToken, notes.create);

    // Retrieve all Notes
    app.get('/note', VerifyToken, notes.findAll);

    // Retrieve a single Note with noteId
    app.get('/note/:noteId', VerifyToken, notes.findOne);

    // Update a Note with noteId
    app.put('/note/:noteId', VerifyToken, notes.update);

    // Delete a Note with noteId
    app.delete('/note/:noteId', VerifyToken, notes.delete);
}