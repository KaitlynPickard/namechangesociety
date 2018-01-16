const config = require("./config.json")
const { Pool, Client } = require('pg')

const pool = new Pool({
  user: config.dbuser,
  host: config.dbhost,
  database: config.dbdatabase,
  password: config.dbpassword,
  port: config.dbport,
})

pool.query('SELECT * FROM public."NAMES"', (err, res) => {
  console.log(err, res)
  pool.end()
})