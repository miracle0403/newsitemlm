var db = require('../db.js');
var feederspill = require('./feederspill.js');
var flash = require('express-flash-messages');
var securePin = require('secure-pin');
var charSet = new securePin.CharSet();
charSet.addLowerCaseAlpha().addUpperCaseAlpha().addNumeric().randomize();
var func = require('../routes/func.js');

exports.merge = function (bio, req, res){
	db.query('SELECT * FROM feeder_tree WHERE username = ?', [bio.sponsor], function(err, results, fields){
		if(err) throw err;
		securePin.generateString (10, charSet, function(str){
			var date = new Date();
			date.setHours(date.getHours() + 3);
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate() + 1;
			var order_id = 'fe' + str + year + month + day;
			//if the sponsor is not in the matrix
			if(results.length === 0){
				console.log('not in matrix')
				//get default sponsor
				db.query('SELECT username FROM default_sponsor', function(err, results, fields){
					if(err) throw err;
					var sponsor = results[0];
					db.query('SELECT * FROM feeder_tree WHERE username = ?', [sponsor], function(err, results, fields){
						if(err) throw err;
						var receiver = results[0];
						console.log('its here')
					});
				});
			}else{
				//is in the matrix
				var receiver = results[0];
				if(receiver.a === null && receiver.receive === 'yes' && receiver.restricted === 'No'){
					//adds a
					var purpose = 'feeder_matrix';
					//console.log(receiver)
					db.query('UPDATE feeder_tree SET a = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
						if(err) throw err;
						db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, bio.sponsor], function(err, results, fields){
							if (err) throw err;
							//check if the user has entered before now to get requiredEntrance
							db.query('SELECT requiredEntrance, receive FROM feeder_tree WHERE username = ?', [bio.username], function(err, results, fields){
								if(err) throw err;
								if(results.length === 1){
									var entrance = 2;
									var receive = 'No';
									console.log(results)
									//update sponreceive, receive of the new user
									db.query('UPDATE feeder_tree SET requiredEntrance = ?, receive = ?, sponreceive = ? WHERE order_id = ?', [entrance, receive, receiver.receive, order_id], function(err, results, fields){
										if(err) throw err;
										db.query('CALL placefeeder(?,?,?,?,?,?,?)', [bio.username, purpose, bio.sponsor, receiver.username, order_id, date, receiver.order_id], function(err, results, fields){
											if (err) throw err;
											var success = 'You have been assigned to pay someone';
											req.flash('success', success);
											res.redirect('/dashboard')
										});
									});
								}else if(results.length > 1){
									var entrance = results[0].requiredEntrance;
									var receive = results[0].receive;
									console.log(results)
									//update sponreceive, receive of the new user
									db.query('UPDATE feeder_tree SET requiredEntrance = ?, receive = ?, sponreceive = ? WHERE order_id = ?', [entrance, receive, receiver.receive, order_id], function(err, results, fields){
										if(err) throw err;
										db.query('CALL placefeeder(?,?,?,?,?,?,?)', [bio.username, purpose, bio.sponsor, receiver.username, order_id, date, receiver.order_id], function(err, results, fields){
											if (err) throw err;
											var success = 'You have been assigned to pay someone';
											req.flash('success', success);
											res.redirect('/dashboard')
										});
									});
								}
							});
						});
					});
				}else if(receiver.b === null  && receiver.receive !== 'yes' && receiver.sponreceive === 'yes' && receiver.restricted === 'No'){
					//adds b
					//console.log('b')
					var purpose = 'feeder_bonus';
					db.query('UPDATE feeder_tree SET b = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
						if(err) throw err;
						db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, bio.sponsor], function(err, results, fields){
							if (err) throw err;
							db.query('SELECT requiredEntrance, receive FROM feeder_tree WHERE username = ?', [bio.username], function(err, results, fields){
								if(err) throw err;
								var entrance = results[0].requiredEntrance;
								var receive = results[0].receive;
								console.log(results)
								//update sponreceive, receive of the new user
								db.query('UPDATE feeder_tree SET requiredEntrance = ?, receive = ?, sponreceive = ? WHERE order_id = ?', [entrance, receive, receiver.receive, order_id], function(err, results, fields){
									if(err) throw err;
									db.query('CALL placefeeder(?,?,?,?,?,?,?)', [bio.username, purpose, bio.sponsor, receiver.username, order_id, date, receiver.order_id], function(err, results, fields){
										if (err) throw err;
										var success = 'You have been assigned to pay someone';
										req.flash('success', success);
										res.redirect('/dashboard')
									});
								});
							});
						});
					});
				}else if(receiver.b === null  && receiver.receive === 'yes' && receiver.sponreceive === 'yes' && receiver.restricted === 'No'){
					//adds b
					//console.log('b')
					var purpose = 'feeder_bonus';
					db.query('UPDATE feeder_tree SET b = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
						if(err) throw err;
						db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, bio.sponsor], function(err, results, fields){
							if (err) throw err;
							db.query('SELECT requiredEntrance, receive FROM feeder_tree WHERE username = ?', [bio.username], function(err, results, fields){
								if(err) throw err;
								var entrance = results[0].requiredEntrance;
								var receive = results[0].receive;
								console.log(results)
								//update sponreceive, receive of the new user
								db.query('UPDATE feeder_tree SET requiredEntrance = ?, receive = ?, sponreceive = ? WHERE order_id = ?', [entrance, receive, receiver.receive, order_id], function(err, results, fields){
									if(err) throw err;
									db.query('CALL placefeeder(?,?,?,?,?,?,?)', [bio.username, purpose, bio.sponsor, receiver.username, order_id, date, receiver.order_id], function(err, results, fields){
										if (err) throw err;
										var success = 'You have been assigned to pay someone';
										req.flash('success', success);
										res.redirect('/dashboard')
									});
								});
							});
						});
					});
				}else if (receiver.a !== null && receiver.c === null  && receiver.receive === 'yes' && receiver.sponreceive !== 'yes' && receiver.restricted === 'No'){
					//adds c
					console.log('c')
					var purpose = 'feeder_matrix';
					//console.log(receiver)
					db.query('UPDATE feeder_tree SET c = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
						if(err) throw err;
						db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, bio.sponsor], function(err, results, fields){
							if (err) throw err;
							//check if the user has entered before now to get requiredEntrance
							db.query('SELECT requiredEntrance, receive FROM feeder_tree WHERE username = ?', [bio.username], function(err, results, fields){
								if(err) throw err;
								if(results.length === 1){
									var entrance = 2;
									var receive = 'No';
									console.log(results)
									//update sponreceive, receive of the new user
									db.query('UPDATE feeder_tree SET requiredEntrance = ?, receive = ?, sponreceive = ? WHERE order_id = ?', [entrance, receive, receiver.receive, order_id], function(err, results, fields){
										if(err) throw err;
										db.query('CALL placefeeder(?,?,?,?,?,?,?)', [bio.username, purpose, bio.sponsor, receiver.username, order_id, date, receiver.order_id], function(err, results, fields){
											if (err) throw err;
											var success = 'You have been assigned to pay someone';
											req.flash('success', success);
											res.redirect('/dashboard')
										});
									});
								}else if(results.length > 1){
									var entrance = results[0].requiredEntrance;
									var receive = results[0].receive;
									console.log(results)
									//update sponreceive, receive of the new user
									db.query('UPDATE feeder_tree SET requiredEntrance = ?, receive = ?, sponreceive = ? WHERE order_id = ?', [entrance, receive, receiver.receive, order_id], function(err, results, fields){
										if(err) throw err;
										db.query('CALL placefeeder(?,?,?,?,?,?,?)', [bio.username, purpose, bio.sponsor, receiver.username, order_id, date, receiver.order_id], function(err, results, fields){
											if (err) throw err;
											var success = 'You have been assigned to pay someone';
											req.flash('success', success);
											res.redirect('/dashboard')
										});
									});
								}
							});
						});
					});
				}else if (receiver.a !== null && receiver.b !== null && receiver.c === null  &&  receiver.receive === 'yes' && receiver.restricted === 'No'){
					console.log('c');
					var purpose = 'feeder_matrix';
					//console.log(receiver)
					db.query('UPDATE feeder_tree SET c = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
						if(err) throw err;
						db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, bio.sponsor], function(err, results, fields){
							if (err) throw err;
							//check if the user has entered before now to get requiredEntrance
							db.query('SELECT requiredEntrance, receive FROM feeder_tree WHERE username = ?', [bio.username], function(err, results, fields){
								if(err) throw err;
								if(results.length === 1){
									var entrance = 2;
									var receive = 'No';
									console.log(results)
									//update sponreceive, receive of the new user
									db.query('UPDATE feeder_tree SET requiredEntrance = ?, receive = ?, sponreceive = ? WHERE order_id = ?', [entrance, receive, receiver.receive, order_id], function(err, results, fields){
										if(err) throw err;
										db.query('CALL placefeeder(?,?,?,?,?,?,?)', [bio.username, purpose, bio.sponsor, receiver.username, order_id, date, receiver.order_id], function(err, results, fields){
											if (err) throw err;
											var success = 'You have been assigned to pay someone';
											req.flash('success', success);
											res.redirect('/dashboard')
										});
									});
								}else if(results.length > 1){
									var entrance = results[0].requiredEntrance;
									var receive = results[0].receive;
									console.log(results)
									//update sponreceive, receive of the new user
									db.query('UPDATE feeder_tree SET requiredEntrance = ?, receive = ?, sponreceive = ? WHERE order_id = ?', [entrance, receive, receiver.receive, order_id], function(err, results, fields){
										if(err) throw err;
										db.query('CALL placefeeder(?,?,?,?,?,?,?)', [bio.username, purpose, bio.sponsor, receiver.username, order_id, date, receiver.order_id], function(err, results, fields){
											if (err) throw err;
											var success = 'You have been assigned to pay someone';
											req.flash('success', success);
											res.redirect('/dashboard')
										});
									});
								}
							});
						});
					});
				}else if (receiver.a !== null && receiver.c !== null && receiver.b !== null  ){
					console.log('spillover');
					feederspill.feederspill(bio, req, res, order_id);
				}else{
					console.log('spillover');
					feederspill.feederspill(bio, req, res, order_id);
				}
			}
		});
	});
}




