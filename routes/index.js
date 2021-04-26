'use strict';

var paystack = require('paystack')('pk_test_a4e3579de9e0ee17f9bb6fcc79653ab81da4d895');
var fs = require('fs');
var Math = require('mathjs');
const nodemailer =  require('nodemailer');
var ensureLoggedIn = require( 'connect-ensure-login' ).ensureLoggedIn
var express = require('express');
var router = express.Router();
var ensureLoggedIn =  require('connect-ensure-login').ensureLoggedIn
var mailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var formidable = require('formidable');
var path = require ('path');
var passport = require('passport'); 
var securePin = require('secure-pin');
var charSet = new securePin.CharSet();
charSet.addLowerCaseAlpha().addUpperCaseAlpha().addNumeric().randomize();
var db = require('../db.js');
var mergefeed1 = require('../feeder/merge.js');
var getfunc = require('../functions.js');
var mv = require('mv');
var func = require('./func.js');
//var password = require('../functions/profile/passwordreset');
var querystring = require('querystring');

//var expressValidator = require('express-validator');

var { check, validationResult } = require('express-validator');


var linke = require('../functions/routes/route-link');
var bcrypt = require('bcryptjs');
var verify = require('../nodemailer/verify');


//var bcrypt = require('../functions/other/bcrypt');


const saltRounds = bcrypt.genSaltSync(10);


/* GET home page. */
router.get('/', function(req, res, next) {
	
	res.render('index', { mess: "EZWIFT",  title: "EZWIFT", });
});


router.get('/ref=:username', function(req, res, next) {
	var username = req.params.username;
	
		var rout = '/';
		linke.route(username, db, rout, req, res);
});

router.get('/iPaid/:order_id/', ensureLoggedIn('/login'), function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	func.spamActi(currentUser, req, res);
	var order_id = req.params.order_id;	

	db.query( 'SELECT * FROM transactions WHERE order_id = ?', [order_id], function ( err, results, fields ){
  	if( err ) throw err;
  	if(results.length === 0){
  		var error = 'Something went wrong';
  		req.flash('mergeerror', error);
			res.redirect('/dashboard/#mergeerror');
  	}else{
  		var flashMessages = res.locals.getMessages();
				if (flashMessages.error ){
					res.render( 'ipaid', {
							mess: 'Upload POP',
							error: error,
							order_id: order_id,
							
							showErrors: true,
							error: flashMessages.error});
				}else{
					res.render('ipaid', {mess: 'Upload POP', order_id: order_id  });
				}
  	}
 });
});

router.get('/passwordreset/:email/:str', function(req, res, next) {
	var email = req.params.email;
	var str = req.params.str;
	var date = new Date();
	db.query( 'SELECT * FROM passwordReset WHERE link = ? and email = ?', ['/' + email + '/' + str, email], function ( err, results, fields ){
		if( err ) throw err;
		if(results.length === 0){
			res.redirect('/passwordreset');
		}else{
			var details = results[0];
			if (details.expire <= date){
				db.query('delete from passwordReset where link = ?', ['/' + email + '/' + str], function ( err, results, fields ){
					var error = 'Link Expired!';
					req.flash('error', error);
					res.redirect('/passwordreset');
				});
			}else{
				var flashMessages = res.locals.getMessages();
				if (flashMessages.error){
					res.render('passwordreset', { 
						mess:  'Password Reset',
						str: str, email: email,
						showErrors: true,
						error: flashMessages.error
					});
				}else if (flashMessages.success){
					res.render('passwordreset', { 
						mess: 'Password Reset',
						str: str, email: email,
						showSuccess: true,
						success: flashMessages.success
					});
				}else{
					res.render('passwordreset', { 
						mess:  'Password Reset', str: str, email: email});
				}
			}
		}
	});
});

//all users
router.get('/all-users', ensureLoggedIn('/login'), function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	getfunc.admin(currentUser, db, req, res);
	db.query('SELECT * FROM user ', function ( err, results, fields ){
		if( err ) throw err;
		var users = results;
		res.render('all-users', {mess: 'EZWIFT  All Users ', users: users, admin: currentUser});
	});
});

//admin dashboard
router.get('/admin-dashboard', authentificationMiddleware(), ensureLoggedIn('/login'), function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	getfunc.admin(currentUser, db, req, res);
	var flashMessages = res.locals.getMessages();
	if (flashMessages.adderror){
		res.render( 'admin-dashboard', {
			mess: 'ADMIN DASHBOARD',
			admin: currentUser,
			showErrors: true,
			adderror: flashMessages.adderror
		});
	}else if (flashMessages.delerror){
		res.render( 'admin-dashboard', {
			mess: 'ADMIN DASHBOARD',
			admin: currentUser,
			showErrors: true,
			delerror: flashMessages.delerror
		});
	}else if (flashMessages.addsuccess) {
		res.render( 'admin-dashboard', {
			mess: 'ADMIN DASHBOARD',
			admin: currentUser,
			showSuccess: true,
			addsuccess: flashMessages.addsuccess
		});
	}else if (flashMessages.delsuccess) {
		res.render( 'admin-dashboard', {
			mess: 'ADMIN DASHBOARD',
			admin: currentUser,
			showSuccess: true,
			delsuccess: flashMessages.delsuccess
		});
	}else{
		res.render( 'admin-dashboard', {
			mess: 'ADMIN DASHBOARD',
			admin: currentUser
		});
	}
});

//all transactions
router.get('/all-transactions', ensureLoggedIn('/login'), function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	getfunc.admin(currentUser, db, req, res);
	db.query('SELECT * FROM transactions ', function ( err, results, fields ){
		if( err ) throw err;
		var transactions = results;
		res.render('all-transactions', {mess: 'EZWIFT  Transactions ', transactions: transactions, admin: currentUser});
	});
});

router.get('/passwordreset', function(req, res, next) {
		var message = 'Site Name';
		var flashMessages = res.locals.getMessages();
		console.log(flashMessages)
		if (flashMessages.error){
			res.render('passwordreset', { 
			mess: message + '  |  Password Reset',
			showErrors: true,
			error: flashMessages.error
			});
		}else if(flashMessages.success){
			res.render('passwordreset', { 
			mess: message + '  |  Password Reset',
			success: flashMessages.success,
			showSuccess: true
			});
		}else{
			res.render('passwordreset', { 
			mess: message + '  |  Password Reset'
			});
		}
});

