let db = require('./db');
let todaysDate = new Date();

// let escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

let getUserName = (req, res) => {
	let userID = req.params.userID;
	let date = (typeof req.params.date === 'undefined') ? todaysDate : req.params.date;
	return res.send("userID: " + userID + " Date: " + date);
}

let getUserNameHistory = (req, res) => {
	let userID = req.params.userID;
	return res.send("userID: " + userID);
}

let getUserQueuedName = (req, res) => {
	let userID = req.params.userID;
	return res.send("userID: " + userID);
}

let checkIfCurrentNameExpired = (req, res) => {
	let userID = req.params.userID;
	return res.send("userID: " + userID);
}

let getExpiringNames = (req, res) => {
	return res.send("expiring usernames");
}

let setUserName = (req, res) => {
	let userID = req.params.userID;
	let startDate = (typeof req.params.startDate === 'undefined') ? todaysDate : req.params.startDate;
	return res.send("userID: " + userID + " Date: " + startDate);
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