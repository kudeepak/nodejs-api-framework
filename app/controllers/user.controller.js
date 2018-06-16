const User = require('../models/user.model.js');
const secConfig = require('../../config/secret.config.js');
const jwt    = require('jsonwebtoken'); 
// Create and Save a new user
exports.create = (req, res) => {
    // Validate request
    if(!req.body.name) {
        return res.status(400).send({
            message: "Name can not be empty"
        });
    }

    if(!req.body.password) {
        return res.status(400).send({
            message: "Password can not be empty"
        });
    }

    // Create a user
    const user = new User({
        name: req.body.name, 
        password: req.body.password,
        admin: req.body.admin,
    });

    // Save Note in the database
    user.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    User.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};

// Find a single users with a userId
exports.findOne = (req, res) => {
    User.findById(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.userId
        });
    });
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.name) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }

    // Find user and update it with the request body
    Note.findByIdAndUpdate(req.params.userId, {
        name: req.body.name || "Untitled User",
        password: req.body.password
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.userId
        });
    });
};

// Delete a note with the specified userId in the request
exports.delete = (req, res) => {
    Note.findByIdAndRemove(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params.userId
        });
    });
};

// Login user and generate JWT token
exports.auth = (req, res) => {
    // Validate request
    if(!req.body.name) {
        return res.status(400).send({
            message: "Name can not be empty"
        });
    }

    if(!req.body.password) {
        return res.status(400).send({
            message: "Password can not be empty"
        });
    }

    User.authenticateUser(req.body.name, req.body.password, secConfig.secret)
    .then(data => {
        if (data == 'name') {
           data = { success: false, message: 'Authentication failed. User not found.' };
        } else if (data == 'password') {
           data = { success: false, message: 'Authentication failed. Wrong password.' };
        } else {
            const payload = {
                user: req.body.name                
             };
            var token = jwt.sign(payload, secConfig.secret, {
                expiresIn: 1440 // expires in 24 hours
            });
            data =  {
                success: true,
                message: 'Enjoy your token!',
                token: token
            }
        }
           
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while validating the user."
        });
    });
};