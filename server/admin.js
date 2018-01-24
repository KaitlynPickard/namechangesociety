let db = require('./db');
let todaysDate = new Date();

// let escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

let getAllUsersNames = (req, res) => {
	let date = (typeof req.params.date === 'undefined') ? new Date(todaysDate.toString()) : new Date(req.params.date);
	let result = db.query('SELECT "FIRSTNAME", "LASTNAME" FROM public."NAMES" WHERE "STARTDATE" <= $1 AND "ENDDATE" >= $1', [date])
		.then(result => {
			return res.send(result);
		})
		.catch(function (error) {
			return res.send("ERROR: " + error);
		});
}

let getAllQueuedNames = (req, res) => {
	let result = db.query('SELECT "FIRSTNAME", "LASTNAME" FROM public."NAMES" WHERE "STARTDATE" > $1', [todaysDate])
	.then(result => {
        return res.send(result);
    })
	.catch(function (error) {
		return res.send("ERROR: " + error);
	});
}

// TODO
// this function can be combined with getExpiringNames into one function that takes a date variable
let getExpiredNames = (req, res) => {
	let result = db.query('SELECT names."FIRSTNAME", names."LASTNAME" FROM public."NAMES" names \
		INNER JOIN (SELECT "USERID", MAX("ENDDATE") AS MaxEndDate FROM public."NAMES" GROUP BY "USERID") latestnames \
		ON names."USERID" = latestnames."USERID" AND names."ENDDATE" = latestnames.MaxEndDate WHERE names."ENDDATE" < $1', [todaysDate])
	.then(result => {
        return res.send(result);
    })
	.catch(function (error) {
		return res.send("ERROR: " + error);
	});
}

exports.getAllUsersNames = getAllUsersNames;
exports.getAllQueuedNames = getAllQueuedNames;
exports.getExpiredNames = getExpiredNames;