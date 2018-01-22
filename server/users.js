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

let setUserName = (req, res) => {
	let userID = req.params.userID;
	let newFirstName = req.params.firstName;
	let newLastName = req.params.lastName;
	let newNameStartDate = (typeof req.params.startDate === 'undefined') ? todaysDate : new Date(req.params.startDate);
	let newNameEndDate = (typeof req.params.startDate === 'undefined') ? todaysDate : new Date(req.params.startDate);
	let oldNameEndDate = (typeof req.params.startDate === 'undefined') ? todaysDate : new Date(req.params.startDate);

	let numDaysNameIsValid = 364;
	// let newNameEndDate = new Date(newNameStartDate.getDate());
	newNameEndDate.setDate(newNameEndDate.getDate() + numDaysNameIsValid);
	
	// let oldNameEndDate = new Date(newNameStartDate.getDate());
	oldNameEndDate.setDate(oldNameEndDate.getDate() - 1);

	console.log(newNameStartDate);
	console.log(newNameEndDate);
	console.log(oldNameEndDate);

	// check that the start date the user has selected is no more than 7 days in the future
	// TODO

	// check that the user has not previously used this name
	// TODO

	// check that the user does not already have a new name queued
	// TODO

	// check no one else has the new name currently
	let result = db.query('SELECT names.* FROM public."NAMES" names \
		INNER JOIN (SELECT "USERID", MAX("ENDDATE") AS MaxEndDate FROM public."NAMES" WHERE "FIRSTNAME" = $1 AND "LASTNAME" = $2 GROUP BY "USERID") latestnames \
		ON names."USERID" = latestnames."USERID" AND names."ENDDATE" = latestnames.MaxEndDate', [newFirstName, newLastName])
	.then(result => {
		if (result.length == 0) {
			// Update the entry for the users old name so that it is set to end the day before the new name starts
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
		} else {
			return res.send("This name is currently taken");
		}
    })
	.catch(function () {
		console.log("Promise Rejected");
	});
}

exports.getUserName = getUserName;
exports.getUserNameHistory = getUserNameHistory;
exports.getUserQueuedName = getUserQueuedName;
exports.checkIfCurrentNameExpired = checkIfCurrentNameExpired;
exports.getExpiringNames = getExpiringNames;
exports.setUserName = setUserName;



// let getUser = (req, res) => {
// 	let id = req.params.id;
// 	console.log(id)

// 	let result = db.query('SELECT * FROM public."NAMES" WHERE "USERID" = $1', [id])
// 		.then(result => {
//             return res.send(result[0].FIRSTNAME);
//         })
// 		.catch(function () {
//  			console.log("Promise Rejected");
// 		});
// }