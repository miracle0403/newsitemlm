'use strict';

var paystack = require('paystack')('pk_test_a4e3579de9e0ee17f9bb6fcc79653ab81da4d895');
const nodemailer =  require('nodemailer');
var ensureLoggedIn = require( 'connect-ensure-login' ).ensureLoggedIn
var express = require('express');
var router = express.Router();
var ensureLoggedIn =  require('connect-ensure-login').ensureLoggedIn
var mailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');


var passport = require('passport'); 
var securePin = require('secure-pin');
var charSet = new securePin.CharSet();
charSet.addLowerCaseAlpha().addUpperCaseAlpha().addNumeric().randomize();
var db = require('../db.js');
var password = require('../functions/profile/passwordreset');
var querystring = require('querystring');

//var expressValidator = require('express-validator');

var { check, validationResult } = require('express-validator');


var link = require('../functions/routes/route-link');
var bcrypt = require('bcrypt-nodejs');
var verify = require('../nodemailer/verify');
var profile = require('../functions/profile/profile');

//var bcrypt = require('../functions/other/bcrypt');

function rounds( err, results ){
        if ( err ) throw err;
}

const saltRounds = bcrypt.genSalt( 10, rounds);

/*var pool  = db.createPool({
  connectionLimit : 100,
  multipleStatements: true, 
  waitForConnections: true,
  host: "localhost",
  user: "root",
//  password: 'new',
  database: "new"
});*/

/* GET home page. */
router.get('/', function(req, res, next) {
		var message = 'Site Name';
  res.render('index', { mess: message });
});


router.get('/ref=:username', function(req, res, next) {
	var username = req.params.username;
	
		var rout = '/';
		link.route(username, db, rout, req, res);
});

router.get('/passwordreset', function(req, res, next) {
		var message = 'Site Name';
  res.render('passwordreset', { mess: message + '  |  Password Reset'});
});

router.get('/resendPass/email=:email/link=:link', function(req, res, next) {
	var details = req.params;
	password.resendPass(details)
});

router.get('/changePass/email=:email', function(req, res, next) {
	var details = req.params;
	password.changePass(details)
});


router.get('/confirmPass/email=:email/link=:link', function(req, res, next) {
	var details = req.params;
	password.confirmReset(details)
});



//faq
router.get('/faq', function(req, res, next) {
		var message = 'FAQ';
  res.render('faq', { mess: message });
});

router.get('/faq/ref=:username', function(req, res, next) {
		var username = req.params.username;
		var route = '/faq';
		link.route(username, db, route, req, res);
});

//promote
router.get('/promote_us', function(req, res, next) {
		var message = 'FAQ';
  res.render('promote', { mess: message });
});

router.get('/promote_us/ref=:username', function(req, res, next) {
		var username = req.params.username;
		var route = '/promote_us';
		link.route(username, db, route, req, res);
});

router.get('/dashboard', ensureLoggedIn('/login'), function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	db.query( 'SELECT * FROM user WHERE user_id = ?', [currentUser], function ( err, results, fields ){
  	if( err ) throw err;
  	var bio = results[0];
  	if(bio.bank_name === null){
  		res.redirect('/profile');
  	}else{
  		if (bio.user_type === 'user' && bio.activated === 'No'){
  			db.query( 'SELECT * FROM transactions WHERE payer_username = ?', [bio.username], function ( err, results, fields ){
  				if( err ) throw err;
  				if(results.length === 0){
  					var flashMessages = res.locals.getMessages();
						if (flashMessages.mergeerror){
							res.render( 'dashboard', {
								mess: 'USER DASHBOARD',
								bio: bio,
								showErrors: true,
								mergeerror: flashMessages.mergeerror,
								noactimerge:'no merging',
								unactivate: 'You are not yet activated'
							});
						}else if (flashMessages.success) {
							res.render( 'dashboard', {
								mess: 'USER DASHBOARD',
								bio: bio,
								showSuccess: true,
								success: flashMessages.success,
								noactimerge:'no merging',
								unactivate: 'You are not yet activated'
							});
						}else{
							res.render('dashboard', { mess: 'USER DASHBOARD', noactimerge:'no merging', unactivate: 'You are not yet activated'});
						}
  				}else{
  					var actimerge = results[0];
  					var timeleft = new Date().getHours(actimerge.expire) + 1;
  					var flashMessages = res.locals.getMessages();
  					if (flashMessages.mergeerror){
							res.render( 'dashboard', {
								mess: 'USER DASHBOARD',
								bio: bio,
								showErrors: true,
								mergeerror: flashMessages.mergeerror,
								timeleft: timeleft,
								actimerge: actimerge,
								unactivate: 'You are not yet activated'
							});
						}else if (flashMessages.success){
							res.render( 'dashboard', {
								mess: 'USER DASHBOARD',
								bio: bio,
								timeleft: timeleft,
								showSuccess: true,
								success: flashMessages.success,
								actimerge: actimerge,
								unactivate: 'You are not yet activated'
							});
						}else{
							res.render('dashboard', { mess: 'USER DASHBOARD', timeleft: timeleft, actimerge:actimerge, unactivate: 'You are not yet activated'});
						}
  				}
  			});
  		}//else if activated
  	}
 });
});


