exports.confirmactivation(order_id){
	db.query('CALL confirmactivationpayment (?)', [order_id ], function(err, results, fields){
		if (err) throw err;
		res.redirect('/dashboard');
	});
}