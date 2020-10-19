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
	}else if (receiver.a === null && receiver.b !== null && receiver.c === null && receiver.receive === 'yes' && receiver.spon_receive === 'yes'){
		//inserts into a
		db.query('UPDATE feeder_tree SET a = ? WHERE username = ?', [bio.username, receiver.username], function(err, results, fields){
			if(err) throw err;
			var purpose = 'feeder_matrix';
			db.query('CALL leafadd(?,?,?)', [receiver.sponsor, receiver.user, bio.username], function(err, results, fields){
				if (err) throw err;
				securePin.generateString (10, charSet, function(str){
					var date = new Date();
					date.setHours(date.getHours() + 3);
					var year = date.getFullYear();
					var month = date.getMonth() + 1;
					var day = date.getDate() + 1;
					var order_id = 'fe' + str + year + month + day;
					db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.username, receiver.username, order_id, date], function(err, results, fields){
						if (err) throw err;
						var success = 'You have been assigned to pay someone';
						req.flash('success', success);
						res.redirect('/dashboard')
					});
				});
			});
		});
	}//
}