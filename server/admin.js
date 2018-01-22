let db = require('./db');
let todaysDate = new Date();

// let escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

let getAllUsersNames = (req, res) => {
	let date = (typeof req.params.date === 'undefined') ? todaysDate : req.params.date;
	return res.send(" Date: " + date);
}

let getAllQueuedNames = (req, res) => {
	return res.send("List of all queued name changes");
}

let getExpiredNames = (req, res) => {
	return res.sent("List of all users whose current name has expired");
}

exports.getAllUsersNames = getAllUsersNames;
exports.getAllQueuedNames = getAllQueuedNames;
exports.getExpiredNames = getExpiredNames;

// let getAllUsers = (req, res) => {
// 	let id = req.params.id;

// 	let result = db.query('SELECT * FROM public."NAMES"', [])
// 		.then(result => {
//             return res.send(result);
//         })
// 		.catch(function () {
//  			console.log("Promise Rejected");
// 		});
// }