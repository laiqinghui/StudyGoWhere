/* Entity class of User */

var name;
var username;
var password;
var email;

//Constructor
module.exports = function(name, username, password, email ){
	return {	name: name,
						email:email,
						username: username,
						password: password
					}
}
