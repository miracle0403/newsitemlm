var mysql = require ('mysql');
var server = require ('./app.js');

var pool  = mysql.createPool({
  multipleStatements: true,
  connectionLimit : 100,
  waitForConnections: true,
  host: "localhost",
  user: "newuser",
  password: 'user_password',
  database: "newdb"
});

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