'use strict';


const nodemailer =  require('nodemailer');
var ensureLoggedIn = require( 'connect-ensure-login' ).ensureLoggedIn
var express = require('express');
var router = express.Router();

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
router.get('/profile', authentificationMiddleware(), function(req, res, next) {
  var currentUser = req.session.passport.user.user_id;
  
		link.getProfile(currentUser, db, res)
});


//Post section

//post register
router.post('/register', [	check('username', 'Username must be between 8 to 25 characters').isLength(8,25),	check('fullname', 'Full Name must be between 8 to 25 characters').isLength(8,25),	check('password', 'Password must be between 8 to 25 characters').isLength(8,100),	 check('email', 'Email must be between 8 to 105 characters').isLength(8,105),	check('email', 'Invalid Email').isEmail(),		check('phone', 'Phone Number must be eleven characters').isLength(11)], function (req, res, next) {	 
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


//post profile update
router.post('/bank', function(req, res, next){
	var currentUser = req.session.passport.user.user_id;
	var details = req.body;
	profile.bankupdate( details, db, currentUser, req, res)
});

router.post('/passwordreset', function(req, res, next){
	var details = req.body;
	password.passwordreset(details)
});

router.post('/changepass', function(req, res, next){
	var details = req.body;
	password.changePass(details)
});


router.post('/bioupdate', function(req, res, next){
	var currentUser = req.session.passport.user.user_id;
	var details = req.body;
	bioupdate( details, db, currentUser, req)
});



//post log in
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  successRedirect: '/dashboard',
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


router.post('/passwordchange', function(req, res, next){
	var currentUser = req.session.passport.user.user_id;
	var details = req.body;
	password.changePass(details);
});

router.post('/activation', function(req, res, next){
	var currentUser = req.session.passport.user.user_id;
	db.query('SELECT phone, fullname, username, sponsor FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
		if (err ) throw err;
		var details = results[0];
		db.query('SELECT COUNT FROM user AS count WHERE sponsor = ?', [details.sponsor], function(err, results, fields){
			if (err ) throw err;
			var count = results[0].count;
			activation.activate(count, details);
		});
	});
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