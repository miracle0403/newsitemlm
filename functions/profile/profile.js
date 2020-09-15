var expressValidator = require('express-validator');
//var mail = require('./mail');
var mailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');


function bankupdate( details, db, currentUser, req, res){
	
	req.checkBody(details.bank_name, 'Bank Name must be between 8 to 15 characters').len(8,15);
	req.checkBody , (details.account_number, 'Account Number must be 10 numbers ').len(10);
	req.checkBody (details.account_name, 'Account name must be between 8 to 100 characters ').len(8, 100);
	req.checkBody(details.fullname, 'Full Name must be between 8 to 25 characters').len(8,25);
	var errors = req.validationErrors();
	
	if (errors){
		res.render('profile', {mess: 'PROFILE UPDATE FAILED', errors: errors, bank: details.bank_name, nuban: details.account_number, acc: details.account_name, fullname:details.fullname });
	}else{
		db.query('UPDATE user SET bank_name = ? account_name = ? account_number = ? fullname = ? WHERE user_id = ?', [details.bank_name, details.account_number, details.account_name, details.fullname, currentUser], function(err, results, fields){
			if (err) throw err;
			res.render('profile', {mess: "UPDATE SUCCESSFUL", success: 'Bank update successful!'});  
		});
	
	}
}


function bioupdate( details, db, currentUser, req){
	
	req.checkBody(details.email, 'Email must be between 8 to 105 characters').len(8,105);
  req.checkBody(details.email, 'Invalid Email').isEmail();
  req.checkBody(details.phone, 'Phone number must be between be 13 numbers').len(13);
  
  var errors = req.validationErrors();
  if (errors){
		res.render('profile', {mess: 'PROFILE UPDATE FAILED', errors: errors, email: details.email, phone: details.phone });
	}else{
		db.query('SELECT email FROM user WHERE email = ?', [details.email], function(err, results, fields){
			if (err) throw err;
			if (results.length > 0){
				var error = "Sorry, this email is taken";
				res.render('profile', {mess: 'PROFILE UPDATE FAILED', error: error, email: details.email, phone: details.phone });
			}else{
				db.query('SELECT phone FROM user WHERE phone = ?', ['+' + details.phone], function(err, results, fields){
					if (err) throw err;
					if (results.length > 0){
						var error = "Sorry, this phone is taken";
				res.render('profile', {mess: 'PROFILE UPDATE FAILED', error: error, email: details.email, phone: details.phone });
					}else{
						db.query('UPDATE user SET email = ? phone = ? WHERE user_id = ?', [details.email, '+' + details.phone, currentUser], function(err, results, fields){
							if (err) throw err;
							res.render('profile', {mess: "UPDATE SUCCESSFUL", success: 'Profile update successful!'}); 
						});
					}
				});
			}
		});
	}
}


function passwordChange( details, db, currentUser, req){
	
	req.checkBody(details.password, 'Password must be between 8 to 25 characters').len(8,100);
	req.checkBody(details.old_password, 'Password must be between 8 to 25 characters').len(8,100);
  req.checkBody(details.cpass, 'Password confirmation must be between 8 to 100 characters').len(8,100);
  req.checkBody(details.password, 'Password must match').equals(details.cpass);
  
  var errors = req.validationErrors();
  if (errors){
		res.render('profile', {mess: 'PROFILE UPDATE FAILED', errors: errors, oldPassword: details.old_password, password: details.password, cpass: details.cpass});
	}else{
		db.query('SELECT password FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
			if (err) throw err;
			var pash = results[0].password;
			bcrypt.compare(details.old_password, pash, function(err, response){
				if(response === false){
					//flash message
					var error = 'password change dailed';
					res.redirect('/profile');
				}else{
					bcrypt.hash(password, saltRounds, null, function(err, hash){
						db.query('UPDATE user SET password = ? WHERE user_id = ?', [hash, currentUser], function(err, results, fields){
							if(err) throw err;
							var success = 'Password change was successful';
							res.redirect('/profile')
						});
					});
				}
			});
		});
	}
}