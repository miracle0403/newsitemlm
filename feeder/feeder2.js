var flash = require('express-flash-messages');
var securePin = require('secure-pin');
var charSet = new securePin.CharSet();
charSet.addLowerCaseAlpha().addUpperCaseAlpha().addNumeric().randomize();

var db = require('../db.js');

exports.feeder = function(receiver, bio, req, res){
	
	db.query('SELECT node.a, node.b, node.c, node.receive, node.sponreceive, node.username,   (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.a, node.b, node.c, node.receive, node.sponreceive, node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE  node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ?, GROUP BY node.username ORDER BY node.lft) AS sub_tree WHERE node.receive = ? AND node.amount < 3 and node.status = ? AND node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.username = sub_tree.username GROUP BY node.username HAVING depth > 0 ORDER BY depth', [receiver.username, 'yes', 'confirmed'], function(err, results, fields){
		if( err ) throw err;
		if(request.length === 0){
			//check sponreceive
			db.query('SELECT node.a, node.b, node.c, node.receive, node.sponreceive, node.username,   (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.a, node.b, node.c, node.receive, node.sponreceive, node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE  node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? GROUP BY node.username ORDER BY node.lft) AS sub_tree WHERE node.sponreceive = ? AND node.amount < 3 and node.status = ? AND node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.username = sub_tree.username GROUP BY node.username HAVING depth > 0 ORDER BY depth', [receiver.username, 'yes', 'confirmed'], function(err, results, fields){
				if( err ) throw err;
				if(request.length === 0){
					var error = 'Something went wrong';
					req.flash('mergeerror', error);
					res.redirect('/dashboard');
				}else{
					var feeder = results[0];
					//a b c spon receive
					if(feeder.b === null){
						//b
						db.query('UPDATE feeder_tree SET b = ?, amount = amount + 1 WHERE username = ?', [bio.username, feeder.username], function(err, results, fields){
							if(err) throw err;
							var purpose = 'feeder_bonus';
							db.query('CALL leafadd(?,?,?)', [feeder.sponsor, feeder.username, bio.username], function(err, results, fields){
								if (err) throw err;
								securePin.generateString (10, charSet, function(str){
									var date = new Date();
									date.setHours(date.getHours() + 3);
									var year = date.getFullYear();
									var month = date.getMonth() + 1;
									var day = date.getDate() + 1;
									var order_id = 'fe' + str + year + month + day;
									db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, feeder.username, feeder.username, order_id, date], function(err, results, fields){
										if (err) throw err;
										var success = 'You have been assigned to pay someone';
										req.flash('success', success);
										res.redirect('/dashboard')
									});
								});
							});
						});
					}else{
						var error = 'Something went wrong';
					req.flash('mergeerror', error);
					res.redirect('/dashboard');
					}
				}
			});
		}else{
			//a b c receive
			var feeder = results[0];
			if(feeder.a === null){
				//a
				db.query('UPDATE feeder_tree SET a = ?, amount = amount + 1 WHERE username = ?', [bio.username, feeder.username], function(err, results, fields){
							if(err) throw err;
							var purpose = 'feeder_matrix';
							db.query('CALL leafadd(?,?,?)', [feeder.sponsor, feeder.username, bio.username], function(err, results, fields){
								if (err) throw err;
								securePin.generateString (10, charSet, function(str){
									var date = new Date();
									date.setHours(date.getHours() + 3);
									var year = date.getFullYear();
									var month = date.getMonth() + 1;
									var day = date.getDate() + 1;
									var order_id = 'fe' + str + year + month + day;
									db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, feeder.username, feeder.username, order_id, date], function(err, results, fields){
										if (err) throw err;
										var success = 'You have been assigned to pay someone';
										req.flash('success', success);
										res.redirect('/dashboard')
									});
								});
							});
						});
			}else if(feeder.a !== null && feeder.b === null && feeder.c === null && feeder.sponreceive === 'yes'){
				//b
				db.query('UPDATE feeder_tree SET b = ?, amount = amount + 1 WHERE username = ?', [bio.username, feeder.username], function(err, results, fields){
							if(err) throw err;
							var purpose = 'feeder_bonus';
							db.query('CALL leafadd(?,?,?)', [feeder.sponsor, feeder.username, bio.username], function(err, results, fields){
								if (err) throw err;
								securePin.generateString (10, charSet, function(str){
									var date = new Date();
									date.setHours(date.getHours() + 3);
									var year = date.getFullYear();
									var month = date.getMonth() + 1;
									var day = date.getDate() + 1;
									var order_id = 'fe' + str + year + month + day;
									db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, feeder.username, feeder.username, order_id, date], function(err, results, fields){
										if (err) throw err;
										var success = 'You have been assigned to pay someone';
										req.flash('success', success);
										res.redirect('/dashboard')
									});
								});
							});
						});
			}else if(feeder.a !== null &&  feeder.c === null && feeder.sponreceive !== 'yes'){
				//c
				db.query('UPDATE feeder_tree SET c = ?, amount = amount + 1 WHERE username = ?', [bio.username, feeder.username], function(err, results, fields){
							if(err) throw err;
							var purpose = 'feeder_matrix';
							db.query('CALL leafadd(?,?,?)', [feeder.sponsor, feeder.username, bio.username], function(err, results, fields){
								if (err) throw err;
								securePin.generateString (10, charSet, function(str){
									var date = new Date();
									date.setHours(date.getHours() + 3);
									var year = date.getFullYear();
									var month = date.getMonth() + 1;
									var day = date.getDate() + 1;
									var order_id = 'fe' + str + year + month + day;
									db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, feeder.username, feeder.username, order_id, date], function(err, results, fields){
										if (err) throw err;
										var success = 'You have been assigned to pay someone';
										req.flash('success', success);
										res.redirect('/dashboard')
									});
								});
							});
						});
			}else{
				var error = 'Something went wrong';
					req.flash('mergeerror', error);
					res.redirect('/dashboard');
			}
		}
	});
}