router.get('/resendPass/email=:email/str=:str', function(req, res, next) {
	func.preset()
	var details = req.params;
	db.query( 'SELECT * FROM passwordReset WHERE email = ?', [details.email], function ( err, results, fields ){
  	if( err ) throw err;
  	if(results.length === 0){
			res.redirect('/passwordreset');
		}else{
			var details = results[0];
			var date = new Date();
			if (details.expire <= date){
				db.query('delete from passwordReset where link = ?', ['/' + details.email + '/' + details.str], function ( err, results, fields ){
					var error = 'Link Expired!';
					req.flash('error', error);
					res.redirect('/passwordreset');
				});
			}else{
				var success = 'Link resent!'
				req.flash('success', success);
				var mail = require('../nodemailer/password.js')
				mail.passReset(details.email, details.link, details.expire);
				res.redirect('/passwordreset')
			}
		}
 });
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
  res.render('faq', { mess: message, title: "EZWIFT",});
});

router.get('/faq/ref=:username', function(req, res, next) {
		var username = req.params.username;
		var route = '/faq';
		link.route(username, db, route, req, res);
});

//promote
router.get('/promote_us', function(req, res, next) {
		var message = 'FAQ';
  res.render('promote', { mess: message, title: "EZWIFT", });
});

router.get('/promote_us/ref=:username', function(req, res, next) {
		var username = req.params.username;
		var route = '/promote_us';
		link.route(username, db, route, req, res);
});

