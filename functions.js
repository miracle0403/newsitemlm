
exports.dirname = function(path){
	return path.dirname(__filename);
} 

exports.admin = function (user, db){
	db.query('SELECT user_type FROM user WHERE user_id = ? ', [user], function ( err, results, fields ){
		if( err ) throw err;
		var user_type = results[0].user_type;
		if(user_type !== 'admin'){
			var error = 'Ooops, page does not exist';
			req.flash('error', error)
			res.redirect('/404');
		}
	});
}