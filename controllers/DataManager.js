/*Control class which handles all database operation.
Currently contains implementation methods for MongoDB but
it is extensible for support of other database e.g. MySQL
*/
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//---------MongoDB implementation for User entity---------

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	}
});

var mongooseUserModel = mongoose.model('User', UserSchema);

module.exports.saveUser = function(newUser, callback){
  newUserMongooseModel = new mongooseUserModel(newUser);
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUserMongooseModel.password = hash;
	        newUserMongooseModel.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	mongooseUserModel.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	mongooseUserModel.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

//---------End of MongoDB implementation for User entity---------

//---------MongoDB implementation for Wireless@SG  entity--------

// hotspotSchema Schema
var hotspotSchema = mongoose.Schema({
	name: {
		type: String,
		index:true
	},
	description: {
		type: String
	},
	address: {
		type: String
	},
	lon: {
		type: String
	},
	lat: {
		type: String
	},
	flagList: {
		type: Array
	}
});

hotspotSchema.index({ name: 'text', description: 'text', address: 'text'});
var mongooseHotspotModel = mongoose.model('hotspots', hotspotSchema, 'hotspots');

module.exports.getHotspotByName = function(regexQuery, callback){

	//regexQuery = "\"jurong\" \"rc\""
	//console.log("Query: " + regexQuery);
	var query = {$text: {$search: regexQuery}};
	mongooseHotspotModel.find(query, callback).limit(10);
}

module.exports.getHotspotById = function(id, callback){
	mongooseHotspotModel.findById(id, callback);
}
//https://docs.mongodb.com/manual/reference/operator/query/text/#phrases
//db.hotspot.find( { $text: { $search: "\"jurong\" \"rc\"" } } ).pretty()
//---------End of MongoDB implementation for User entity---------
