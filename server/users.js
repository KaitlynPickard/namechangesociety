let db = require('./db');

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
	let minID = 111111;
	let maxID = 999999;
	let userID = Math.floor(Math.random() * (maxID - minID + 1) ) + minID;
	
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

let getAllUsers = (req, res) => {
	let id = req.params.id;

	let result = db.query('SELECT * FROM public."NAMES"', [])
		.then(result => {
            return res.send(result);
        })
		.catch(function () {
 			console.log("Promise Rejected");
		});
}

let getUser = (req, res) => {
	let id = req.params.id;
	console.log(id)

	let result = db.query('SELECT * FROM public."NAMES" WHERE "USERID" = $1', [id])
		.then(result => {
            return res.send(result[0].FIRSTNAME);
        })
		.catch(function () {
 			console.log("Promise Rejected");
		});
}

exports.getUser = getUser;
exports.getAllUsers = getAllUsers;
exports.createUser = createUser;

// let findAll = (req, res, next) => {

//     let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 12,
//         page = req.query.page ? parseInt(req.query.page) : 1,
//         search = req.query.search,
//         min = req.query.min,
//         max = req.query.max,
//         whereParts = [],
//         values = [];

//     if (search) {
//         values.push(escape(search));
//         whereParts.push("beer.name || beer.tags || brewery.name ~* $" + values.length);
//     }
//     if (min) {
//         values.push(parseFloat(min));
//         whereParts.push("beer.alcohol >= $" + values.length);
//     }
//     if (max) {
//         values.push(parseFloat(max));
//         whereParts.push("beer.alcohol <= $" + values.length);
//     }

//     let where = whereParts.length > 0 ? ("WHERE " + whereParts.join(" AND ")) : "";

//     let countSql = "SELECT COUNT(*) from beer INNER JOIN brewery on beer.brewery_id = brewery.id " + where;

//     let sql = "SELECT beer.id, beer.name, alcohol, tags, image, brewery.name as brewery " +
//                 "FROM beer INNER JOIN brewery on beer.brewery_id = brewery.id " + where +
//                 " ORDER BY beer.name LIMIT $" + (values.length + 1) + " OFFSET $" +  + (values.length + 2);

//     db.query(countSql, values)
//         .then(result => {
//             let total = parseInt(result[0].count);
//             db.query(sql, values.concat([pageSize, ((page - 1) * pageSize)]))
//                 .then(products => {
//                     return res.json({"pageSize": pageSize, "page": page, "total": total, "products": products});
//                 })
//                 .catch(next);
//         })
//         .catch(next);
// };

// let findById = (req, res, next) => {
//     let id = req.params.id;

//     let sql = "SELECT beer.id, beer.name, alcohol, tags, image, brewery.name as brewery FROM beer " +
//         "INNER JOIN brewery on beer.brewery_id = brewery.id " +
//         "WHERE beer.id = $1";

//     db.query(sql, [id])
//         .then(product => res.json(product[0]))
//         .catch(next);
// };

// exports.findAll = findAll;
// exports.findById = findById;