//dashboard
router.get('/dashboard', ensureLoggedIn('/login'), function(req, res, next) {
	func.receive();
	func.noreceive();
	func.feedtimer()
	//func.actimer();
	var currentUser = req.session.passport.user.user_id;
	db.query( 'SELECT * FROM user WHERE user_id = ?', [currentUser], function ( err, results, fields ){
		if( err ) throw err;
		var bio = results[0];		
		if(bio.bank_name === null){			
			res.redirect('/profile/#bank');
		}else if(bio.user_type === 'user' && bio.bank_name !== null){
			if (bio.activated === 'No'){				
				db.query( 'SELECT * FROM transactions WHERE payer_username = ? AND (status = ? OR status = ? OR status = ?) ', [bio.username, 'pending', 'UnConfirmed', 'in contest' ], function ( err, results, fields ){
					if( err ) throw err;					
					if(results.length === 0){
						console.log('nono')
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
						}else if (flashMessages.error){
							res.render( 'dashboard', {
								mess: 'USER DASHBOARD',
								bio: bio,
								showErrors: true,
								error: flashMessages.error,
								noactimerge:'no merging',
								unactivate: 'You are not yet activated'
							});
						}else{
							res.render('dashboard', { mess: 'USER DASHBOARD', noactimerge:'no merging', unactivate: 'You are not yet activated'});
						}
					}else{
						//console.log('yeye')
						var trans = results[0];						
						if(trans.status === 'PENDING'){
							console.log('yeye', trans, trans.status)
							var pendingmerge = results[0];
							console.log(trans)
							var the = new Date(trans.expire);
							var now = new Date();
							var distance = the - now;
							var timeleft = func.timer(now, distance);
							console.log(timeleft, pendingmerge)
							var flashMessages = res.locals.getMessages();
							if (flashMessages.mergeerror){
								res.render( 'dashboard', {
									mess: 'USER DASHBOARD',
									bio: bio,
									showErrors: true,
									mergeerror: flashMessages.mergeerror,
									timeleft: timeleft,
									pendingmerge: pendingmerge,
									unactivate: 'You have a pending payment'
								});
							}else if (flashMessages.success){
								res.render( 'dashboard', {
									mess: 'USER DASHBOARD',
									bio: bio,
									timeleft: timeleft,
									showSuccess: true,
									success: flashMessages.success,
									pendingmerge: pendingmerge,
									unactivate: 'You have a pending payment'
								});
							}else{
								res.render('dashboard', { mess: 'USER DASHBOARD', timeleft: timeleft, pendingmerge:pendingmerge, unactivate: 'You have a pending payment'});
							}
						}else if(trans.status === 'unconfirmed'){
							var unconmerge = results[0];
							var the = new Date(trans.expire);
							var now = new Date();
							var distance = the - now;
							var timeleft = func.timer(now, distance);
							console.log(timeleft)
							var flashMessages = res.locals.getMessages();
							if (flashMessages.mergeerror){
								res.render( 'dashboard', {
									mess: 'USER DASHBOARD',
									bio: bio,
									showErrors: true,
									mergeerror: flashMessages.mergeerror,
									timeleft: timeleft,
									unconmerge: unconmerge,
									unactivate: 'You have a Unconfirmed payment'
								});
							}else if (flashMessages.success){
								res.render( 'dashboard', {
									mess: 'USER DASHBOARD',
									bio: bio,
									timeleft: timeleft,
									showSuccess: true,
									success: flashMessages.success,
									unconmerge: unconmerge,
									unactivate: 'You have a Unconfirmed payment'
								});
							}else{
								res.render('dashboard', { mess: 'USER DASHBOARD', timeleft: timeleft, unconmerge : unconmerge, unactivate: 'You have a Unconfirmed payment'});
							}
						}else if (trans.status === 'In contest'){
							var contestmerge = results[0];
							var timeleft = new Date().getHours(contestmerge.expire) + 1;
							var flashMessages = res.locals.getMessages();
							if (flashMessages.mergeerror){
									res.render( 'dashboard', {
										mess: 'USER DASHBOARD',
										bio: bio,
										showErrors: true,
										mergeerror: flashMessages.mergeerror,
										timeleft: timeleft,
										contestmerge: contestmerge,
										unactivate: 'You have an issue with your payment'
									});
								}else if (flashMessages.success){
									res.render( 'dashboard', {
										mess: 'USER DASHBOARD',
										bio: bio,
										timeleft: timeleft,
										showSuccess: true,
										success: flashMessages.success,
										contestmerge: contestmerge,
										unactivate: 'You have an issue with your payment'
									});
								}else{
									res.render('dashboard', { mess: 'USER DASHBOARD', timeleft: timeleft, contestmerge : contestmerge, unactivate: 'You have an issue with your payment'});
								}
						}else{
							var error = 'Something went Wrong';
							res.render('dashboard', { mess: 'USER DASHBOARD', timeleft: timeleft, unactivate: 'You are not yet activated'});
						}
					}
				});
			}else{
				//user is activated
				db.query( 'SELECT * FROM transactions WHERE payer_username = ? AND status = ? ', [bio.username, 'Pending', ], function ( err, results, fields ){
					if( err ) throw err;
					var nopop = results;
					console.log(nopop);
					db.query( 'SELECT * FROM transactions WHERE payer_username = ? AND status = ? ', [bio.username, 'Unconfirmed', ], function ( err, results, fields ){
						if( err ) throw err;
						var pop = results;
						db.query( 'SELECT * FROM transactions WHERE payer_username = ? AND status = ? ', [bio.username, 'In contest', ], function ( err, results, fields ){
							if( err ) throw err;
							var chat = results;
							db.query( 'SELECT * FROM transactions WHERE receiver_username = ? AND (status = ? OR status = ? OR status = ?) AND purpose = ?', [bio.username, 'Pending', 'UnConfirmed', 'in contest', 'activation'], function ( err, results, fields ){
								if( err ) throw err;
								var receivingact = results;
								db.query( 'SELECT * FROM transactions WHERE receiver_username = ? AND (status = ? OR status = ? OR status = ?) AND purpose = ?', [bio.username, 'Pending', 'UnConfirmed', 'in contest', 'feeder_matrix'], function ( err, results, fields ){
									if( err ) throw err;
									var receivingmatrix = results;
									db.query( 'SELECT * FROM transactions WHERE receiver_username = ? AND (status = ? OR status = ? OR status = ?) AND purpose = ?', [bio.username, 'Pending', 'UnConfirmed', 'in contest', 'feeder_bonus'], function ( err, results, fields ){
										if( err ) throw err;
										var receivingbonus = results;
										db.query( 'SELECT * FROM transactions WHERE NOT receiver_username = ? AND (user = ? AND (status = ? OR status = ? OR status = ?) AND purpose = ?)', [bio.username, bio.username, 'Pending', 'UnConfirmed', 'in contest', 'feeder_bonus'], function ( err, results, fields ){
											if( err ) throw err;
											var receivinguser = results;
											db.query( 'SELECT count(purpose) AS count FROM transactions WHERE receiver_username = ? AND  status = ? AND purpose = ?', [bio.username,  'confirmed', 'feeder_bonus'], function ( err, results, fields ){
											if( err ) throw err;
											var feedbonus = results[0].count * 10000;
												db.query( 'SELECT count(purpose) AS count FROM transactions WHERE receiver_username = ? AND  status = ? AND purpose = ?', [bio.username,  'confirmed', 'feeder_matrix'], function ( err, results, fields ){
													if( err ) throw err;
													var feedmatrix = results[0].count * 10000;
													db.query( 'SELECT count(purpose) AS count FROM transactions WHERE receiver_username = ? AND  status = ? AND purpose = ?', [bio.username,  'confirmed', 'activation'], function ( err, results, fields ){
														if( err ) throw err;
														var actimatrix = results[0].count * 1000;
														db.query( 'SELECT COUNT(purpose) AS count FROM transactions WHERE receiver_username = ? AND (status = ? OR status = ? OR status = ?) AND (purpose = ? OR purpose = ? ) ', [bio.username, 'Pending', 'UnConfirmed', 'in contest', 'feeder_matrix', 'feeder_bonus'], function ( err, results, fields ){
															if( err ) throw err;
															var expectedEarn = results[0].count * 10000;
															db.query( 'SELECT COUNT(purpose) AS count FROM transactions WHERE payer_username = ? AND status = ? and (purpose = ? or purpose = ?) ', [bio.username, 'confirmed', 'feeder_bonus', 'feeder_matrix'], function ( err, results, fields ){
																if( err ) throw err;
																var totalPaid = results[0].count * 10000;
																console.log(actimatrix , feedmatrix , feedbonus);
																var totalEarned = actimatrix + feedmatrix + feedbonus;
																var flashMessages = res.locals.getMessages();
																if (flashMessages.mergeerror){
																	res.render( 'dashboard', {
																		mess: 'USER DASHBOARD',
																		chat: chat,
																		pop: pop,
																		nopop: nopop,
																		totalPaid: totalPaid,
																		expectedEarn: expectedEarn,
																		
																		bio: bio,
																		showErrors: true,
																		mergeerror: flashMessages.mergeerror,
																		activate: 'You are activated',
																		actimatrix: actimatrix,
																		feedbonus: feedbonus,
																		feedmatrix: feedmatrix,
																		totalEarned: totalEarned,
																		receivingact: receivingact,
																		receivingmatrix: receivingmatrix,
																		receivingbonus: receivingbonus,
																		receivinguser: receivinguser
																	});
																}else if (flashMessages.success){
																	res.render( 'dashboard', {
																		mess: 'USER DASHBOARD',
																		totalPaid: totalPaid,
																		bio: bio,
																		expectedEarn: expectedEarn,
																		showSuccess: true,
																		success: flashMessages.success,
																		chat: chat,
																		pop: pop,
																		nopop: nopop,
																		activate: 'You are activated',
																		actimatrix: actimatrix,
																		feedbonus: feedbonus,
																		feedmatrix: feedmatrix,
																		totalEarned: totalEarned,
																		receivingact: receivingact,
																		receivingmatrix: receivingmatrix,
																		receivingbonus: receivingbonus,
																		receivinguser: receivinguser
																	});
																}else{
																	res.render( 'dashboard', {
																		mess: 'USER DASHBOARD',
																		expectedEarn: expectedEarn,
																		chat: chat,
																		pop: pop,
																		nopop: nopop,
																		bio: bio,
																		totalPaid: totalPaid,
																		
																		
																		activate: 'You are activated',
																		actimatrix: actimatrix,
																		feedbonus: feedbonus,
																		feedmatrix: feedmatrix,
																		totalEarned: totalEarned,
																		receivingact: receivingact,
																		receivingmatrix: receivingmatrix,
																		receivingbonus: receivingbonus,
																		receivinguser: receivinguser
																	});
																}
															});
														});
													});
												});
											});
										});
									});
								});
							});
						});
					});
				});
			}
		}else if(bio.user_type === 'admin' && bio.bank_name !== null){
			var admin = bio;
			db.query( 'SELECT * FROM transactions WHERE receiver_username = ? AND (status = ? OR status = ? OR status = ?) ', [admin.username, 'Pending', 'UnConfirmed', 'in contest' ], function ( err, results, fields ){
				if( err ) throw err;
				var actimerge = results;
				db.query( 'SELECT * FROM transactions WHERE payer_username = ? AND status = ? ', [bio.username, 'Pending', ], function ( err, results, fields ){
					if( err ) throw err;
					var nopop = results;
					console.log(nopop);
					db.query( 'SELECT * FROM transactions WHERE payer_username = ? AND status = ? ', [bio.username, 'Unconfirmed', ], function ( err, results, fields ){
						if( err ) throw err;
						var pop = results;
						db.query( 'SELECT * FROM transactions WHERE payer_username = ? AND status = ? ', [bio.username, 'In contest', ], function ( err, results, fields ){
							if( err ) throw err;
							var chat = results;
							db.query( 'SELECT * FROM transactions WHERE receiver_username = ? AND (status = ? OR status = ? OR status = ?) AND purpose = ?', [bio.username, 'Pending', 'UnConfirmed', 'in contest', 'activation'], function ( err, results, fields ){
								if( err ) throw err;
								var receivingact = results;
								db.query( 'SELECT * FROM transactions WHERE receiver_username = ? AND (status = ? OR status = ? OR status = ?) AND purpose = ?', [bio.username, 'Pending', 'UnConfirmed', 'in contest', 'feeder_matrix'], function ( err, results, fields ){
									if( err ) throw err;
									var receivingmatrix = results;
									db.query( 'SELECT * FROM transactions WHERE receiver_username = ? AND (status = ? OR status = ? OR status = ?) AND purpose = ?', [bio.username, 'Pending', 'UnConfirmed', 'in contest', 'feeder_bonus'], function ( err, results, fields ){
										if( err ) throw err;
										var receivingbonus = results;
										db.query( 'SELECT * FROM transactions WHERE NOT receiver_username = ? AND (user = ? AND (status = ? OR status = ? OR status = ?) AND purpose = ?)', [bio.username, bio.username, 'Pending', 'UnConfirmed', 'in contest', 'feeder_bonus'], function ( err, results, fields ){
											if( err ) throw err;
											var receivinguser = results;
											db.query( 'SELECT count(purpose) AS count FROM transactions WHERE receiver_username = ? AND  status = ? AND purpose = ?', [bio.username,  'confirmed', 'feeder_bonus'], function ( err, results, fields ){
												if( err ) throw err;
												var feedbonus = results[0].count * 10000;
												db.query( 'SELECT count(purpose) AS count FROM transactions WHERE receiver_username = ? AND  status = ? AND purpose = ?', [bio.username,  'confirmed', 'feeder_matrix'], function ( err, results, fields ){
													if( err ) throw err;
													var feedmatrix = results[0].count * 10000;
													db.query( 'SELECT count(purpose) AS count FROM transactions WHERE receiver_username = ? AND  status = ? AND purpose = ?', [bio.username,  'confirmed', 'activation'], function ( err, results, fields ){
														if( err ) throw err;
														var actimatrix = results[0].count * 1000;
														db.query( 'SELECT COUNT(purpose) AS count FROM transactions WHERE receiver_username = ? AND (status = ? OR status = ? OR status = ?) AND (purpose = ? OR purpose = ? ) ', [bio.username, 'Pending', 'UnConfirmed', 'in contest', 'feeder_matrix', 'feeder_bonus'], function ( err, results, fields ){
															if( err ) throw err;
															var expectedEarn = results[0].count * 10000;
															db.query( 'SELECT COUNT(purpose) AS count FROM transactions WHERE payer_username = ? AND status = ? and (purpose = ? or purpose = ?) ', [bio.username, 'confirmed', 'feeder_bonus', 'feeder_matrix'], function ( err, results, fields ){
																if( err ) throw err;
																var totalPaid = results[0].count * 10000;
																console.log(actimatrix , feedmatrix , feedbonus);
																var totalEarned = actimatrix + feedmatrix + feedbonus;
																var flashMessages = res.locals.getMessages();
																if (flashMessages.mergeerror){
																	res.render( 'dashboard', {
																		mess: 'USER DASHBOARD',
																		chat: chat,
																		pop: pop,
																		nopop: nopop,
																		totalPaid: totalPaid,
																		expectedEarn: expectedEarn,
																		admin: admin,
																		actimerge: actimerge,
																		showErrors: true,
																		mergeerror: flashMessages.mergeerror,
																		activate: 'You are activated',
																		actimatrix: actimatrix,
																		feedbonus: feedbonus,
																		feedmatrix: feedmatrix,
																		totalEarned: totalEarned,
																		receivingact: receivingact,
																		receivingmatrix: receivingmatrix,
																		receivingbonus: receivingbonus,
																		receivinguser: receivinguser
																	});
																}else if (flashMessages.success){
																	res.render( 'dashboard', {
																		mess: 'USER DASHBOARD',
																		totalPaid: totalPaid,
																		admin: admin,
																		actimerge: actimerge,
																		expectedEarn: expectedEarn,
																		showSuccess: true,
																		success: flashMessages.success,
																		chat: chat,
																		pop: pop,
																		nopop: nopop,
																		activate: 'You are activated',
																		actimatrix: actimatrix,
																		feedbonus: feedbonus,
																		feedmatrix: feedmatrix,
																		totalEarned: totalEarned,
																		receivingact: receivingact,
																		receivingmatrix: receivingmatrix,
																		receivingbonus: receivingbonus,
																		receivinguser: receivinguser
																	});
																}else{
																	res.render( 'dashboard', {
																		mess: 'USER DASHBOARD',
																		expectedEarn: expectedEarn,
																		chat: chat,
																		pop: pop,
																		nopop: nopop,
																		admin: admin,
																		actimerge: actimerge,
																		totalPaid: totalPaid,																																	activate: 'You are activated',
																		actimatrix: actimatrix,
																		feedbonus: feedbonus,
																		feedmatrix: feedmatrix,
																		totalEarned: totalEarned,
																		receivingact: receivingact,
																		receivingmatrix: receivingmatrix,
																		receivingbonus: receivingbonus,
																		receivinguser: receivinguser
																	});
																}
															});
														});
													});
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});
		}else{
			var error = 'Something Went wrong';
			console.log(error);
			req.flash('error', error);
			res.redirect('/404');
		}
	});
});


//register
router.get('/register', function(req, res, next) {
		var message = 'Registration';
  res.render('register', { mess: message, title: "EZWIFT", });
});

router.get('/register/ref=:username', function(req, res, next) {
	var username = req.params.username;
	console.log(username)
	db.query('SELECT username FROM user WHERE username = ?',[username], function(err, results, fields){
			if (err) throw err;
			if (results.length === 0){
				res.redirect('/register')
			}else{
				var message = 'Registration';
				res.render('register', {mess: message, sponsor: username, title: "EZWIFT",})
			}
		});
});

router.get('/register/ref=', function(req, res, next) {
	res.redirect('/register')
});

router.get('/login/ref=', function(req, res, next) {
	res.redirect('/login')
});

router.get('/ref=', function(req, res, next) {
	res.redirect('/')
});

router.get('/faq/ref=', function(req, res, next) {
	res.redirect('/faq')
});

router.get('/fastteams/ref=', function(req, res, next) {
	res.redirect('/fastteams')
});

router.get('/register/ref=', function(req, res, next) {
	res.redirect('/register')
});

router.get('/passwordreset/ref=', function(req, res, next) {
	res.redirect('/passwordreset')
});
router.get('/howitworks/ref=', function(req, res, next) {
	res.redirect('/howitworks')
});

//get fast teams
router.get('/fastteams',  function (req, res, next){
	//get the max 5
	db.query( 'SELECT phone, full_name, email, username,amount FROM user ORDER BY amount DESC LIMIT 4', function ( err, results, fields ){
		if( err ) throw err;
		var fast = results;
		res.render('fastteams', {mess: "OUR FASTEST TEAMS", fast: fast, title: 'EZWIFT'});
	});
});

//how it works
router.get('/howitworks',  function (req, res, next){
	var message = 'How It Works';
 res.render('howitworks', {mess: message, title: "EZWIFT",});
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
	
	func.actimer();
	func.feedtimer()
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
	func.receive();
	func.noreceive();
	const flashMessages = res.locals.getMessages( );
	func.actimer();
	var username = req.params.username;
	db.query('SELECT username FROM user WHERE username = ?', [username], function(err, results, fields){
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

//transactions
router.get('/transactions', ensureLoggedIn('/login'), function(req, res, next) {
	func.receive();
	func.noreceive();
	func.feedtimer();
  var currentUser = req.session.passport.user.user_id;
  db.query('SELECT * FROM user WHERE user_id = ? ', [currentUser], function(err, results, fields){
		if (err) throw err;
		if (results[0].user_type === 'user'){
			var bio = results[0];
			db.query('SELECT * FROM transactions WHERE payer_username = ? or receiver_username = ? or user = ? ', [bio.username, bio.username, bio.username], function(err, results, fields){
				if (err) throw err;
				var transactions = results;
				var message = 'My Transactions';
				res.render('transactions', {mess: message, transactions: transactions});
			});
		}else{
			var admin = results[0];
			db.query('SELECT * FROM transactions WHERE payer_username = ? or receiver_username = ? or user = ? ', [admin.username, admin.username, admin.username], function(err, results, fields){
				if (err) throw err;
				var transactions = results;
				var message = 'My Transactions';
				res.render('transactions', {mess: message, transactions: transactions, admin: admin});
			});
		}
	});
});

//referrals
router.get('/referrals', ensureLoggedIn('/login'), function(req, res, next) {
	func.receive();
	func.noreceive();
	func.feedtimer();
  var currentUser = req.session.passport.user.user_id;
  //check for referrals.
  db.query('SELECT * FROM user WHERE user_id = ? ', [currentUser], function(err, results, fields){
		if (err) throw err;
		//console.log(results)
		if(results[0].user_type === 'user'){
			var bio = results[0];
			db.query('SELECT  username, phone, email, status, activated, full_name FROM user WHERE sponsor = ? ', [bio.username], function(err, results, fields){
				if (err) throw err;
				var referrals = results;
				db.query('SELECT a, b, c FROM feeder_tree WHERE (a is null or b is null or c is null) and username = ?', [bio.username], function(err, results, fields){
					if (err) throw err;
					var leg = results[0];
					db.query( 'SELECT COUNT(username) AS count FROM user WHERE sponsor = ?', [bio.username], function ( err, results, fields ){
						if (err) throw err;
						var count = results[0].count;
						console.log(count)
						res.render('referrals', {mess: 'MY REFERRALS', count: count, leg: leg, bio: bio, referrals: referrals})
					});
				});
			});
		}else if(results.user_type === 'admin'){
			var admin = results[0];
			db.query('SELECT  username, phone, email, status, activated, full_name FROM user WHERE sponsor = ? ', [admin.username], function(err, results, fields){
				if (err) throw err;
				var referrals = results;
				var count = func.ref(admin.username);
				db.query('SELECT a, b, c FROM feeder_tree WHERE (a is null or b is null or c is null) and username = ?', [admin.username], function(err, results, fields){
					if (err) throw err;
					var leg = results[0];
					db.query( 'SELECT COUNT(username) AS count FROM user WHERE sponsor = ?', [admin.username], function ( err, results, fields ){
						if (err) throw err;
						var count = results[0].count;
						res.render('referrals', {mess: 'MY REFERRALS', count: count, admin: admin, leg: leg, referrals: referrals});
					});
				});
			});
		}
	});
});

//profile
router.get('/profile', ensureLoggedIn('/login'), function(req, res, next) {
	func.receive();
	func.noreceive();
	func.feedtimer()
  var currentUser = req.session.passport.user.user_id;
  db.query('SELECT * FROM user WHERE user_id = ? ', [currentUser], function(err, results, fields){
		if (err) throw err;
		var details = results[0];
		if(details.user_type == 'user'){
			var bio = results[0];
			console.log(bio)
			if(bio.bank_name === null && bio.account_number === null && bio.account_name === null){
				
				var error = 'You have not updated your bank details yet';
				var flashMessages = res.locals.getMessages();
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

router.post('/activate', authentificationMiddleware(), function(req, res, next) {
  var currentUser = req.session.passport.user.user_id;
	db.query('SELECT * FROM user WHERE user_id = ? ', [currentUser], function(err, results, fields){
		if (err) throw err;
		var details = results[0];
		db.query('SELECT user FROM transactions WHERE payer_username = ? AND (status = ? OR status = ?  OR status = ?)', [details.username, 'pending', 'in contest', 'unconfirmed'], function(err, results, fields){
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
												date.setHours(date.getHours() + 3);
												console.log(dt, date, receiver, details)
												
												db.query('INSERT INTO transactions (user, receiver_username, receiver_phone, receiver_fullname, receiver_bank_name, receiver_account_name, receiver_account_number, payer_username, payer_phone, payer_fullname, order_id, date_entered, expire, purpose) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [details.username, receiver.username, receiver.phone, receiver.full_name, receiver.bank_name, receiver.account_name, receiver.account_number, details.username, details.phone, details.full_name, order_id, dt, date, 'activation'], function(err, results, fields){
													if (err){
														var error = 'something went wrong';
														req.flash('error', error);
														res.redirect('/dashboard/#mergeerror');
													}else{
														var success = 'Someone is ready to receive from you. You have only 2 hours to complete payment';
														req.flash('success', success);
														res.redirect('/dashboard/#success');
													}
												});
											});
										});
									});
								});
							}
						});
					}//if number is an integer
					else{
						db.query('SELECT * FROM activation ORDER BY alloted WHERE username = ?', [details.username], function(err, results, fields){
							if (err) throw err;
							var alloted = results.slice(-1)[0];
							if (alloted.alloted === 0){
								//go to the normal section
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
												date.setHours(date.getHours() + 3);
												console.log(dt, date, receiver, details)
												
												db.query('INSERT INTO transactions (user, receiver_username, receiver_phone, receiver_fullname, receiver_bank_name, receiver_account_name, receiver_account_number, payer_username, payer_phone, payer_fullname, order_id, date_entered, expire, purpose) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [details.username, receiver.username, receiver.phone, receiver.full_name, receiver.bank_name, receiver.account_name, receiver.account_number, details.username, details.phone, details.full_name, order_id, dt, date, 'activation'], function(err, results, fields){
													if (err){
														var error = 'something went wrong';
														req.flash('error', error);
														res.redirect('/dashboard/#mergeerror');
													}else{
														var success = 'Someone is ready to receive from you. You have only 2 hours to complete payment';
														req.flash('success', success);
														res.redirect('/dashboard/#mergesuccess');
													}
												});
											});
										});
									});
								});
							}
						});
							}else if (alloted.alloted > 0){
								//take from sponsor.
								var acti = alloted;
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
												date.setHours(date.getHours() + 3);
												console.log(dt, date, receiver, details)
												
												db.query('INSERT INTO transactions (user, receiver_username, receiver_phone, receiver_fullname, receiver_bank_name, receiver_account_name, receiver_account_number, payer_username, payer_phone, payer_fullname, order_id, date_entered, expire, purpose) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [details.username, receiver.username, receiver.phone, receiver.full_name, receiver.bank_name, receiver.account_name, receiver.account_number, details.username, details.phone, details.full_name, order_id, dt, date, 'activation'], function(err, results, fields){
													if (err){
														var error = 'something went wrong';
														req.flash('error', error);
														res.redirect('/dashboard/#mergeerror');
													}else{
														var success = 'Someone is ready to receive from you. You have only 2 hours to complete payment';
														req.flash('success', success);
														res.redirect('/dashboard/#mergesuccess');
													}
												});
											});
										});
									});
								});
							}
						});
					}
				});
			}
		});
	});
});



