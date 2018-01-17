let db = require("./server/db.js");

let result = db.query('SELECT * FROM public."NAMES"', [])
			.then(result => console.log(result[0].FIRSTNAME))
			.catch(function () {
     console.log("Promise Rejected");
});

// var http = require('http');

// var server = http.createServer(function(request, response) {
// 	console.log("Got a request");
// 	response.write("hi");
// 	response.end();
// });

// server.listen(3000);