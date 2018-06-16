const mongoose = require('mongoose');
const jwt    = require('jsonwebtoken'); 
const UserSchema = mongoose.Schema({
    name: String, 
    password: String, 
    admin: Boolean 
}, {
    timestamps: true
});


UserSchema.statics.authenticateUser = function(name, password, superSecret) {    
  // find the user
  return this.findOne({
     name: name
   }, function(err, user) {
     if (err) throw err;
     if (!user) {
       return 'name';
     } else if (user) {
       // check if password matches
       if (user.password != password) {
         return 'password';
       } else {
         // if user is found and password is right
         return true
       }
     }
  });
}

module.exports = mongoose.model('User', UserSchema);