//post register
router.post('/register', [	check('username', 'Username must be between 8 to 25 numbers').isLength(8,25),	check('fullname', 'Full Name must be between 8 to 25 characters').isLength(8,25),	check('password', 'Password must be between 8 to 15 characters').isLength(8,15),	 check('email', 'Email must be between 8 to 105 characters').isLength(8,105),	check('email', 'Invalid Email').isEmail(),		check('phone', 'Phone Number must be eleven characters').isLength(11)], function (req, res, next) {	 
	console.log(req.body)
	
	var username = req.body.username;
    var password = req.body.password;
    var cpass = req.body.cpass;
    var email = req.body.email;
    var fullname = req.body.fullname;
    
    var phone = req.body.phone;
	var sponsor = req.body.sponsor;
	
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
											console.log('spon not valid');
											db.query('SELECT * FROM default_sponsor order by amount DESC', function(err, results, fields){
												if (err) throw err;
												console.log(results);
												var sponsor = results[0].username;
												var amount = results[0].amount;
												db.query('UPDATE default_sponsor SET amount = ? WHERE username = ?', [amount - 1, sponsor], function(err, results, next){
													if (err) throw err;
													//check if there is a lft
													db.query('SELECT lft FROM user WHERE lft = ?', [1], function(err, results, fields){
														if (err) throw err;
														if(results.length === 0){
															//register user
															//register user
															bcrypt.hash(password, saltRounds,  function(err, hash){
																db.query('INSERT INTO user (user_id, amount, lft, rgt, sponsor, full_name, phone, username, email, password) VALUES (?,?,?,?,?,?,?,?,?,?)', [1,1,1,2, sponsor, fullname, phone, username, email, hash],  function(err, results, fields){
																	if (err) throw err;
																	var success = 'Registration successful! please login';
																	res.render('register', {mess: 'REGISTRATION SUCCESSFUL', success: success});
																});
															});	
														}else{
															//register user
															bcrypt.hash(password, saltRounds,  function(err, hash){
																console.log(hash)
																db.query('CALL register (?,?,?,?,?,?)', [sponsor, fullname, phone, username, email, hash],  function(err, results, fields){
																	if (err) throw err;
																	var success = 'Registration successful! please login';
																	res.render('register', {mess: 'REGISTRATION SUCCESSFUL', success: success});
																});
															});	
														}
														
													});
												});
											});
											
										}else{
											var sponsor = req.body.sponsor;
											console.log('spon is valid');
											db.query('SELECT lft FROM user WHERE lft = ?', [1], function(err, results, fields){
												if (err) throw err;
												if(results.length === 0){
													//register user
													bcrypt.hash(password, saltRounds,  function(err, hash){
														db.query('INSERT INTO user (user_id, amount, lft, rgt, sponsor, full_name, phone, username, email, password) VALUES (?,?,?,?,?,?,?,?,?,?)', [1,1,1,2, sponsor, fullname, phone, username, email, hash],  function(err, results, fields){
															if (err) throw err;
															var success = 'Registration successful! please login';
															res.render('register', {mess: 'REGISTRATION SUCCESSFUL', success: success});
														});
													});	;	
												}else{
													//register user
													bcrypt.hash(password, saltRounds,  function(err, hash){
														db.query('INSERT INTO user (lft, rgt, sponsor ,  full_name ,  phone ,  username ,  email , password) VALUES (?,?,?,?,?,?,?,?)', [1, 2, sponsor, fullname, phone, username, email, hash],  function(err, results, fields){
															if (err) throw err;
															var success = 'Registration successful! please login';
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
			});
		}
	}
});




//upload pop
router.post('/uploadpop/:order_id/', function(req, res, next){
	var order_id = req.params.order_id;
	var rootdir = genfunc.dirname(path);
	var subdir = '/public/assets/img/pop/';
	var dir  = path.join(rootdir + subdir);
	console.log(dir)
	var maxFileSize = 2 * 1024 * 1024
	var form = formidable({ multiples: true});
	form.parse(req, function(err, fields, files){
		if(err){
			console.log(err)
		}else{
			var fi = JSON.stringify(files)
			var fil = JSON.parse(fi);
			var file = fil.pop;
			console.log(file)
			if (file.type === 'image/jpeg' || file.type === 'image/png'){
					if(file.size <= maxFileSize){
						mv(file.path, dir + file.name, function (err) {
							if (err) throw err;
							var date = new Date();
							var dt = new Date();
													date.setHours(date.getHours() + 25);
							db.query('UPDATE transactions SET pop = ?, status = ?, expire = ? WHERE order_id = ?', ['/assets/img/pop/' + file.name, 'unconfirmed', date,  order_id], function(err, results, fields){
								if(err) throw err;
								var success = 'pop uploaded successfully';
								req.flash('success', success);
								res.redirect('/dashboard/');
							});
						});
					}else{
						var error = 'File must not exceed 2mb.';
						fs.unlink (file.path, function (err) {
							if (err) throw err;
							console.log('File deleted!');
							req.flash('error', error);
							res.redirect('/ipaid/' + order_id);
						});
					}
				//});
			}else{
				var error = 'File type must be either jpg or png format only.';
				fs.unlink (file.path, function (err) {
					if (err) throw err;
					console.log('File deleted!');
					req.flash('error', error);
				res.redirect('/ipaid/' + order_id);
				});
			}
		}
	});
});

//func.receive();
											//func.noreceive();
											
//confirm payment 
router.post('/confirm-payment/:order_id/:receive', authentificationMiddleware(), function(req, res, next){
	var order_id = req.params.order_id;
	var receive = req.params.receive;
	var currentUser = req.session.passport.user.user_id;
	//get the username
	db.query('SELECT * FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
		if (err) throw err;
		var users = results[0];
		//get the details from the transactions table and be sure the order id exist
		db.query('SELECT * FROM transactions WHERE order_id = ?', [order_id], function(err, results, fields){
			if (err) throw err;
			if(results.length === 0){
				var error = 'Something went wrong';
				console.log('wrong orderid')
				req.flash('mergeerror', error);
				res.redirect('/dashboard/#mergeerror');
			}else{
				var trans = results[0];
				//check if the receiving order is correct
				db.query('SELECT * FROM feeder_tree WHERE order_id = ?', [receive], function(err, results, fields){
					if (err) throw err;
					if(results.length === 0){
						var error = 'Something went wrong';
						console.log('wrong receive')
						req.flash('mergeerror', error);
						res.redirect('/dashboard/#mergeerror');
					}else{
						var ord = results[0];
						if(trans.user !== users.username && trans.receiver_username !== users.username){
							var error = 'Something went wrong';
							req.flash('mergeerror', error);
							console.log(username, trans.receiver_username);
							res.redirect('/dashboard/#mergeerror');
						}else{
							if(trans.purpose === 'feeder_bonus' || trans.purpose === 'feeder_matrix'){
								//check if its the same person.
								//console.log(trans.purpose)
								db.query('CALL confirm_feeder1(?,?,?)', [trans.order_id, trans.receiver_username, trans.payer_username ], function(err, results, fields){
									if (err) throw err;
									db.query('SELECT * FROM feeder_tree WHERE order_id = ?', [order_id], function(err, results, fields){
										if (err) throw err;
										var add = results[0];
										if(ord.username === trans.user){
											db.query('UPDATE feeder_tree SET requiredEntrance = ? WHERE username = ? ' , [add.requiredEntrance - 1, trans.payer_username], function(err, results, fields){
												if (err) throw err;
												if(ord.a !== null && ord.b !== null && ord.c !== null){
													db.query('UPDATE feeder_tree SET requiredEntrance = ? WHERE username = ? ' , [ord.requiredEntrance + 1, ord.username], function(err, results, fields){
														if (err) throw err;
														/*func.norec(ord.order_id);*/
														console.log(trans.user, ord.username)
														func.receive();
														func.noreceive();
														var success = 'Payment confirmation was successful!';
														req.flash('success', success);
														res.redirect('/dashboard/#success');
													});
												}else{
													/*func.norec(ord.order_id);*/
													console.log(trans.user, ord.username)
													func.receive();
													func.noreceive();
													var success = 'Payment confirmation was successful!';
													req.flash('success', success);
													res.redirect('/dashboard/#success');
												}
											});
										}else{
											db.query('SELECT requiredEntrance FROM feeder_tree WHERE username = ?', [users.username], function(err, results, fields){
												if (err) throw err;
												var entrance = results[0].requiredEntrance;
												console.log(entrance + ' is entrance ');
												db.query('UPDATE feeder_tree SET requiredEntrance = ? WHERE username = ? ' , [entrance - 1, trans.payer_username], function(err, results, fields){
													if (err) throw err;
													if(ord.a !== null && ord.b !== null && ord.c !== null){
														db.query('UPDATE feeder_tree SET requiredEntrance = ? WHERE username = ? ' , [ord.requiredEntrance + 1, ord.username], function(err, results, fields){
															if (err) throw err;
															func.receive();
															func.noreceive();
															var success = 'Payment confirmation was successful!';
															req.flash('success', success);
															res.redirect('/dashboard/#success');
														});
													}else{
														func.receive();
														func.noreceive();
														var success = 'Payment confirmation was successful!';
														req.flash('success', success);
														res.redirect('/dashboard/#success');
													}
												});
											});
										}
									});
								});
								
							}//next if for the next matrix which is the starter matrix.
						}
					}
				});
			}
		});
	});
});


router.post('/confirm-payment-act/:order_id/', authentificationMiddleware(), function(req, res, next){
	var order_id = req.params.order_id;
	var currentUser = req.session.passport.user.user_id;
	db.query('SELECT * FROM transactions WHERE order_id = ?', [order_id], function(err, results, fields){
		if (err) throw err;
		if(results.length === 0){
			var error = 'Something went wrong';
			req.flash('mergeerror', error);
			res.redirect('/dashboard/#mergeerror');
		}else{
			var trans = results[0];
			if(trans.purpose === 'activation'){
				db.query('UPDATE user SET activated = ? WHERE username = ?', ['yes', trans.payer_username], function(err, results, fields){
					if (err) throw err;
					db.query('UPDATE transactions SET status = ? WHERE order_id = ?', ['confirmed', order_id], function(err, results, fields){
						if (err) throw err;
						var success = 'Payment confirmation was successful!';
						req.flash('success', success);
						res.redirect('/dashboard/#success');
						
					});
				});
			}
		}
	});
});


router.post('/passwordreset',[	 check('email', 'Email must be between 8 to 50 characters').isLength(8, 50).isEmail()], function(req, res, next){
	var email = req.body.email
	var errors = validationResult(req).errors;
	if (errors.length > 0){
		res.render('passwordreset', {mess: 'Password Reset Failed', errors: errors, email: email});
	}else{
		db.query('SELECT email FROM user WHERE email = ?', [email], function(err, results, fields){
			if (err) throw err;
			if(results.length === 0){
				var error = 'There is no user associated with this email';
				req.flash('error', error);
				console.log(error)
				res.redirect('/passwordreset');
			}else{
				var date = new Date();
				date.setMinutes(date.getMinutes() + 20);
				//generate pin
				securePin.generateString(35, charSet, function(str){
					var link =  '/'+ email + '/' + str;
					db.query('INSERT INTO passwordReset (email, expire, link) VALUES (?,?,?)', [email, date, link], function(err, results, fields){
						if(err) throw err;
						var mail = require('../nodemailer/password.js')
						mail.passReset(email, link, date);
						func.preset()
						var success = 'A link has been sent to your email... Check your spam if you did not see it in your inbox.';
						req.flash('success', success);
						res.redirect('/passwordreset/' + email + '/' + str);
					});
				});
			}
		});
	}
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
					bcrypt.hash(password, saltRounds, function(err, hash){
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


//enter feeder
router.post('/enter-feeder',authentificationMiddleware(), function(req, res, next){
	var currentUser = req.session.passport.user.user_id;
	func.feedtimer();
	//get the username
	db.query('SELECT * FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
		if (err) throw err;
		var bio = results[0];
		db.query('SELECT * FROM feeder_tree WHERE username = ? AND (status = ? OR status = ?)', [bio.username, 'pending', 'unconfirmed'], function(err, results, fields){
			if (err) throw err;
			if(results.length > 0){
				//console.log(results)
				var error = 'Oooops! you have an unconfirmed feeder matrix transaction. Try again once it is confirmed.';
				req.flash('mergeerror', error)
				res.redirect('/dashboard')
			}else{
				//check if the user has entered the matrix before now
				db.query('SELECT * FROM feeder_tree WHERE username = ?', [bio.username], function(err, results, fields){
					if (err) throw err;
					//console.log(bio)
					if(results.length === 0){
						//get from sponsor
						mergefeed1.merge(bio, req, res);
					}else if(results.length === 1){
						//place under self
						mergefeed1.merge2(bio, req, res);
					}else if(results.length > 1){
						//place under self
						//console.log('> 1')
						mergefeed1.merge(bio, req, res);
					}
				});
			}
		});
	});
});

//post log in
router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
	res.redirect('/dashboard');
  });
/*
  
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  successReturnToOrRedirect: '/dashboard',
  failureFlash: true
}));


*/
//

//Passport login
passport.serializeUser(function(user_id, done){
  done(null, user_id)
});
        
passport.deserializeUser(function(user_id, done){
  done(null, user_id)
});



function authentificationMiddleware(){
  return (req, res, next) => {
    console.log(JSON.stringify(req.session.passport));
  if (req.isAuthenticated()) return next();

  res.redirect('/login'); 
  } 
}

//admin post

//add admin
router.post('/addadmin', authentificationMiddleware(), [ check ('username', 'Username must be between 8 to 15 characters').isLength(8, 15) ], function(req, res, next){
	var currentUser = req.session.passport.user.user_id;
	var username = req.body.username;
	db.query('SELECT * FROM user WHERE username  = ?', [username], function(err, results, fields){
		if( err ) throw err;
		if(results.length === 0){
			var error = 'This user does not exist!';
			req.flash('adderror', error);
			res.redirect('/admin-dashboard/#adderror');
		}else{
			if(results[0].user_type === 'admin'){
				var error = 'This user is already an admin!';
				req.flash('adderror', error);
				res.redirect('/admin-dashboard/#adderror');
			}else{
				db.query('UPDATE  user SET user_type = ? WHERE username  = ?', ['admin', username], function(err, results, fields){
					if( err ) throw err;
					var success = 'Admin was added'
					req.flash('addsuccess', success)
					res.redirect('/admin-dashboard/#addsuccess');
				});
			}
		}
	});
});

//DELETE ADMIN
router.post('/deladmin', authentificationMiddleware(), [ check ('username', 'Username must be between 8 to 15 characters').isLength(8, 15) ], function(req, res, next){
	var currentUser = req.session.passport.user.user_id;
	var username = req.body.username;
	db.query('SELECT * FROM user WHERE username  = ?', [username], function(err, results, fields){
		if( err ) throw err;
		if(results.length === 0){
			var error = 'This user does not exist!';
			req.flash('delerror', error);
			res.redirect('/admin-dashboard/#deladmin');
		}else{
			if(results[0].user_type === 'user'){
				var error = 'This user is NOT an admin!';
			req.flash('delerror', error);
			res.redirect('/admin-dashboard/#deladmin');
			}else{
				db.query('UPDATE  user SET user_type = ? WHERE username  = ?', ['user', username], function(err, results, fields){
					if( err ) throw err;
					var success = 'Admin was deleted'
					req.flash('delsuccess', success)
					res.redirect('/admin-dashboard/#deladmin');
				});
			}
		}
	});
});


//search by username
router.post('/searchUser', authentificationMiddleware(), [ check ('username', 'Username must be between 8 to 15 characters').isLength(8, 15) ], function(req, res, next){
	var currentUser = req.session.passport.user.user_id;
	var username = req.body.username;
	db.query('SELECT * FROM user WHERE username = ?', [username], function(err, results, fields){
		if( err ) throw err;
		if(results.length === 0){
			var error = 'Sorry, this username does not exist';
			req.flash('error', error);
			res.redirect('/admin-dashboard/#search');
		}else{
			var Search = results[0];
			res.render('usersearch', {mess: 'SEACH USER', Search: Search, search: 'Your search by username is ready'});
		}
	});
});

//search by email
router.post('/searchEmail', authentificationMiddleware(), [ check ('email', 'Email must be between 8 to 15 characters').isLength(8, 15).isEmail() ], function(req, res, next){
	var currentUser = req.session.passport.user.user_id;
	var email = req.body.email;
	db.query('SELECT * FROM user WHERE email = ?', [email], function(err, results, fields){
		if( err ) throw err;
		if(results.length === 0){
			var error = 'Sorry, this Email does not exist';
			req.flash('error', error);
			res.redirect('/admin-dashboard/#search');
		}else{
			var emailSearch = results[0];
			res.render('search', {mess: 'Admin Dashboard', emailSearch: emailSearch, search: 'Your search by email is ready'});
		}
	});
});
  
//restrictUser
router.post('/restrict', authentificationMiddleware(), [ check ('username', 'Username must be between 8 to 15 characters').isLength(8, 15)], function(req, res, next){
	var currentUser = req.session.passport.user.user_id;
	var username = req.body.username;
	db.query('SELECT * FROM feeder_tree WHERE username = ?', [username], function(err, results, fields){
		if( err ) throw err;
		if(results.length === 0){
			var error = 'Sorry, this username does not exist';
			req.flash('error', error);
			res.redirect('/admin-dashboard/#restricterror');
		}else{
			db.query('SELECT restricted FROM feeder_tree WHERE username = ?', [username], function(err, results, fields){
				if( err ) throw err;
				var restrict = results[0].restricted;
				if(restrict === 'Yes'){
					var error = 'This user has been restricted already';
					req.flash('error', error);
					res.redirect('/admin-dashboard/#restricterror');
				} else {
					db.query('UPDATE feeder_tree SET restricted = ? WHERE username = ?', ['No', username], function(err, results, fields){
						if( err ) throw err;
						var success = 'This user has been restricted successfully';
						req.flash('error', error);
					});
				}
			});
		}
	});
});


//UnrestrictUser
router.post('/unrestrict', authentificationMiddleware(), [ check ('username', 'Username must be between 8 to 15 characters').isLength(8, 15)], function(req, res, next){
	var currentUser = req.session.passport.user.user_id;
	var username = req.body.username;
	db.query('SELECT * FROM feeder_tree WHERE username = ?', [username], function(err, results, fields){
		if( err ) throw err;
		if(results.length === 0){
			var error = 'Sorry, this username does not exist';
			req.flash('error', error);
			res.redirect('/admin-dashboard/#restricterror');
		}else{
			db.query('SELECT restricted FROM feeder_tree WHERE username = ?', [username], function(err, results, fields){
				if( err ) throw err;
				var restrict = results[0].restricted;
				if(restrict === 'No'){
					var error = 'This user has been restricted already';
					req.flash('error', error);
					res.redirect('/admin-dashboard/#restricterror');
				} else {
					db.query('UPDATE feeder_tree SET restricted = ? WHERE username = ?', ['Yes', username], function(err, results, fields){
						if( err ) throw err;
						var success = 'This user has been unrestricted successfully';
						req.flash('error', error);
					});
				}
			});
		}
	});
});


router.get( '*', function ( req, res, next ){
	var error = 'PAGE NOT FOUND!';
	res.status( 404 ).render( '404',{title: error} );
});

module.exports = router;