//register
router.get('/register', function(req, res, next) {
		var message = 'FAQ';
  res.render('register', { mess: message });
});

router.get('/register/ref=:username', function(req, res, next) {
		var username = req.params.username;
		var route = '/register';
		link.route(username, db, route, req, res);
});

//how it works
router.get('/howitworks',  function (req, res, next){
	var message = 'How It Works';
 res.render('howitworks', {mess: message});
});

router.get('/howitworks/ref=:username', function(req, res, next) {
		var username = req.params.username;
		var route = '/howitworks';
		link.route(username, db, route, req, res);
});

//get logout
router.get('/logout', function(req, res, next) {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

//resend verification link
router.get('/resendverify/email/link', function(req, res, next) {
		var link = req.params.link;
		var email = req.params.email;
		reg.resendverify(email, mailer, link, hbs, db, req, res)
});

//confirm verification link
router.get('/verify/:email/:link', function(req, res, next) {
		var link = req.params.link;
		var email = req.params.email;
		const flashMessages = res.locals.getMessages( );
		reg.confirmverify(email, link, db, req, res, flashMessages);
});


//get login
router.get('/login', function(req, res, next) {
	const flashMessages = res.locals.getMessages( );
	if( flashMessages.error ){
		res.render( 'login', {
			showErrors: true,
			errors: flashMessages.error
		});
	}else{
		var message = 'LOG IN';
		res.render('login', { mess: message });
	}
});

router.get('/login/ref=:username', function(req, res, next){
	const flashMessages = res.locals.getMessages( );
	var username = req.params.username;
	db.query('SELECT username FROM user WHEN username = ?', [username], function(err, results, fields){
		if (err) throw err;
		if(results.length === 0){
			res.redirect('/login');
		}else{
			if( flashMessages.error ){
				res.render( 'login', {
					showErrors: true,
					mess: 'LOG IN',
					errors: flashMessages.error
				});
			}else{
				var message = 'LOG IN';
				res.render('login', { mess: message });
			}
		}
	});
});

//profile
router.get('/profile', ensureLoggedIn('/login'), function(req, res, next) {
  var currentUser = req.session.passport.user.user_id;
  db.query('SELECT * FROM user WHERE user_id = ? ', [currentUser], function(err, results, fields){
		if (err) throw err;
		var details = results[0];
		if(details.user_type == 'user'){
			var bio = results[0];
			console.log(bio)
			if(bio.bank_name === null && bio.account_number === null && bio.account_name === null){
				
				var error = 'You have not updated your profile yet';
				var flashMessages = res.locals.getMessages();
				console.log(error, flashMessages)
				if (flashMessages.emailerror ){
					res.render( 'profile', {
							mess: 'PROFILE UPDATE',
							error: error,
							bio: bio,
							showErrors: true,
							emailerror: flashMessages.emailerror});
				}else if (flashMessages.emailsuccess){
					res.render( 'profile', {
							mess: 'PROFILE UPDATE',
							error: error,
							bio: bio,
							showSuccess: true,
							emailsuccess: flashMessages.emailsuccess});
				}else if (flashMessages.phonesuccess){
					res.render( 'profile', {
							mess: 'PROFILE UPDATE',
							error: error,
							showSuccess: true,
							bio: bio,
							phonesuccess: flashMessages.phonesuccess});
				}else if (flashMessages.phoneerror ){
					res.render( 'profile', {
							mess: 'PROFILE UPDATE',
							error: error,
							bio: bio,
							showErrors: true,
							phoneerror: flashMessages.phoneerror});
				}else if (flashMessages.passworderror ){
					res.render( 'profile', {
							mess: 'PROFILE UPDATE',
							error: error,
							bio: bio,
							showErrors: true,
							passworderror: flashMessages.passworderror});
				}else if (flashMessages.passwordsuccess){
					res.render( 'profile', {
							mess: 'PROFILE UPDATE',
							error: error,
							bio: bio,
							showSuccess: true,
							passwordsuccess: flashMessages.passwordsuccess});
				}else if (flashMessages.banksuccess){
					res.render( 'profile', {
							mess: 'PROFILE UPDATE',
							error: error,
							bio: bio,
							showSuccess: true,
							banksuccess: flashMessages.banksuccess});
				} else if (flashMessages.bankerror ){
					res.render( 'profile', {
							mess: 'PROFILE UPDATE',
							error: error,
							bio: bio,
							showErrors: true,
							bankerror: flashMessages.bankerror});
				}else{
					res.render('profile', {mess: 'User Profile', error: error, bio: bio});
				}
			}else{
				var flashMessages = res.locals.getMessages();
				console.log(error, flashMessages)
				if (flashMessages.emailerror ){
					res.render( 'profile', {
							mess: 'PROFILE UPDATE',
							error: error,
							bio: bio,
							showErrors: true,
							emailerror: flashMessages.emailerror});
				}else if (flashMessages.emailsuccess){
					res.render( 'profile', {
							mess: 'PROFILE UPDATE',
							error: error,
							bio: bio,
							showSuccess: true,
							emailsuccess: flashMessages.emailsuccess});
				}else if (flashMessages.phonesuccess){
					res.render( 'profile', {
							mess: 'PROFILE UPDATE',
							error: error,
							showSuccess: true,
							bio: bio,
							phonesuccess: flashMessages.phonesuccess});
				}else if (flashMessages.phoneerror ){
					res.render( 'profile', {
							mess: 'PROFILE UPDATE',
							error: error,
							bio: bio,
							showErrors: true,
							phoneerror: flashMessages.phoneerror});
				}else if (flashMessages.passworderror ){
					res.render( 'profile', {
							mess: 'PROFILE UPDATE',
							error: error,
							bio: bio,
							showErrors: true,
							passworderror: flashMessages.passworderror});
				}else if (flashMessages.passwordsuccess){
					res.render( 'profile', {
							mess: 'PROFILE UPDATE',
							error: error,
							bio: bio,
							showSuccess: true,
							passwordsuccess: flashMessages.passwordsuccess});
				}else if (flashMessages.banksuccess){
					res.render( 'profile', {
							mess: 'PROFILE UPDATE',
							error: error,
							bio: bio,
							showSuccess: true,
							banksuccess: flashMessages.banksuccess});
				} else if (flashMessages.bankerror ){
					res.render( 'profile', {
							mess: 'PROFILE UPDATE',
							error: error,
							bio: bio,
							showErrors: true,
							bankerror: flashMessages.bankerror});
				}else{
					res.render('profile', {mess: 'User Profile', error: error, bio: bio});
				}
			}
		}else{
			if(type == 'admin'){
				
			}
		}
	});
});


//Post section

//post activation

router.post('/activate', function(req, res, next) {
  var currentUser = req.session.passport.user.user_id;
  console.log(currentUser)
  if(currentUser === undefined){
  		var error = 'You need to log in first';
			req.flash('error', error);
			res.redirect('/login');
  }else{
  	db.query('SELECT * FROM user WHERE user_id = ? ', [currentUser], function(err, results, fields){
			if (err) throw err;
			var details = results[0];
			db.query('SELECT user FROM transactions WHERE payer_username = ?', [details.username], function(err, results, fields){
				if (err) throw err;
				if (results.length > 0){
					var error = 'You still have a pending transaction.'
					req.flash('mergeerror', error);
					res.redirect('/dashboard/#mergeerror');
				}else{
					db.query('SELECT COUNT(username) AS count FROM user WHERE sponsor = ? AND activated = ?', [details.sponsor, 'Yes'], function(err, results, fields){
						if (err ) throw err;
						var count = results[0].count;
						var amount = (count - 4) / 5;
						if(Number.isInteger(amount) === false){
							db.query('SELECT * FROM activation ORDER BY alloted DESC', function(err, results, fields){
								if (err) throw err;
								if(results.length === 0){
									var error = 'Take a chill pill. No one to receive from you... Try again';
									req.flash('mergeerror', error);
									res.redirect('/dashboard/#mergeerror');
								}else {
									var acti = results[0];
									db.query('SELECT username, full_name, phone, bank_name, account_name, account_number FROM user WHERE username = ?', [acti.username], function(err, results, fields){
										if (err) throw err;
										var receiver = results[0];
										db.query('UPDATE activation SET alloted = ? WHERE username = ? ', [acti.alloted - 1, acti.username], function(err, results, fields){
											if (err) throw err;
											db.query('DELETE FROM activation WHERE alloted = ?', [0], function(err, results, fields){
												if (err) throw err;
												securePin.generateString(15, charSet, function(str){
													var order_id = 'act' + str;
													var date = new Date();
													var dt = new Date();
													date.setHours(date.getHours() + 25);
													console.log(dt, date, receiver, details)
													
													db.query('INSERT INTO transactions (user, receiver_username, receiver_phone, receiver_fullname, receiver_bank_name, receiver_account_name, receiver_account_number, payer_username, payer_phone, payer_fullname, order_id, date_entered, expire, purpose) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [details.username, receiver.username, receiver.phone, receiver.full_name, receiver.bank_name, receiver.account_name, receiver.account_number, details.username, details.phone, details.full_name, order_id, dt, date, 'activation'], function(err, results, fields){
														if (err) throw err;
														var success = 'Someone is ready to receive from you. You have only 3 hours to complete payment';
														req.flash('success', success);
									res.redirect('/dashboard/#mergesuccess');
													});
												});
											});
										});
									});
								}
							});
						}//if number is an integer
					});
				}
			});
		});
	}
});

//post register
router.post('/register', [	check('username', 'Username must be between 8 to 25 characters').isLength(8,25),	check('fullname', 'Full Name must be between 8 to 25 characters').isLength(8,25),	check('password', 'Password must be between 8 to 15 characters').isLength(8,15),	 check('email', 'Email must be between 8 to 105 characters').isLength(8,105),	check('email', 'Invalid Email').isEmail(),		check('phone', 'Phone Number must be eleven characters').isLength(11)], function (req, res, next) {	 
	console.log(req.body)
	
	var username = req.body.username;
    var password = req.body.password;
    var cpass = req.body.cpass;
    var email = req.body.email;
    var fullname = req.body.fullname;
    
    var phone = req.body.phone;
	var sponsor = '';
	
			var errors = validationResult(req).errors;
			
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
											
													//register user
													bcrypt.hash(password, saltRounds, null, function(err, hash){
													db.query( 'INSERT INTO user (sponsor ,  full_name ,  phone ,  username ,  email ,  password) VALUES (?, ?, ?, ?, ?, ?) ', [sponsor, fullname, phone, username, email, hash ], function(err, result, fields){
														if (err) throw err;
														var success = 'Registration successful! please verify your email';
														
														//mail
														//verify.verifymail(email,   username, hash);
													res.render('register', {mess: 'REGISTRATION SUCCESSFUL', success: success});
													});
												});
											});
										}else{
											var sponsor = req.body.sponsor;
											bcrypt.hash(password, saltRounds, null, function(err, hash){
												db.query( 'INSERT INTO user (sponsor ,  full_name ,  phone ,  username ,  email ,  password) VALUES (?, ?, ?, ?, ?, ?) ', [sponsor, fullname, phone, username, email, hash ], function(err, result, fields){
													if (err) throw err;
													var success = 'Registration successful! please verify your email';
														
														//mail
														//verify.verifymail(email,   username, hash);
													res.render('register', {mess: 'REGISTRATION SUCCESSFUL', success: success});
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
});

router.post('/register/ref=:username', function (req, res, next){
	var username = req.params.username;
	var username = req.body.username;
    var password = req.body.pass1;
    var cpass = req.body.pass2;
    var email = req.body.email;
    var fullname = req.body.fullname;
    var code = req.body.code;
    var phone = req.body.phone;
    var sponsor = req.params.sponsor;
    
    reg.register(db, req, res, bcrypt, username, fullname, phone, password, cpass, sponsor, email, code);
});




router.post('/passwordreset', function(req, res, next){
	var details = req.body;
	password.passwordreset(details)
});

router.post('/changepass', function(req, res, next){
	var details = req.body;
	password.changePass(details)
});


router.post('/emailchange', [	 check('email', 'Email must be between 8 to 105 characters').isLength(8,105),
	check('email', 'Invalid Email').isEmail() ], function(req, res, next){
	var currentUser = req.session.passport.user.user_id;
	var bio = req.body;
	var errors = validationResult(req).errors;
	if (errors.length > 0){
		res.render('profile', {mess: 'PROFILE UPDATE FAILED', errors: errors, bio: bio});
	}else{
		db.query('SELECT email FROM user WHERE email = ?', [bio.email], function(err, results, fields){
			if (err) throw err;
			if (results.length > 0){
				var error = "Sorry, this email is taken";
				req.flash('emailerror', error);
			res.redirect('/profile/#emailerror');
			}else{
				db.query('UPDATE user SET email = ? WHERE user_id = ?', [bio.email, currentUser], function(err, results, fields){
					if (err) throw err;
					var success = 'Email update was successful!';
					req.flash('emailsuccess', success);
			res.redirect('/profile/#emailsuccess');
				}); 
			}
		});
	}
});


router.post('/passwordchange',[	 check('password', 'Password must be between 8 to 15 characters').isLength(8, 15), check('oldpass', 'Old password must be between 8 to 15 characters').isLength(8, 15), check('cpass', 'Password confirmation must be between 8 to 15 characters').isLength(8, 15)], function(req, res, next){
	var currentUser = req.session.passport.user.user_id;
	var bio = req.body;
	var errors = validationResult(req).errors;
	if (errors.length > 0){
		res.render('profile', {mess: 'PROFILE UPDATE FAILED', errors: errors, bio: bio});
	}else if (bio.cpass !== bio.password){
		var error = 'Password does not match';
		req.flash('passworderror', error);
		res.redirect('/profile/#passworderror');
	}else{
		db.query('SELECT password FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
			if (err) throw err;
			var pash = results[0].password;
			bcrypt.compare(bio.oldpass, pash, function(err, response){
				if(response === false){
					//flash message
					var error = 'password change failed';
					req.flash('passworderror', error);
					res.redirect('/profile/#passworderror');
				}else{
					bcrypt.hash(password, saltRounds, null, function(err, hash){
						db.query('UPDATE user SET password = ? WHERE user_id = ?', [hash, currentUser], function(err, results, fields){
							if(err) throw err;
							var success = 'Password change was successful';
							req.flash('passwordsuccess', success);
							res.redirect('/profile/#passwordsuccess')
						});
					});
				}
			});
		});
	}
});

router.post('/bank', ensureLoggedIn('/login'), [	 check('fullname', 'Full Name must be less than 25 characters').isLength(5, 25), check('account_name', 'Account Name must be between 8 to 25 characters').isLength(8, 25), check('bank_name', 'Bank Name must be between 3 to 15 characters').isLength(3, 15), check('account_number', 'Account Number must be between 10 characters').isLength(10)], function(req, res, next){
	var currentUser = req.session.passport.user.user_id;
	var bio = req.body;
	var errors = validationResult(req).errors;
	if (errors.length > 0){
		res.render('profile', {mess: 'PROFILE UPDATE FAILED', errors: errors, bio: bio});
	}else{
		db.query('UPDATE user SET full_name = ?, account_name = ?, bank_name = ?, account_number = ? WHERE user_id = ?', [bio.fullname, bio.account_name, bio.bank_name, bio.account_number, currentUser], function(err, results, fields){
			if (err) throw err;
			var success = 'Bank details updated successfully!';
			req.flash('banksuccess', success);
			res.redirect('/profile/#banksuccess')
		});
	}
});


router.post('/phonechange', [	 check('phone', 'Phone Number must be between 11 characters').isLength(11) ], function(req, res, next){
	var currentUser = req.session.passport.user.user_id;
	var bio = req.body;
	var errors = validationResult(req).errors;
	if (errors.length > 0){
		res.render('profile', {mess: 'PROFILE UPDATE FAILED', errors: errors, bio: bio });
	}else{
		db.query('SELECT phone FROM user WHERE phone = ?', [bio.phone], function(err, results, fields){
			if (err) throw err;
			if (results.length > 0){
				var error = "Sorry, this Phone number is taken";
				req.flash('phoneerror', error);
			res.redirect('/profile/#phoneerror');
			}else{
				db.query('UPDATE user SET phone = ? WHERE user_id = ?', [bio.phone, currentUser], function(err, results, fields){
					if (err) throw err;
					var success = 'Phone number update was successful!';
					req.flash('phonesuccess', success);
			res.redirect('/profile/#phonesuccess');
				}); 
			}
		});
	}
});


//post log in
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  successReturnToOrRedirect: '/dashboard',
  failureFlash: true
}));

//Passport login
passport.serializeUser(function(user_id, done){
  done(null, user_id)
});
        
passport.deserializeUser(function(user_id, done){
  done(null, user_id)
});

router.post('/enterfeeder', function(req, res, next){
	var currentUser = req.session.passport.user.user_id;
	var details = req.body;
	
	
});




function authentificationMiddleware(){
  return (req, res, next) => {
    console.log(JSON.stringify(req.session.passport));
  if (req.isAuthenticated()) return next();

  res.redirect('/login'); 
  } 
}

router.get( '*', function ( req, res, next ){
	var error = 'PAGE NOT FOUND!';
	res.status( 404 ).render( '404',{title: error} );
});

module.exports = router;