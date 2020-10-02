exports.route = function (affiliate, db, route, req,res, message){
	
	this.route = route;
	this.db = db;
	this.req = req;
	this.res = res;
	this.affiliate = affiliate;
	
	db.query('SELECT username FROM user WHERE username = ?',[affiliate], function(err, results, fields){
		if (err) throw err;
		
		if (results.length === 0){
			res.redirect(route)
		}else{
			res.render(route + '/' + affiliate, {mess: message, sponsor: affiliate});
		}
	});
}

exports.getProfile = function(currentUser, db, res){
	
	db.query('SELECT * FROM user WHERE user_id = ? ', [currentUser], function(err, results, fields){
		if (err) throw err;
		var type = results[0].user_Type;
		if(type == 'user'){
			var bio = results[0];
			if(bio.bank_name === '' && bio.account_number === '' && bio.account_name === ''){
				var error = 'You have not updated your profile yet';
				res.render('profile', {mess: 'User Profile', error: error, bio: bio});
			}else{
				res.render('profile', {mess: 'User Profile', bio: bio});
			}
		}else{
			if(type == 'admin'){
				var admin = results[0];
				if(admin.bank_name === '' && admin.account_number === '' && admin.account_name === ''){
					var error = 'You have not updated your profile yet';
				res.render('profile', {mess: 'User Profile', error: error, admin: admin});
				}else{
					res.render('profile', {mess: 'User Profile', admin: admin});
				}
			}
		}
	});
}
