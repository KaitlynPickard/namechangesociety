let db = require('./db');
let crypto = require('crypto');
let shortid = require('shortid');

// let escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

let createUser = (req, res) => {
	let plainTextPassword = req.params.password;
	let newUser = createUserID()
		.then(userID => {
			let newSalt = createSalt()
			.then(salt => {
				let hashedPassword = createHashedPassword(plainTextPassword, salt);
				return res.send(userID.toString() + " : " + salt.toString() + " : " + hashedPassword);
			})
			.catch(function () {
				console.log("Promise Rejected");
			});
			// return res.send(result.toString())
		})
		.catch(function () {
			console.log("Promise Rejected");
		});
}

function createUserID() {
	// TODO make sure this doesn't include special characters
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
	let saltLength = 32;
	let salt = crypto.randomBytes(Math.ceil(saltLength/2))
        .toString('hex')
        .slice(0,saltLength);

	return new Promise((resolve, reject) => {
		let result = db.query('SELECT COUNT("SALT") as count FROM public."USERS" WHERE "SALT" = $1', [salt])
			.then(result => {
				if (result[0].count == 0) {
					resolve(salt);
				} else {
					return createSalt();
				}
			})
			.catch(function () {
 				console.log("Promise Rejected");
			});
	});
}

function createHashedPassword(password, salt) {
	let hashedPassword = crypto.createHmac('sha256', salt)
       .update(password)
       .digest('hex');
	return hashedPassword;
}

let authenticateUser = (req, res) => {

}

let authenticateAdmin = (req, res) => {

}

exports.createUser = createUser;
exports.authenticateUser = authenticateUser;
exports.authenticateAdmin = authenticateAdmin;