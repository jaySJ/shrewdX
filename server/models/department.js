// app/models/user.js
// load the things we need
"use strict";
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var orgSchema = mongoose.Schema({

    organization     : {
        alias        : String,
		companyStrength		 : { type: Number, default: 50 },
        desiredConfidence     : { type: Number, default: 95 }, // should always be between 0 and 99.9
		likelyResponseRt		 : { type: Number, default: 25 },
		numDepartments		 : int 	
    }
});

/*
// methods ======================
// generating a hash
orgSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// checking if password is valid
userSchema.methods.validCompanyAlias= function(alias) {
	if(alias == this.local.alias)
		return true;
	else return false; //    return compareSync();
};
*/
// create the model for users and expose it to our apphttp://www.google.com/aclk?sa=l&ai=C6r32S4N3U7iQIPC5yQHFqYCICeOqzNUEo6q-95IBm4WY8YABCAAQASDJmKILUOy9h-EGYMme1omUpJgToAHditfZA8gBAaoEKk_Qaksm00TB7srwplunUlTi5dkOdLIRJZgntIpD2YdO871pUbiTw21f5YAFkE6AB4v1qCaIBwGQBwI&sig=AOD64_0nVhx0XRvs2D_8SVCK-tSprL7vrg&rct=j&q=&ved=0CC8Q0Qw&adurl=http://www.mongodb.com/lp/whitepaper/nosql-better-faster-leaner%3F_bt%3D39419809123%26_bk%3D%252Bmongodb%26_bm%3Db
module.exports = mongoose.model('Company', orgSchema);

