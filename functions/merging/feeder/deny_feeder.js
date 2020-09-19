exports.denyfeeder = function(order_id){
	db.query('CALL denyfeeder (?)', [order_id ], function(err, results, fields){
		if (err) throw err;
		res.redirect('/dashboard');
	});
}