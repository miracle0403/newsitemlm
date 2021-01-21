var sql = require ('mysql');//|| require('postgres');
var server = require ('./app.js');

var pool  = sql.createPool({
  multipleStatements: true,
  connectionLimit : 0,
  waitForConnections: true,
 host: "localhost",
  user: "newsitemlm",
  password: '',
  database: "newdb"
});

/*mysql -u root -p
YOUR_ROOT_PASSWORD_HERE
use newdb*/

pool.getConnection( function ( err, con ){
	if ( err ){
		console.log(  err)
	}
	else{
		con.query( 'SELECT 1 + 4 AS solution', function ( err, results, fields ){
			if ( err ) throw err;
			else{
			console.log( 'solution is ' + results[0].solution);
			pool.releaseConnection( con );
			}
		});
	}
});

module.exports = pool