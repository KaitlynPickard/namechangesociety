const config = require("./config.json")
const { Pool, Client } = require('pg')

exports.query = function (sql) {
	const pool = new Pool({
	  user: config.dbuser,
	  host: config.dbhost,
	  database: config.dbdatabase,
	  password: config.dbpassword,
	  port: config.dbport,
	})

	pool.query(sql, (error, response) => {
	  console.log(response.rows)
	  pool.end()
	})
}