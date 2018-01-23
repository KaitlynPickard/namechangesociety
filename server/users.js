let db = require('./db');
let todaysDate = new Date();
let tomorrowsDate = new Date();
tomorrowsDate.setDate(tomorrowsDate.getDate() + 1);

// let escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

let getUserName = (req, res) => {
	let userID = req.params.userID;
	let date = (typeof req.params.date === 'undefined') ? todaysDate : req.params.date;

	let result = getUserNameForDate(userID, date)
		.then(result => {
			return res.send(result);
		})
		.catch(function () {
		console.log("Promise Rejected");
		});
}

function getUserNameForDate(userID, date) {
	return new Promise((resolve, reject) => {
		let result = db.query('SELECT "FIRSTNAME", "LASTNAME" FROM public."NAMES" WHERE "USERID" = $1 AND "STARTDATE" <= $2 AND "ENDDATE" >= $2', [userID, date])
			.then(result => {
				resolve(result);
			})
			.catch(function () {
 				console.log("Promise Rejected");
			});
	});
}

let getUserNameHistory = (req, res) => {
	let userID = req.params.userID;

	let result = db.query('SELECT "FIRSTNAME", "LASTNAME" FROM public."NAMES" WHERE "USERID" = $1', [userID])
	.then(result => {
        return res.send(result);
    })
	.catch(function () {
		console.log("Promise Rejected");
	});
}

let getUserQueuedName = (req, res) => {
	let userID = req.params.userID;

	let result = db.query('SELECT "FIRSTNAME", "LASTNAME" FROM public."NAMES" WHERE "USERID" = $1 AND "STARTDATE" > $2', [userID, todaysDate])
	.then(result => {
        return res.send(result);
    })
	.catch(function () {
		console.log("Promise Rejected");
	});
}

let checkIfCurrentNameExpired = (req, res) => {
	let userID = req.params.userID;

	let result = getUserNameForDate(userID, todaysDate)
		.then(result => {
			if (result.length == 0) {
				return res.send(true);
			} else {
				return res.send(false);
			}
		})
		.catch(function () {
		console.log("Promise Rejected");
		});
}

let getExpiringNames = (req, res) => {
	let daysUntilExpirey = 28;

	var expireyDate = new Date();
	expireyDate.setDate(expireyDate.getDate() + daysUntilExpirey);

	let result = db.query('SELECT names.* FROM public."NAMES" names \
		INNER JOIN (SELECT "USERID", MAX("ENDDATE") AS MaxEndDate FROM public."NAMES" GROUP BY "USERID") latestnames \
		ON names."USERID" = latestnames."USERID" AND names."ENDDATE" = latestnames.MaxEndDate WHERE names."ENDDATE" < $1', [expireyDate])
	.then(result => {
        return res.send(result);
    })
	.catch(function () {
		console.log("Promise Rejected");
	});
}

function validateNewName(userID, newFirstName, newLastName, newNameStartDate) {
	return new Promise((resolve, reject) => {
		// Check that the user does not already have a name queued
		let result = db.query('SELECT * FROM public."NAMES" WHERE "USERID" = $1 AND "STARTDATE" > $2', [userID, todaysDate])
		.then(result => {
			if (result.length == 0) {
				// Check that the user has not previously used this name
				let result = db.query('SELECT * FROM public."NAMES" WHERE "USERID" = $1 AND "FIRSTNAME" = $2 AND "LASTNAME" = $3', [userID, newFirstName, newLastName])
				.then(result => {
					if (result.length == 0) {
						// Check if any other users have this name on the date it will start being in use
						let result = db.query('SELECT * FROM public."NAMES" WHERE "FIRSTNAME" = $1 AND "LASTNAME" = $2 AND "STARTDATE" <= $3 AND "ENDDATE" >= $3', [newFirstName, newLastName, newNameStartDate])
						.then(result => {
							if (result.length == 0) {
								resolve();
							} else {
								reject("ERROR - This name is taken for the period in which you wish to use it.");
							}
					    })
						.catch(function () {
							console.log("Promise Rejected");
						});
					} else {
						reject("ERROR - You have already used this name previously.");
					}
			    })
				.catch(function () {
					console.log("Promise Rejected");
				});
			} else {
				reject("ERROR - You already have a name queued.");
			}
		})
		.catch(function () {
			console.log("Promise Rejected");
		});
	});
}

let setUserName = (req, res) => {
	let userID = req.params.userID;
	let newFirstName = req.params.firstName;
	let newLastName = req.params.lastName;
	let newNameStartDate = (typeof req.params.startDate === 'undefined') ? new Date(tomorrowsDate.toString()) : new Date(req.params.startDate);

	let numDaysCanQueue = 7;
	let maxStartDate = new Date(todaysDate.toString());
	maxStartDate.setDate(maxStartDate.getDate() + numDaysCanQueue);

	if (newNameStartDate > maxStartDate) {
		return res.send("ERROR - start date is more than " + numDaysCanQueue + " days in the future.");
	}

	let numDaysNameIsValid = 364;
	let newNameEndDate = new Date(newNameStartDate.toString());
	newNameEndDate.setDate(newNameEndDate.getDate() + numDaysNameIsValid);
	
	let oldNameEndDate = new Date(newNameStartDate.toString());
	oldNameEndDate.setDate(oldNameEndDate.getDate() - 1);

	let validation = validateNewName(userID, newFirstName, newLastName, newNameStartDate)
	.then(result => {
		// Update the user's old name so that it is set to end the day before their new name starts
		let updateOldName = db.query('UPDATE public."NAMES" SET "ENDDATE" = $1 WHERE "USERID" = $2 AND "ENDDATE" = \
			(SELECT MAX("ENDDATE") FROM public."NAMES" WHERE "USERID" = $2)', [oldNameEndDate, userID])
		.then(result => {
			// Create an entry for the new name to start on the day defined by the user
			let createNewName = db.query('INSERT INTO public."NAMES"(\
				"USERID", "FIRSTNAME", "LASTNAME", "STARTDATE", "ENDDATE") \
				VALUES ($1, $2, $3, $4, $5);', [userID, newFirstName, newLastName, newNameStartDate, newNameEndDate])
			.then(result => {
				return res.send("New name has been successfully queued");
			})
			.catch(function () {
				console.log("Promise Rejected");
			});
		})
		.catch(function () {
			console.log("Promise Rejected");
		});
	})
	.catch(function (error) {
		console.log(error);
	});
}

exports.getUserName = getUserName;
exports.getUserNameHistory = getUserNameHistory;
exports.getUserQueuedName = getUserQueuedName;
exports.checkIfCurrentNameExpired = checkIfCurrentNameExpired;
exports.getExpiringNames = getExpiringNames;
exports.setUserName = setUserName;