exports.merge = function (details, currentUser){
	db.query('SELECT username FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
		if (err ) throw err;
		var details = results[0];
		db.query('SELECT username FROM feeder WHERE user_id = ?', [currentUser], function(err, results, fields){
			if (err ) throw err;
			if(results.length === 0){
				
			}
		});
	});
}