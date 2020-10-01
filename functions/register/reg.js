
//var mail = require('./mail');

var bcrypt = require('bcrypt-nodejs');
const { validationResult, matchedData } = require('express-validator');
function rounds( err, results ){
        if ( err ) throw err;
}
var mail = require('../mail/verify.js');
const saltRounds = bcrypt.genSalt( 10, rounds);




exports.register = function(db, req, res, username, fullname, phone, password, cpass, sponsor, email, errors){
	 
	if (errors.length > 0){
		res.render('register', { mess: 'REGISTRATION FAILED', errors: errors, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname, sponsor: sponsor});
	}else{
		if (cpass !== password){
			var error = 'Password must match';
			res.render('register', { mess: 'REGISTRATION FAILED', errors: errors, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname, sponsor: sponsor, error: error});
		}else{
		db.query('SELECT username FROM user WHERE username = ?', [username], function(err, results, fields){
			if (err) throw err;
			if(results.length > 0){
				var error = "Sorry, this username is taken";
				res.render('register', { mess: 'REGISTRATION FAILED', error: error, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname,  sponsor: sponsor});
			}else{
				db.query('SELECT email FROM user WHERE email = ?', [email], function(err, results, fields){
					if (err) throw err;
					if (results.length > 0){
						var error = "Sorry, this email is taken";
						res.render('register', { mess: 'REGISTRATION FAILED', error: error, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname,     sponsor: sponsor});
					}else{
						db.query('SELECT phone FROM user WHERE phone = ?', [phone], function(err, results, fields){
							if (err) throw err;
							
							if (results.length > 0){
								var error = "Sorry, this phone number is taken";
						res.render('register', { mess: 'REGISTRATION FAILED', error: error, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname,     sponsor: sponsor});
							}else{
								db.query('SELECT username FROM user WHERE username = ?', [sponsor], function(err, results, fields){
									if (err) throw err;
									if(results.length === 0){
										db.query('SELECT user FROM default_sponsor', function(err, results, fields){
											if (err) throw err;
											var sponsor = results[0].user;
											;
											//register user
											bcrypt.hash(password, saltRounds, null, function(err, hash){
												db.query( 'INSERT INTO user (sponsor ,  full_name ,  phone ,  username ,  email ,  password) VALUES (?, ?, ?, ?, ?, ?) ', [sponsor, fullname, phone, username, email, hash ], function(err, result, fields){
													if (err) throw err;
													var success = 'Registration successful! please verify your email';
													mail.verifymail(email,   username, hash);
													res.render('/register/' + sponsor, {mess: 'REGISTRATION SUCCESSFUL', success: success});
												});
											});
										});
									}else{
										var phon =   + phone;
											//register user
										bcrypt.hash(password, saltRounds, null, function(err, hash){
											db.query( 'CALL register (?, ?, ?, ?, ?, ?, ?, ?)', [sponsor, fullname, phon, username, email, hash, 'active', 'no'], function(err, result, fields){
												if (err) throw err;
												var success = 'Registration successful! please verify your email';
												var link = 'http://localhost:3000' + '/' + username + '/' + email + '/' + hash;
												db.query('INSERT INTO verifyemail (link, email) VALUES(?,?)', [link, email], function(err, results, fields){
													if (err) throw err;
													mail.verifymail(email, username, link);
													res.render('/register' , {mess: 'REGISTRATION SUCCESSFUL', success: success, email, link, username:username});
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
	}}
}

//resend verification link 

function resendverify(email, hash, link, hbs, db, req, res){
	this.email = email;
	mail.verifymail(email,   username, link, hbs);
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
					mail.welcome(email,    hbs, details.fullname, details.username);
					res.redirect('/verify' + '/' + email + '/' + link );
				});
			});
		}
	});
}