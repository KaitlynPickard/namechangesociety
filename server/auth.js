let db = require('./db');
let shortid = require('shortid');
let todaysDate = new Date();

// let escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

let createUser = (req, res) => {
	// let plainTextPassword = req.params.password;
	let userID = createUserID()
		.then(result => {
			return res.send(result.toString())
		})
		.catch(function () {
			console.log("Promise Rejected");
		});
}

function createUserID() {	
	let userID = shortid.generate(); // generates random id that is 9 characters long and is a mix of number and letters - eg. Sk7l1q4Bf

	return new Promise((resolve, reject) => {
		let result = db.query('SELECT COUNT("USERID") as count FROM public."USERS" WHERE "USERID" = $1', [userID])
			.then(result => {
				if (result[0].count == 0) {
					resolve(userID);
				} else {
					return createUserID();
				}
			})
			.catch(function () {
 				console.log("Promise Rejected");
			});
	});
}

function createSalt() {

}

function createHashedPassword(password) {

}

let authenticateUser = (req, res) => {

}

let authenticateAdmin = (req, res) => {

}

exports.createUser = createUser;
exports.authenticateUser = authenticateUser;
exports.authenticateAdmin = authenticateAdmin;