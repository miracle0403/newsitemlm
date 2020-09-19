exports.denyactivation = function(orderId){
	db.query('CALL denypayment (?)', [order_id ], function(err, results, fields){
		if (err) throw err;
		res.redirect('/dashboard');
	});
}