exports.merge2 = function (bio, req, res){
	db.query('SELECT * FROM feeder_tree WHERE username = ?', [bio.username], function(err, results, fields){
		if(err) throw err;
		var receiver = results[0];
		securePin.generateString (10, charSet, function(str){
			var date = new Date();
			date.setHours(date.getHours() + 3);
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate() + 1;
			var order_id = 'fe' + str + year + month + day;
			//check if the sponsor is currently in the matrix.
			db.query('SELECT * FROM feeder_tree WHERE username = ?', [bio.sponsor], function(err, results, fields){
				if(err) throw err;
				//if the sponsor is not in the matrix
				if(results.length === 0){
					console.log('not in matrix')
					//get default sponsor
					db.query('SELECT username FROM default_sponsor', function(err, results, fields){
						if(err) throw err;
						var spon = results[0].username;
						db.query('SELECT * FROM feeder_tree WHERE username = ?', [sponsor], function(err, results, fields){
							if(err) throw err;
							var spon = results[0];
							//more stuffs are here
							if(receiver.a === null && receiver.receive === 'yes' && receiver.restricted === 'No'){
								//adds a
								var purpose = 'feeder_matrix';
								//console.log(receiver)
								db.query('UPDATE feeder_tree SET a = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
									if(err) throw err;
									db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, bio.sponsor], function(err, results, fields){
										if (err) throw err;
										//update sponreceive, receive of the new user
										db.query('UPDATE feeder_tree SET requiredEntrance = ?, receive = ?, sponreceive = ? WHERE order_id = ?', [receiver.requiredEntrance, receiver.receive, spon.receive, order_id], function(err, results, fields){
											if(err) throw err;
											db.query('CALL placefeeder(?,?,?,?,?,?,?)', [bio.username, purpose, bio.sponsor, receiver.username, order_id, date, receiver.order_id], function(err, results, fields){
												if (err) throw err;
												func.receive();
												func.noreceive();
												var success = 'You have been assigned to pay someone';
												req.flash('success', success);
												res.redirect('/dashboard')
											});
										});
									});
								});
							}
						});
					});
				}else{
					var spon = results[0];
					//sponsor is in the matrix.
					//console.log(spon, receiver)
					if(receiver.a === null && receiver.restricted === 'No'){
						//adds a
						var purpose = 'feeder_matrix';
						//console.log(receiver)
						db.query('UPDATE feeder_tree SET a = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
							if(err) throw err;
							db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, bio.sponsor], function(err, results, fields){
								if (err) throw err;
								//update sponreceive, receive of the new user
								db.query('UPDATE feeder_tree SET requiredEntrance = ?, receive = ?, sponreceive = ? WHERE order_id = ?', [receiver.requiredEntrance, receiver.receive, spon.receive, order_id], function(err, results, fields){
									if(err) throw err;
									db.query('CALL placefeeder(?,?,?,?,?,?,?)', [bio.username, purpose, bio.sponsor, receiver.username, order_id, date, receiver.order_id], function(err, results, fields){
										if (err) throw err;
										func.receive();
										func.noreceive();
										var success = 'You have been assigned to pay someone';
										req.flash('success', success);
										res.redirect('/dashboard')
									});
								});
							});
						});
					}
				}
			});
		});
	});
}

//console.log(receive, receiver)
		//res.redirect('/dashboard');