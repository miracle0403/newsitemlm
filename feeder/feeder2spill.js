var flash = require('express-flash-messages');
//var securePin = require('secure-pin');
var db = require('../db.js');

exports.feeder2spill = function(bio, receiver, req, res, order_id, date){
	//console.log('start', receiver)
	if (receiver.a === null && receiver.receive === 'yes' && receiver.sponreceive === 'yes' && receiver.restricted === 'No'){
		console.log('a')
		var purpose = 'feeder_matrix';
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
							db.query('CALL placefeeder(?,?,?,?,?,?,?)', [bio.username, purpose, receiver.username, receiver.username, order_id, date, receiver.order_id], function(err, results, fields){
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
							db.query('CALL placefeeder(?,?,?,?,?,?,?)', [bio.username, purpose, receiver.username, receiver.username, order_id, date, receiver.order_id], function(err, results, fields){
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
		console.log('b1')
		var purpose = 'feeder_bonus';
		db.query('UPDATE feeder_tree SET b = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
			if(err) throw err;
			db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, bio.sponsor], function(err, results, fields){
				if (err) throw err;
				db.query('SELECT requiredEntrance, receive FROM feeder_tree WHERE username = ?', [bio.username], function(err, results, fields){
					if(err) throw err;
					if(results[0].requiredEntrance === null && results[0].receive === null){
						var entrance = 2;
						var receive = 'No';
						db.query('UPDATE feeder_tree SET requiredEntrance = ?, receive = ?, sponreceive = ? WHERE order_id = ?', [entrance, receive, receiver.receive, order_id], function(err, results, fields){
							if(err) throw err;
							db.query('CALL placefeeder1(?,?,?,?,?,?,?)', [bio.username, purpose, bio.sponsor, receiver.username, order_id, date, receiver.order_id], function(err, results, fields){
								if (err) throw err;
								var success = 'You have been assigned to pay someone';
								req.flash('success', success);
								res.redirect('/dashboard')
							});
						});
					}else{
						var entrance = results[0].requiredEntrance;
						var receive = results[0].receive;
						console.log(results)
						//update sponreceive, receive of the new user
						db.query('UPDATE feeder_tree SET requiredEntrance = ?, receive = ?, sponreceive = ? WHERE order_id = ?', [entrance, receive, receiver.receive, order_id], function(err, results, fields){
							if(err) throw err;
							db.query('CALL placefeeder1(?,?,?,?,?,?,?)', [bio.username, purpose, bio.sponsor, receiver.username, order_id, date, receiver.order_id], function(err, results, fields){
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
	}else if(receiver.b === null  && receiver.receive === 'yes' && receiver.sponreceive === 'yes' && receiver.restricted === 'No'){
		//adds b
		console.log('b2', receiver)
		var purpose = 'feeder_bonus';
		db.query('UPDATE feeder_tree SET b = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
			if(err) throw err;
			db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, bio.sponsor], function(err, results, fields){
				if (err) throw err;
				db.query('SELECT requiredEntrance, receive FROM feeder_tree WHERE username = ?', [bio.username], function(err, results, fields){
					if(err) throw err;
					if(results[0].requiredEntrance === null && results[0].receive === null){
						var entrance = 2;
						var receive = 'No';
						db.query('UPDATE feeder_tree SET requiredEntrance = ?, receive = ?, sponreceive = ? WHERE order_id = ?', [entrance, receive, receiver.receive, order_id], function(err, results, fields){
							if(err) throw err;
							db.query('CALL placefeeder1(?,?,?,?,?,?,?)', [bio.username, purpose, bio.sponsor, receiver.username, order_id, date, receiver.order_id], function(err, results, fields){
								if (err) throw err;
								var success = 'You have been assigned to pay someone';
								req.flash('success', success);
								res.redirect('/dashboard')
							});
						});
					}else{
						var entrance = results[0].requiredEntrance;
						var receive = results[0].receive;
						console.log(results)
						//update sponreceive, receive of the new user
						db.query('UPDATE feeder_tree SET requiredEntrance = ?, receive = ?, sponreceive = ? WHERE order_id = ?', [entrance, receive, receiver.receive, order_id], function(err, results, fields){
							if(err) throw err;
							db.query('CALL placefeeder1(?,?,?,?,?,?,?)', [bio.username, purpose, bio.sponsor, receiver.username, order_id, date, receiver.order_id], function(err, results, fields){
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
	}else if (receiver.a !== null && receiver.c === null  && receiver.receive === 'yes' && receiver.sponreceive !== 'yes' && receiver.restricted === 'No'){
		//adds c
		console.log('c1')
		var purpose = 'feeder_matrix';
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
							db.query('CALL placefeeder(?,?,?,?,?,?,?)', [bio.username, purpose, receiver.username, receiver.username, order_id, date, receiver.order_id], function(err, results, fields){
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
							db.query('CALL placefeeder(?,?,?,?,?,?,?)', [bio.username, purpose, receiver.username, receiver.username, order_id, date, receiver.order_id], function(err, results, fields){
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
		console.log('c2', receiver);
		var purpose = 'feeder_matrix';
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
							db.query('CALL placefeeder(?,?,?,?,?,?,?)', [bio.username, purpose, receiver.username, receiver.username, order_id, date, receiver.order_id], function(err, results, fields){
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
							db.query('CALL placefeeder(?,?,?,?,?,?,?)', [bio.username, purpose, receiver.username, receiver.username, order_id, date, receiver.order_id], function(err, results, fields){
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
	}else{
		// check where the max amount where receiver and sponreceive = yes and fix it there.
		console.log('fix elsewhere');
	}
}