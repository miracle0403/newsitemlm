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
var expressValidator = require('express-validator');

var link = require('./functions/routes/route-link');
var bycrypt = require('./functions/other/bcrypt');
var reg = require('./functions/register/reg');
var profile = require('./functions/profile/profile');

var bcrypt = require('bcrypt-nodejs');
const saltRounds = bcrypt.genSalt( 10, rounds);

var pool  = mysql.createPool({
  connectionLimit : 100,
  multipleStatements: true, 
  waitForConnections: true,
  host: "localhost",
  user: "root",
//  password: 'new',
  database: "new"
});

/* GET home page. */
router.get('/', function(req, res, next) {
		var message = 'Site Name';
  res.render('index', { mess: message });
});

router.get('/:username', function(req, res, next) {
		var username = req.params.username;
		var route = '/';
		link.route(username, db, route, req, res);
});

//faq
router.get('/faq', function(req, res, next) {
		var message = 'FAQ';
  res.render('faq', { mess: message });
});

router.get('/faq/:username', function(req, res, next) {
		var username = req.params.username;
		var route = '/faq';
		link.route(username, db, route, req, res);
});

//promote
router.get('/promote_us', function(req, res, next) {
		var message = 'FAQ';
  res.render('promote', { mess: message });
});

router.get('/promote_us/:username', function(req, res, next) {
		var username = req.params.username;
		var route = '/promote_us';
		link.route(username, db, route, req, res);
});


//register
router.get('/register', function(req, res, next) {
		var message = 'FAQ';
  res.render('register', { mess: message });
});

router.get('/register/:username', function(req, res, next) {
		var username = req.params.username;
		var route = '/register';
		link.route(username, db, route, req, res);
});

//how it works
router.get('/howitworks',  function (req, res, next){
	var message = 'How It Works';
 res.render('howitworks', {mess: message});
});

router.get('/howitworks/:username', function(req, res, next) {
		var username = req.params.username;
		var route = '/howitworks';
		link.route(username, db, route, req, res);
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

router.get('/login/:username', function(req, res, next){
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
router.post('/register', function (req, res, next){
	
	var username = req.body.username;
    var password = req.body.pass1;
    var cpass = req.body.pass2;
    var email = req.body.email;
    var fullname = req.body.fullname;
    var code = req.body.code;
    var phone = req.body.phone;
	var sponsor = '';
				reg.register(db, req, res, bcrypt, username, fullname, phone, password, cpass, sponsor, email, code);;
});

router.post('/register/:username', function (req, res, next){
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
router.post('/bank', function(req, res, next)
	var currentUser = req.session.passport.user.user_id;
	var details = req.body;
	profile.bankupdate( details, db, currentUser, req, res)
});


router.post('/bioupdate', function(req, res, next)
	var currentUser = req.session.passport.user.user_id;
	var details = req.body;
	bioupdate( details, db, currentUser, req)
});


router.post('/passwordchange', function(req, res, next)
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