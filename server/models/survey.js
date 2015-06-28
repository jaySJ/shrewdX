// app/models/user.js
// load the things we need
"use strict";
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var surveySchema = mongoose.Schema({
    surveyConfig     : {
        numquestions        : { type: Number, default: 5 },
		companyStrength		 : { type: Number, default: 50 },
        desiredConfidence     : { type: Number, default: 95 }, // should always be between 0 and 99.9
		likelyResponseRt		 : { type: Number, default: 25 },
		numDepartments		 : int 	
    }
});

// define the schema for our user model
var questionSchema = mongoose.Schema({
	question     : {
        text        : { type: Number, default: 50 },
		response		: { type: Number, default: 50 }
    }
});

// checking if password is valid
surveySchema.methods.validCompanyAlias= function(alias) {
	if(alias == this.local.alias)
		return true;
	else return false; //    return compareSync();
};
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
// create the model for users and expose it to our app 
module.exports = mongoose.model('Company', orgSchema);

