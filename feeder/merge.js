var db = require('../db.js');
var feederspill = require('./feederspill.js');
var flash = require('express-flash-messages');
var securePin = require('secure-pin');
var charSet = new securePin.CharSet();
charSet.addLowerCaseAlpha().addUpperCaseAlpha().addNumeric().randomize();

exports.merge = function (receiver, bio, req, res){
	
	if (receiver.a === null  && receiver.receive === 'yes'){
		//inserts into a
		securePin.generateString (10, charSet, function(str){
					var date = new Date();
					date.setHours(date.getHours() + 3);
					var year = date.getFullYear();
					var month = date.getMonth() + 1;
					var day = date.getDate() + 1;
					var order_id = 'fe' + str + year + month + day;
		db.query('UPDATE feeder_tree SET a = ? WHERE username = ?', [bio.username, receiver.username], function(err, results, fields){
			if(err) throw err;
			var purpose = 'feeder_matrix';
			if(receiver.username === bio.sponsor){
				db.query('CALL leafadd(?,?,?,?)', [bio.sponsor, order_id, receiver.username, bio.username], function(err, results, fields){
				if (err) throw err;
				
					db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.username, receiver.username, order_id, date], function(err, results, fields){
						if (err) throw err;
						var success = 'You have been assigned to pay someone';
						req.flash('success', success);
						res.redirect('/dashboard')
					});
				});
			}else{
				db.query('CALL leafadd(?,?,?,?)', [receiver.sponsor, order_id, receiver.username, bio.username], function(err, results, fields){
				if (err) throw err;
				
					db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.username, receiver.username, order_id, date], function(err, results, fields){
						if (err) throw err;
						var success = 'You have been assigned to pay someone';
						req.flash('success', success);
						res.redirect('/dashboard')
					});
				});
			}
			});
		});
	}else if (receiver.b === null  && receiver.receive !== 'yes' && receiver.sponreceive === 'yes'){
		securePin.generateString (10, charSet, function(str){
					var date = new Date();
					date.setHours(date.getHours() + 3);
					var year = date.getFullYear();
					var month = date.getMonth() + 1;
					var day = date.getDate() + 1;
					var order_id = 'fe' + str + year + month + day;
		db.query('UPDATE feeder_tree SET b = ? WHERE username = ?', [bio.username, receiver.username], function(err, results, fields){
			if(err) throw err;
			var purpose = 'feeder_bonus';
			if(receiver.username === bio.sponsor){
				db.query('CALL leafadd(?,?,?,?)', [bio.sponsor, order_id, receiver.username, bio.username], function(err, results, fields){
				if (err) throw err;
				
					db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.sponsor, receiver.username, order_id, date], function(err, results, fields){
						if (err) throw err;
						var success = 'You have been assigned to pay someone';
						req.flash('success', success);
						res.redirect('/dashboard')
					});
				});
			}else{
				db.query('CALL leafadd(?,?,?,?)', [receiver.sponsor, order_id, receiver.username, bio.username], function(err, results, fields){
				if (err) throw err;
				
					db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.sponsor, receiver.username, order_id, date], function(err, results, fields){
						if (err) throw err;
						var success = 'You have been assigned to pay someone';
						req.flash('success', success);
						res.redirect('/dashboard')
					});
				});
			}
			});
		});
	}else if (receiver.a !== null && receiver.b === null  &&  receiver.sponreceive === 'yes'){
		securePin.generateString (10, charSet, function(str){
					var date = new Date();
					date.setHours(date.getHours() + 3);
					var year = date.getFullYear();
					var month = date.getMonth() + 1;
					var day = date.getDate() + 1;
					var order_id = 'fe' + str + year + month + day;
		db.query('UPDATE feeder_tree SET b = ? WHERE username = ?', [bio.username, receiver.username], function(err, results, fields){
			if(err) throw err;
			var purpose = 'feeder_bonus';
			if(receiver.username === bio.sponsor){
				db.query('CALL leafadd(?,?,?,?)', [bio.sponsor, order_id, receiver.username, bio.username], function(err, results, fields){
				if (err) throw err;
				
					db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.sponsor, receiver.username, order_id, date], function(err, results, fields){
						if (err) throw err;
						var success = 'You have been assigned to pay someone';
						req.flash('success', success);
						res.redirect('/dashboard')
					});
				});
			}else{
				db.query('CALL leafadd(?,?,?,?)', [receiver.sponsor, order_id, receiver.username, bio.username], function(err, results, fields){
				if (err) throw err;
				
					db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.sponsor, receiver.username, order_id, date], function(err, results, fields){
						if (err) throw err;
						var success = 'You have been assigned to pay someone';
						req.flash('success', success);
						res.redirect('/dashboard')
					});
				});
			}
		});
	});
	}else if (receiver.a !== null && receiver.c === null  && receive === 'yes' && receiver.sponreceive !== 'yes'){
		//c
	}else if (receiver.a !== null && receiver.b === null && receiver.c === null  &&  receiver.sponreceive === 'yes'){
		//c
	}
}



exports.merge2 = function (receiver, bio, req, res){
	if (receiver.a === null){
		//inserts into a
		securePin.generateString (10, charSet, function(str){
					var date = new Date();
					date.setHours(date.getHours() + 3);
					var year = date.getFullYear();
					var month = date.getMonth() + 1;
					var day = date.getDate() + 1;
					var order_id = 'fe' + str + year + month + day;
		db.query('UPDATE feeder_tree SET a = ? WHERE username = ?', [bio.username, receiver.username], function(err, results, fields){
			if(err) throw err;
			var purpose = 'feeder_matrix';
				db.query('CALL leafadd(?,?,?,?)', [receiver.sponsor, order_id, receiver.username, bio.username], function(err, results, fields){
				if (err) throw err;
				
					db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.username, receiver.username, order_id, date], function(err, results, fields){
						if (err) throw err;
						var success = 'You have been assigned to pay someone';
						req.flash('success', success);
						res.redirect('/dashboard')
					});
				});
			});
		});
	}
}
	