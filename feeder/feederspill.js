var flash = require('express-flash-messages');

var db = ('../db.js');

exports.feederspill = function(){
	
	db.query('SELECT node.username,   (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? GROUP BY node.username ORDER BY node.lft) AS sub_tree WHERE (node.receive = ? OR node.sponreceive = ?) AND node.amount < 3 AND node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.username = sub_tree.username GROUP BY node.username HAVING depth > 0 ORDER BY depth', [u], function(err, results, fields){
		if( err ) throw err;
		var feederdepth = results[0].depth;
		db.query('SELECT node.a, node.b, node.c, node.receive, node.sponreceive, node.username,   (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.a, node.b, node.c, node.receive, node.sponreceive, node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE  node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? GROUP BY node.username ORDER BY node.lft) AS sub_tree WHERE (node.receive = ? OR node.sponreceive = ?) node.amount = 0 AND node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.username = sub_tree.username GROUP BY node.username HAVING depth > ? ORDER BY depth', [receiver.username, 'yes', 'yes',0], function(err, results, fields){
			if( err ) throw err;
			var feeder1 = results[0];
			if(feederdepth === feeder1.depth){
				//check for the nodes
				if (feeder1.a === null && feeder1.b === null && feeder1.c === null && feeder1.receive === 'yes' && feeder1.spon_receive === 'yes'){
					//inserts into a 
					db.query('UPDATE feeder_tree SET a = ? WHERE username = ?', [bio.username, feeder1.username], function(err, results, fields){
						if(err) throw err;
						var purpose = 'feeder_matrix';
						db.query('CALL leafadd(?,?,?)', [receiver.sponsor, receiver.username, bio.username], function(err, results, fields){
							if (err) throw err;
							securePin.generateString (10, charSet, function(str){
								var date = new Date();
								date.setHours(date.getHours() + 3);
								var year = date.getFullYear();
								var month = date.getMonth() + 1;
								var day = date.getDate() + 1;
								var order_id = 'fe' + str + year + month + day;
								db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, feeder1.username, feeder1.username, order_id, date], function(err, results, fields){
									if (err) throw err;
									var success = 'You have been assigned to pay someone';
									req.flash('success', success);
									res.redirect('/dashboard')
								});
							});
						});
					});
				}else if (feeder1.a === null && feeder1.b === null && feeder1.c === null && feeder1.receive === 'yes' && feeder1.spon_receive !== 'yes'){
					//inserts into a 
					db.query('UPDATE feeder_tree SET a = ? WHERE username = ?', [bio.username, feeder1.username], function(err, results, fields){
						if(err) throw err;
						var purpose = 'feeder_matrix';
						db.query('CALL leafadd(?,?,?)', [receiver.sponsor, receiver.username, bio.username], function(err, results, fields){
							if (err) throw err;
							securePin.generateString (10, charSet, function(str){
								var date = new Date();
								date.setHours(date.getHours() + 3);
								var year = date.getFullYear();
								var month = date.getMonth() + 1;
								var day = date.getDate() + 1;
								var order_id = 'fe' + str + year + month + day;
								db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, feeder1.username, feeder1.username, order_id, date], function(err, results, fields){
									if (err) throw err;
									var success = 'You have been assigned to pay someone';
									req.flash('success', success);
									res.redirect('/dashboard')
								});
							});
						});
					});
				}else if (feeder1.a === null && feeder1.b === null && feeder1.c === null && feeder1.receive !== 'yes' && feeder1.spon_receive === 'yes'){
					//inserts into b
					db.query('UPDATE feeder_tree SET a = ? WHERE username = ?', [bio.username, feeder1.username], function(err, results, fields){
						if(err) throw err;
						var purpose = 'feeder_matrix';
						db.query('CALL leafadd(?,?,?)', [receiver.sponsor, receiver.username, bio.username], function(err, results, fields){
							if (err) throw err;
							securePin.generateString (10, charSet, function(str){
								var date = new Date();
								date.setHours(date.getHours() + 3);
								var year = date.getFullYear();
								var month = date.getMonth() + 1;
								var day = date.getDate() + 1;
								var order_id = 'fe' + str + year + month + day;
								db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, feeder1.sponsor, feeder1.username, order_id, date], function(err, results, fields){
									if (err) throw err;
									var success = 'You have been assigned to pay someone';
									req.flash('success', success);
									res.redirect('/dashboard')
								});
							});
						});
					});
				}else{
					//send to feeder 2
					db.query('SELECT node.a, node.b, node.c, node.receive, node.sponreceive, node.username,   (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.a, node.b, node.c, node.receive, node.sponreceive, node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE  node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? GROUP BY node.username ORDER BY node.lft) AS sub_tree WHERE (node.receive = ? OR node.sponreceive = ?) node.amount = 1 AND node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.username = sub_tree.username GROUP BY node.username HAVING depth > ? ORDER BY depth', [receiver.username, 'yes', 'yes',0], function(err, results, fields){
						if( err ) throw err;
						var feeder2 = results[0];
						if(feederdepth === feeder2.depth){
							if (feeder2.a === null && feeder2.b === null && feeder2.c === null && feeder2.receive === 'yes' && feeder2.spon_receive === 'yes'){
								//check the nodes
							}else{/*check feeder3*/}
						}else{
							//check for feeder 3
						}
					});
				}
			}else{
				//check the empty one
				db.query('SELECT node.a, node.b, node.c, node.receive, node.sponreceive, node.username,   (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.a, node.b, node.c, node.receive, node.sponreceive, node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE  node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? GROUP BY node.username ORDER BY node.lft) AS sub_tree WHERE (node.receive = ? OR node.sponreceive = ?) node.amount = 1 AND node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.username = sub_tree.username GROUP BY node.username HAVING depth > ? ORDER BY depth', [receiver.username, 'yes', 'yes',0], function(err, results, fields){
					if( err ) throw err;
					var feeder2 = results[0];
					if(feederdepth === feeder2.depth){
						//check for the nodes
						
					}else{
						//check for 2 
						db.query('SELECT node.a, node.b, node.c, node.receive, node.sponreceive, node.username,   (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.a, node.b, node.c, node.receive, node.sponreceive, node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE  node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? GROUP BY node.username ORDER BY node.lft) AS sub_tree WHERE (node.receive = ? OR node.sponreceive = ?) node.amount = 2 AND node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.username = sub_tree.username GROUP BY node.username HAVING depth > ? ORDER BY depth', [receiver.username, 'yes', 'yes',0], function(err, results, fields){
							if( err ) throw err;
							var feeder3 = results[0];
						});
					}
				});
			}
		});
	});
}