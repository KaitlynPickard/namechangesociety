const { Pool, Client } = require('pg')

const pool = new Pool({
  user: 'master',
  host: 'namechangesociety.czbofrhxjkpq.ap-southeast-2.rds.amazonaws.com',
  database: 'namechanges',
  password: 'mypassword',
  port: 5432,
})

pool.query('SELECT * FROM public."NAMES"', (err, res) => {
  console.log(err, res)
  pool.end()
})