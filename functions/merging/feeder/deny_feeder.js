exports.denyfeeder = function(order_id){
	db.query('CALL denyfeeder (?)', [order_id ], function(err, results, fields){
		if (err) throw err;
		res.redirect('/dashboard');
	});
}


exports.confirmfeeder = function(order_id){
	db.query('CALL confirmactivationpayment (?)', [order_id ], function(err, results, fields){
		if (err) throw err;
		res.redirect('/dashboard');
	});
}

exports.timeupfeeder = function() (order_id){
	
	var date = new Date();	
	date.setHours( getHours() + 1 );
	
	db.query('SELECT expire, order_id FROM transactions WHERE expire >= ?', [date ], function(err, results, fields){
		if (err) throw err;
		if (results.length >= 1 ){
			db.query('CALL timeupfeeder (?)', [order_id ], function(err, results, fields){
				if (err) throw err;
				res.redirect('/dashboard')
			});
		}
	});
}
