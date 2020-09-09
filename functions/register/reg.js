var expressValidator = require('express-validator');
//var mail = require('./mail');
var mailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');

function register(db, req, res, bcrypt, username, fullname, phone, pass1, pass2, sponsor, email, code){
	
	req.checkBody(username, 'Username must be between 8 to 25 characters').len(8,25);
  req.checkBody(fullname, 'Full Name must be between 8 to 25 characters').len(8,25);
  req.checkBody(password, 'Password must be between 8 to 25 characters').len(8,100);
  req.checkBody(cpass, 'Password confirmation must be between 8 to 100 characters').len(8,100);
  req.checkBody(email, 'Email must be between 8 to 105 characters').len(8,105);
  req.checkBody(email, 'Invalid Email').isEmail();
  req.checkBody(code, 'Country Code must not be empty.').notEmpty();
  req.checkBody(password, 'Password must match').equals(cpass);
  req.checkBody(phone, 'Phone Number must be ten characters').len(10);
  
  var errors = req.validationErrors();
	if (errors){
		res.render('register', { mess: 'REGISTRATION FAILED', errors: errors, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname, code: code, sponsor: sponsor});
	}else{
		db.query('SELECT username FROM user WHERE username = ?', [username], function(err, results, fields){
			if (err) throw err;
			if(results.length > 0){
				var error = "Sorry, this username is taken";
				res.render('register', { mess: 'REGISTRATION FAILED', error: error, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname, code: code, sponsor: sponsor});
			}else{
				db.query('SELECT email FROM user WHERE email = ?', [email], function(err, results, fields){
					if (err) throw err;
					if (results.length > 0){
						var error = "Sorry, this email is taken";
						res.render('register', { mess: 'REGISTRATION FAILED', error: error, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname, code: code, sponsor: sponsor});
					}else{
						db.query('SELECT phone FROM user WHERE phone = ?', [phone], function(err, results, fields){
							if (err) throw err;
							var phon = results[0].phone;
							if (phon == phone){
								var error = "Sorry, this phone number is taken";
						res.render('register', { mess: 'REGISTRATION FAILED', error: error, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname, code: code, sponsor: sponsor});
							}else{
								db.query('SELECT username FROM user WHERE username = ?', [sponsor], function(err, results, fields){
									if (err) throw err;
									if(results.length === 0){
										db.query('SELECT sponsor FROM default', function(err, results, fields){
											if (err) throw err;
											var sponsor = results[0].sponsor;
											var phone = code + phone;
											//register user
											bcrypt.hash(password, saltRounds, null, function(err, hash){
												db.query( 'CALL register (?, ?, ?, ?, ?, ?, ?, ?)', [sponsor, fullname, phone, username, email, hash, 'active', 'no'], function(err, result, fields){
													if (err) throw err;
													var success = 'Registration successful! please verify your email';
													mail.verifymail(email, mailer, username, hash, link, hbs);
													res.render('/register/' + sponsor, {mess: 'REGISTRATION SUCCESSFUL', success: success});
												});
											});
										});
									}else{
										var phon = code + phone;
											//register user
										bcrypt.hash(password, saltRounds, null, function(err, hash){
											db.query( 'CALL register (?, ?, ?, ?, ?, ?, ?, ?)', [sponsor, fullname, phon, username, email, hash, 'active', 'no'], function(err, result, fields){
												if (err) throw err;
												var success = 'Registration successful! please verify your email';
												var link = 'site.com' + '/' + username + '/' + email + '/' + hash;
												db.query('INSERT INTO verifyemail (link, email) VALUES(?,?)', [link, email], function(err, results, fields){
													if (err) throw err;
													mail.verifymail(email, mailer, username, link, hbsmail);
													res.render('/register/' + sponsor, {mess: 'REGISTRATION SUCCESSFUL', success: success, email, link});
												});	
											});
										});
									}
								});
							}
						});
					}
				});
			}
		});
	}
}

//resend verification link 

function resendverify(email, mailer, hash, link, hbs, db, req, res){
	this.email = email;
	mail.verifymail(email, mailer, username, link, hbs);
	//flash message 
	var success = 'link resent';
	res.redirect('/register');
	
}

//confirm verification link 

function confirmverify(email, link, db, req, res, flashMessages){
	this.email = email;
	
	db.query('SELECT link FROM verifyemail WHERE email = ?', [email], function(err, results, fields){
		
		if (err) throw err;
		if(results.length === 0){
			var error = 'invalid link';
			//flash message
			
			res.redirect('/verify' + '/' + email + '/' + link );;
		}else{
			var success = 'Verified successfully... you can now log in to your dashboard';
			//flash message 
			db.query('UPDATE user SET verification = ? WHERE email = ? '[email], function(err, results, fields){
				if (err) throw err;
				db.query('SELECT username, fullname FROM user WHERE email = ?', [email], function(err, results, fields){
					if (err) throw err;
					var details = {
						name: results[0].fullname,
						username: results[0].username
					}
					//send welcome message 
					mail.welcome(email, mailer,  hbs, details.fullname, details.username);
					res.redirect('/verify' + '/' + email + '/' + link );
				});
			});
		}
	});
}
