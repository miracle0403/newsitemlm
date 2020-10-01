exports.denyactivation = function(orderId){
	db.query('CALL denypayment (?)', [order_id ], function(err, results, fields){
		if (err) throw err;
		res.redirect('/dashboard');
	});
}

exports.confirmactivation = function(order_id){
	db.query('CALL confirmactivation (?)', [order_id ], function(err, results, fields){
		if (err) throw err;
		res.redirect('/dashboard');
	});
}

exports.timeupctivation = function(order_id){
	var date = new Date();	
	date.setHours( getHours() + 1 );
	
	db.query('SELECT expire, order_id FROM transactions WHERE expire >= ?', [date ], function(err, results, fields){
		if (err) throw err;
		if (results.length >= 1 ){
					//write it of as expired
			db.query('UPDATE transactions SET status = ?  WHERE order_id = ?', ['expired', order_id], function(err, results, fields){
				if (err) throw err;
				db.query('UPDATE activation SET alloted = alloted - 2  WHERE user = ?', [details.username], function(err, results, fields){
					if (err) throw err;
						//mark username as spam on 2 times.
					db.query('SELECT username, amount FROM spam WHERE username = ?', [details.username], function(err, results, fields){
						if (err) throw err;
						if (results.length === 0){
							db.query('INSERT INTO spam (username, amount) VALUES (?,?)', [details.username, 1], function(err, results, fields){
								if (err) throw err;
								res.redirect('/dashboard')
							});
						}else{
							var spam = results[0].amount;
							db.query('UPDATE spam SET amount = ?  WHERE username = ?', [spam + 1, details.username], function(err, results, fields){
								if (err) throw err;
								res.redirect('/dashboard')
							});
						}
					});
				});
			});
		}
	});
}