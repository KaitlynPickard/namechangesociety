const { Pool, Client } = require('pg');
const config = require("./config.json");
const databaseConnection = {
	user: config.dbuser,
	host: config.dbhost,
	database: config.dbdatabase,
	password: config.dbpassword,
	port: config.dbport,
};

exports.query = function (sql, values) {

	return new Promise((resolve, reject) => {
		let pool;
		try {
			pool = new Pool(databaseConnection);
		}
		catch (e) {
			done();
			reject(e);
		}
        pool.connect(function (err, conn, done) {

            if (err) return reject(err);
            try {
                conn.query(sql, values, function (err, result) {
                    done();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.rows);
                    }
                });
                pool.end();
            }
            catch (e) {
                done();
                reject(e);
                pool.end();
            }
        });

    });
}