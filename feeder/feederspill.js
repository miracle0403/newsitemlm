var flash = require('express-flash-messages');

var db = require('../db.js');

exports.feederspill = function(receiver, bio, req, res){
	
	db.query('SELECT node.username,   (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? GROUP BY node.username ORDER BY node.lft) AS sub_tree WHERE (node.receive = ? OR node.sponreceive = ?) AND node.amount < 3 node.status = ? AND node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.username = sub_tree.username GROUP BY node.username HAVING depth > 0 ORDER BY depth', [receiver.username, 'yes', 'yes', 'confirmed'], function(err, results, fields){
		if( err ) throw err;
		var feederdepth = results[0].depth;
		db.query('SELECT node.a, node.b, node.c, node.receive, node.sponreceive, node.username,   (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.a, node.b, node.c, node.receive, node.sponreceive, node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE  node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? GROUP BY node.username ORDER BY node.lft) AS sub_tree WHERE (node.receive = ? OR node.sponreceive = ?) node.amount = ? node.status = ? AND node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.username = sub_tree.username GROUP BY node.username HAVING depth > ? ORDER BY depth', [receiver.username, 'yes', 'yes',0, 'confirmed'], function(err, results, fields){
			if( err ) throw err;
			var feeder = results[0];
			 if(feederdepth === feeder.depth){
			 		//check for empty a b c
			 		if(feeder.a === null && feeder.receive === 'yes' && feeder.spon_receive === 'yes'){
			 			//inserts in a
			 			db.query('UPDATE feeder_tree SET a = ? amount = ? WHERE username = ?', [bio.username, 1, feeder.username], function(err, results, fields){
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
					}else if(feeder.a === null && feeder.receive === 'yes' && feeder.spon_receive !== 'yes'){
			 			//inserts in a
			 			db.query('UPDATE feeder_tree SET a = ? amount = ? WHERE username = ?', [bio.username, 1, feeder.username], function(err, results, fields){
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
					}else if (feeder.a === null && feeder.b === null && feeder.receive !== 'yes' && feeder.spon_receive == 'yes'){
			 			//inserts in b
			 			db.query('UPDATE feeder_tree SET a = ? amount = ? WHERE username = ?', [bio.username, 1, feeder.username], function(err, results, fields){
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
									db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, feeder.sponsor, feeder.username, order_id, date], function(err, results, fields){
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
			 }else{
			 		//check for feeder 2
			 		db.query('SELECT node.a, node.b, node.c, node.receive, node.sponreceive, node.username,   (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.a, node.b, node.c, node.receive, node.sponreceive, node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE  node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? GROUP BY node.username ORDER BY node.lft) AS sub_tree WHERE (node.receive = ? OR node.sponreceive = ?) node.amount = ? node.status = ? AND node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.username = sub_tree.username GROUP BY node.username HAVING depth > ? ORDER BY depth', [receiver.username, 'yes', 'yes',1, 'confirmed'], function(err, results, fields){
			 			if( err ) throw err;
			 			if(request.length === 0){
			 				//check for feeder 3
			 				db.query('SELECT node.a, node.b, node.c, node.receive, node.sponreceive, node.username,   (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.a, node.b, node.c, node.receive, node.sponreceive, node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE  node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? GROUP BY node.username ORDER BY node.lft) AS sub_tree WHERE (node.receive = ? OR node.sponreceive = ?) node.amount = ? node.status = ? AND node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.username = sub_tree.username GROUP BY node.username HAVING depth > ? ORDER BY depth', [receiver.username, 'yes', 'yes',2, 'confirmed'], function(err, results, fields){
			 					if( err ) throw err;
			 					if(request.length === 0){
			 						//throw error
			 						var error = 'Something went wrong';
									req.flash('mergeerror', error);
									res.redirect('/dashboard');
			 					}else{
			 						//feeder 3 check a b c
			 						var feeder = results[0];
			 						if(feederdepth === feeder.depth){
			 							if(feeder.a === null && feeder.receive === 'yes' && feeder.spon_receive === 'yes'){
			 								//place in a 
			 								
			 								db.query('UPDATE feeder_tree SET a = ? amount = ? WHERE username = ?', [bio.username, 3, feeder.username], function(err, results, fields){
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
			 								}else if(feeder.a === null && feeder.receive === 'yes' && feeder.spon_receive !== 'yes'){
			 								//place in a 
			 									db.query('UPDATE feeder_tree SET a = ? amount = ? WHERE username = ?', [bio.username, 3, feeder.username], function(err, results, fields){
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
			 								}else if(feeder.b === null && feeder.receive !== 'yes' && feeder.spon_receive === 'yes'){
			 								//place in b
			 									db.query('UPDATE feeder_tree SET b = ? amount = ? WHERE username = ?', [bio.username, 3, feeder.username], function(err, results, fields){
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
														db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, feeder.sponsor, feeder.username, order_id, date], function(err, results, fields){
															if (err) throw err;
															var success = 'You have been assigned to pay someone';
															req.flash('success', success);
															res.redirect('/dashboard')
														});
													});
												});
											});
			 								}else if(feeder.a !== null && feeder.b === null && feeder.receive === 'yes' && feeder.spon_receive === 'yes'){
			 								//place in b
			 									db.query('UPDATE feeder_tree SET b = ? amount = ? WHERE username = ?', [bio.username, 3, feeder.username], function(err, results, fields){
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
														db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, feeder.sponsor, feeder.username, order_id, date], function(err, results, fields){
															if (err) throw err;
															var success = 'You have been assigned to pay someone';
															req.flash('success', success);
															res.redirect('/dashboard')
														});
													});
												});
											});
			 								}else if(feeder.a !== null && feeder.b === null && feeder.receive !== 'yes' && feeder.spon_receive === 'yes'){
			 								//place in b
			 									db.query('UPDATE feeder_tree SET b = ? amount = ? WHERE username = ?', [bio.username, 3, feeder.username], function(err, results, fields){
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
														db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, feeder.sponsor, feeder.username, order_id, date], function(err, results, fields){
															if (err) throw err;
															var success = 'You have been assigned to pay someone';
															req.flash('success', success);
															res.redirect('/dashboard')
														});
													});
												});
											});
			 								}else if(feeder.a !== null && feeder.c === null && feeder.receive === 'yes' && feeder.spon_receive !== 'yes'){
			 								//place in c
			 									db.query('UPDATE feeder_tree SET c = ? amount = ? WHERE username = ?', [bio.username, 3, feeder.username], function(err, results, fields){
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
			 								}else if(feeder.a !== null && feeder.c === null && feeder.b !== null && feeder.receive === 'yes' && feeder.spon_receive === 'yes'){
			 								//place in c
			 									db.query('UPDATE feeder_tree SET c = ? amount = ? WHERE username = ?', [bio.username, 3, feeder.username], function(err, results, fields){
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
			 								}else if(feeder.a !== null && feeder.c === null && feeder.b !== null && feeder.receive === 'yes' && feeder.spon_receive !== 'yes'){
			 								//place in c
			 									db.query('UPDATE feeder_tree SET c = ? amount = ? WHERE username = ?', [bio.username, 2, feeder.username], function(err, results, fields){
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
			 									//check for both
			 									feeder2.feeder(receiver, bio, req, res)
			 								}
			 						}else{
			 							var error = 'Something went wrong';
										req.flash('mergeerror', error);
										res.redirect('/dashboard');
			 						}
			 					}
			 				});
			 			}else{
			 				var feeder = results[0];
			 				if(feederdepth === feeder.depth){
			 					//check for empty a b c
			 					if(feeder.a === null && feeder.receive === 'yes' && feeder.spon_receive === 'yes'){
			 						//place in a 
			 						db.query('UPDATE feeder_tree SET a = ? amount = ? WHERE username = ?', [bio.username, 2, feeder.username], function(err, results, fields){
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
			 					}else if(feeder.a === null && feeder.receive === 'yes' && feeder.spon_receive !== 'yes'){
			 						//inserts in a
			 						db.query('UPDATE feeder_tree SET a = ? amount = ? WHERE username = ?', [bio.username, 2, feeder.username], function(err, results, fields){
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
								}else if(feeder.a !== null && feeder.c === null && feeder.receive === 'yes' && feeder.spon_receive !== 'yes'){
			 						//inserts in c
			 						db.query('UPDATE feeder_tree SET c = ? amount = ? WHERE username = ?', [bio.username, 2, feeder.username], function(err, results, fields){
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
								}else if(feeder.a !== null && feeder.b === null && feeder.receive === 'yes' && feeder.spon_receive === 'yes'){
			 						//inserts in b
			 						db.query('UPDATE feeder_tree SET c = ? amount = ? WHERE username = ?', [bio.username, 2, feeder.username], function(err, results, fields){
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
														db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, feeder.sponsor, feeder.username, order_id, date], function(err, results, fields){
															if (err) throw err;
															var success = 'You have been assigned to pay someone';
															req.flash('success', success);
															res.redirect('/dashboard')
														});
													});
												});
											});
								}else if(feeder.a !== null && feeder.b === null && feeder.receive !== 'yes' && feeder.spon_receive === 'yes'){
			 						//inserts in b
			 						db.query('UPDATE feeder_tree SET b = ? amount = ? WHERE username = ?', [bio.username, 2, feeder.username], function(err, results, fields){
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
														db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, feeder.sponsor, feeder.username, order_id, date], function(err, results, fields){
															if (err) throw err;
															var success = 'You have been assigned to pay someone';
															req.flash('success', success);
															res.redirect('/dashboard')
														});
													});
												});
											});
								}else{
									feeder2.feeder(receiver, bio, req, res)
								}
			 				}else{
			 					//check for 3
			 					db.query('SELECT node.a, node.b, node.c, node.receive, node.sponreceive, node.username,   (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.a, node.b, node.c, node.receive, node.sponreceive, node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE  node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? GROUP BY node.username ORDER BY node.lft) AS sub_tree WHERE (node.receive = ? OR node.sponreceive = ?) node.amount = ? node.status = ? AND node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.username = sub_tree.username GROUP BY node.username HAVING depth > ? ORDER BY depth', [receiver.username, 'yes', 'yes',2, 'confirmed'], function(err, results, fields){
			 						if( err ) throw err;
			 						if(request.length === 0){
			 							//throw error
			 							var error = 'Something went wrong';
										req.flash('mergeerror', error);
										res.redirect('/dashboard');
			 						}else{
			 							//feeder 3 check a b c
			 							var feeder = results[0];
			 							if(feederdepth === feeder.depth){
			 								if(feeder.a === null && feeder.receive === 'yes' && feeder.spon_receive === 'yes'){
			 									//place in a 
			 									db.query('UPDATE feeder_tree SET a = ? amount = ? WHERE username = ?', [bio.username, 3, feeder.username], function(err, results, fields){
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
			 									}else if(feeder.a === null && feeder.receive === 'yes' && feeder.spon_receive !== 'yes'){
			 									//place in a 
			 									db.query('UPDATE feeder_tree SET a = ? amount = ? WHERE username = ?', [bio.username, 3, feeder.username], function(err, results, fields){
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
			 									}else if(feeder.b === null && feeder.receive !== 'yes' && feeder.spon_receive === 'yes'){
			 									//place in b
			 									db.query('UPDATE feeder_tree SET b = ? amount = ? WHERE username = ?', [bio.username, 3, feeder.username], function(err, results, fields){
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
														db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, feeder.sponsor, feeder.username, order_id, date], function(err, results, fields){
															if (err) throw err;
															var success = 'You have been assigned to pay someone';
															req.flash('success', success);
															res.redirect('/dashboard')
														});
													});
												});
											});
			 									}else if(feeder.a !== null && feeder.b === null && feeder.receive === 'yes' && feeder.spon_receive === 'yes'){
			 									//place in b
			 									db.query('UPDATE feeder_tree SET b = ? amount = ? WHERE username = ?', [bio.username, 3, feeder.username], function(err, results, fields){
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
														db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, feeder.sponsor, feeder.username, order_id, date], function(err, results, fields){
															if (err) throw err;
															var success = 'You have been assigned to pay someone';
															req.flash('success', success);
															res.redirect('/dashboard')
														});
													});
												});
											});
			 									}else if(feeder.a !== null && feeder.b === null && feeder.receive !== 'yes' && feeder.spon_receive === 'yes'){
			 									//place in b
			 									db.query('UPDATE feeder_tree SET b = ? amount = ? WHERE username = ?', [bio.username, 3, feeder.username], function(err, results, fields){
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
														db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, feeder.sponsor, feeder.username, order_id, date], function(err, results, fields){
															if (err) throw err;
															var success = 'You have been assigned to pay someone';
															req.flash('success', success);
															res.redirect('/dashboard')
														});
													});
												});
											});
			 									}else if(feeder.a !== null && feeder.c === null && feeder.receive === 'yes' && feeder.spon_receive !== 'yes'){
			 									//place in c
			 									db.query('UPDATE feeder_tree SET c = ? amount = ? WHERE username = ?', [bio.username, 3, feeder.username], function(err, results, fields){
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
			 									}else if(feeder.a !== null && feeder.c === null && feeder.b !== null && feeder.receive === 'yes' && feeder.spon_receive === 'yes'){
			 									//place in c
			 									db.query('UPDATE feeder_tree SET c = ? amount = ? WHERE username = ?', [bio.username, 3, feeder.username], function(err, results, fields){
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
			 									}else if(feeder.a !== null && feeder.c === null && feeder.b !== null && feeder.receive === 'yes' && feeder.spon_receive !== 'yes'){
			 									//place in c
			 									db.query('UPDATE feeder_tree SET c = ? amount = ? WHERE username = ?', [bio.username, 3, feeder.username], function(err, results, fields){
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
			 										//check for both
			 										feeder2.feeder()
			 									}
			 							}else{
			 								var error = 'Something went wrong';
											req.flash('mergeerror', error);
											res.redirect('/dashboard');
			 							}
			 						}
			 					});
			 				}
			 			}
			 		});
			 }
		});
	});
}

/**/