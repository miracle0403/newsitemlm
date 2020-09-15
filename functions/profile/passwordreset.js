var querystring = require('querystring');

function passwordreset(details){
	
	req.checkBody(details.email, 'Email must be between 8 to 105 characters').len(8,105);
	req.checkBody(details.email, 'Invalid Email').isEmail();
	
	var errors = req.validationErrors();
	if (errors){
		res.render('passwordReset', {mess: 'Password Reset', email: details.email, errors: errors});
	}else{
		db.query('SELECT email From user WHERE email = ?', [details.email], function(err, results, fields){
		if (err) throw err;
		if (results.length === 0){
			var error = 'Email does not exist or its incorrect';
			res.redirect('/passReset');
		}else{
			var date = new Date();
				date.setMinutes(date.getMinutes() + 20);
				//generate pin
					securePin.generateString(25, charSet, function(str){
						var link = details.site + email + str;
						db.query('INSERT INTO passwordReset (details.email, expire, link) VALUES (?,?,?), [email, date, link]', function(err, results, fields){
							if(err) throw err;
		//mail it
							pass.passReset(details, link, expire);
						res.redirect('/passReset');
						});
					});
				}
		});
	}
}

function resendPass(details){
	other.db.query('Delete FROM passReset WHERE link = ?, [details.link]', function(err, results, fields){
		if(err) throw err;
		var date = new Date();
			date.setMinutes(date.getMinutes() + 20);
				//generate pin
				securePin.generateString(25, charSet, function(str){
					var link = details.site + email + str;
					other.db.query('INSERT INTO passwordReset (details.email, expire, link) VALUES (?,?,?), [email, date, link]', function(err, results, fields){
					if(err) throw err;
		//mail it
					pass.passReset(details, link, expire);
					other.res.redirect('/passReset');
				});
			});
	});
}

//confirm link
exports.confirmReset = function (details){
	db.query('SELECT link, email expire FROM passReset WHERE lino = ? && email = ?', [details.link, details.email], function(err, results, fields){
		if (err) throw err;
		var info = results[0];
		if (results.length === 0){
			var error = 'Link is invalid';
			res.redirect('/passReset');
		}else{
			var dt = new Date();
			if(dt >= info.expire){
				var error = 'Link is Expired';
				db.query('DELETE FROM passReset WHERE link = ? && expire = ?', [info.link, info.expire], function(err, results, fields){
					if (err) throw err;
					res.redirect('/passReset/' + info.email)
				});
			}else{
				if (info.link === details.link && info.user === details.user){
				res.redirect('/changePass');
				}else{
					var error = 'something went wrong.... report to us so we can fix it';
				res.redirect('/passReset');
				}
			}
		}
	});
}


exports.changePass = function(details){
	
	req.checkBody(details.password, 'Password must match').equals(details.cpass);
	req.checkBody(details.password, 'Password must be between 8 to 25 characters').len(8,100);
	req.checkBody(details.cpass, 'Password confirmation must be between 8 to 100 characters').len(8,100);
	
	var errors = req.validationErrors();
	if (errors){
		res.render('changePass', {mess: 'Password Update Failed', errors: errors, email: details.email});
	}else{
		bcrypt.hash(details.password, saltRounds, null, function(err, hash){
			db.query('UPDATE user SET password = ? WHERE email = ?', [hash, details.email], function(err, results, fields){
				if(err) throw err;
				var success = 'password change was successful';
				res.redirect('/login')
			});
		});
	}
}