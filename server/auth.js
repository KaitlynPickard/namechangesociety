let db = require('./db');
let crypto = require('crypto');
let shortid = require('shortid');
let users = require('./users');
let todaysDate = new Date();

// let escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

let createUser = (req, res) => {
	let firstName = req.params.firstName;
	let lastName = req.params.lastName;
	let plainTextPassword = req.params.password;

	let numDaysNameIsValid = 364;
	let nameEndDate = new Date();
	nameEndDate.setDate(nameEndDate.getDate() + numDaysNameIsValid);

	// Create a new user ID - the validateNewName function requires an ID to be passed
	let newUser = createUserID()
		.then(userID => {
			// Validate the first name entry for the user - we do not want to create their account without a valid name to enter
			let validateName = users.validateNewName(userID, firstName, lastName, todaysDate)
				.then(result => {
					// If the name is valid, continue with the creation of the new user, and create an entry for their initial name
					let newSalt = createSalt()
						.then(salt => {
							let hashedPassword = createHashedPassword(plainTextPassword, salt);
							let createNewUser = db.query('INSERT INTO public."USERS"("USERID", "SALT", "PASSWORD") \
								VALUES ($1, $2, $3)', [userID, salt, hashedPassword])
								.then(result => {
									let createNewName = db.query('INSERT INTO public."NAMES"(\
											"USERID", "FIRSTNAME", "LASTNAME", "STARTDATE", "ENDDATE") \
											VALUES ($1, $2, $3, $4, $5);', [userID, firstName, lastName, todaysDate, nameEndDate])
										.then(result => {
											return res.send("UserID: " + userID + " with name " + firstName + " " + lastName + " has been created.");
										})
										.catch(function (error) {
											return res.send("ERROR: " + error);
										});
								})
								.catch(function (error) {
					 				return res.send("ERROR: " + error);
								});
						})
						.catch(function (error) {
							return res.send("ERROR: " + error);
						});
				})
				.catch(function (error) {
					return res.send("ERROR: " + error);
				});
		})
		.catch(function (error) {
			return res.send("ERROR: " + error);
		});
}

function createUserID() {
	let userID = shortid.generate(); // generates random id that is 9 characters long eg. Sk7l1q4Bf

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
 				reject("DB connection failed while trying to create new userID.");
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
 				reject("DB connection failed while trying to create new salt value.");
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