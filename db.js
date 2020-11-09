var sql = require ('mysql');//|| require('postgres');
var server = require ('./app.js');

var pool  = sql.createPool({
  multipleStatements: true,
  connectionLimit : 100,
  waitForConnections: true,
  host: "us-cdbr-east-02.cleardb.com",
  user: "b2060941ee1661",
  password: 'fca9cdb1',
  database: "heroku_740c1559583a7cd"
}) 

pool.getConnection( function ( err, con ){
	if ( err ){
		console.log(  err)
	}
	else{
		con.query( 'SELECT 1 + 4 AS solution', function ( err, results, fields ){
			if ( err ) throw err;
			else{
			console.log( 'solution is ' + results[0].solution);
			//console.log( 'i am collins love' );
			pool.releaseConnection( con );
			}
		});
	}
});
module.exports = pool;