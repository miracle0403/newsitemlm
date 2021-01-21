var flash = require('express-flash-messages');
var securePin = require('secure-pin');
var db = require('../db.js');
var charSet = new securePin.CharSet();
charSet.addLowerCaseAlpha().addUpperCaseAlpha().addNumeric().randomize();

exports.feederspill = function(receive, bio, req, res){
	db.query('SELECT node.username, node.amount,  (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM  feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? and (node.receive = ? or node.sponreceive = ?) GROUP BY node.username ORDER BY node.lft) AS sub_tree WHERE node.amount < 3 AND node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.username = sub_tree.username GROUP BY node.username HAVING depth > 0 ORDER BY depth', [receive.username, 'yes', 'yes'], function(err, results, fields){
		if( err ) throw err;
		var feederdepth = results[0].depth;
		console.log(feederdepth);
		db.query('SELECT node.username, node.amount, node.a, node.b, node.c, node.requiredEntrance, node.receive, node.sponreceive, node.order_id, node.sponsor, (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM  feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? and (node.receive = ? or node.sponreceive = ?) GROUP BY node.username ORDER BY node.lft) AS sub_tree WHERE node.amount = 0 AND node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.username = sub_tree.username GROUP BY node.username HAVING depth > 0 ORDER BY depth', [receive.username, 'yes', 'yes'], function(err, results, fields){
			if( err ) throw err;
			var receiver = results[0];
			console.log(receiver);
			if(feederdepth === receiver.depth){
				console.log('ok')
				//check for a b or c
				securePin.generateString (10, charSet, function(str){
					var date = new Date();
					date.setHours(date.getHours() + 3);
					var year = date.getFullYear();
					var month = date.getMonth() + 1;
					var day = date.getDate() + 1;
					var order_id = 'fe' + str + year + month + day;
					
					if(receiver.a === null && receiver.receive === 'yes'){
						//fill a
						console.log('a')
						db.query('UPDATE feeder_tree SET a = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
							if(err) throw err;
							var purpose = 'feeder_matrix';
							db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, receiver.order_id], function(err, results, fields){
								if (err) throw err;
								db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.username, receiver.username, order_id, date], function(err, results, fields){
									if (err) throw err;
									db.query('UPDATE transactions SET receiving_order = ? WHERE order_id = ?', [receiver.order_id, order_id], function(err, results, fields){
										if (err) throw err;
										var success = 'You have been assigned to pay someone';
										req.flash('success', success);
										res.redirect('/dashboard')
									});
								});
							});
						});
					}else if(receiver.b === null && receiver.sponreceive === 'yes' && receive !== 'yes'){
						console.log('b')
						db.query('UPDATE feeder_tree SET b = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
							if(err) throw err;
							var purpose = 'feeder_bonus';
							db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, receiver.order_id], function(err, results, fields){
								if (err) throw err;
								db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.sponsor, receiver.username, order_id, date], function(err, results, fields){
									if (err) throw err;
									db.query('UPDATE transactions SET receiving_order = ? WHERE order_id = ?', [receiver.order_id, order_id], function(err, results, fields){
										if (err) throw err;
										var success = 'You have been assigned to pay someone';
										req.flash('success', success);
										res.redirect('/dashboard')
									});
								});
							});
						});
					}else {
						//put in c
						db.query('SELECT * FROM feeder_tree WHERE c is null and receive = ?', ['yes'], function(err, results, fields){
							if( err ) throw err;
							var receiver = results[0];
							console.log(receiver);
							console.log('okc')
							//check for a b or c
							securePin.generateString (10, charSet, function(str){
								var date = new Date();
								date.setHours(date.getHours() + 3);
								var year = date.getFullYear();
								var month = date.getMonth() + 1;
								var day = date.getDate() + 1;
								var order_id = 'fe' + str + year + month + day;
								db.query('UPDATE feeder_tree SET c = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
									if(err) throw err;
									var purpose = 'feeder_matrix';
									db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, receiver.order_id], function(err, results, fields){
										if (err) throw err;
										db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.username, receiver.username, order_id, date], function(err, results, fields){
											if (err) throw err;
											db.query('UPDATE transactions SET receiving_order = ? WHERE order_id = ?', [receiver.order_id, order_id], function(err, results, fields){
												if (err) throw err;
												var success = 'You have been assigned to pay someone';
												req.flash('success', success);
												res.redirect('/dashboard')
											});
										});
									});
								});
							});							
						});
					}
				});
			}else {
				//check for 2
				db.query('SELECT node.username, node.amount, node.a, node.b, node.c, node.requiredEntrance, node.receive, node.sponreceive, node.order_id, node.sponsor, (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM  feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? and (node.receive = ? or node.sponreceive = ?) GROUP BY node.username ORDER BY node.lft) AS sub_tree WHERE node.amount = 1 AND node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.username = sub_tree.username GROUP BY node.username HAVING depth > 0 ORDER BY depth', [receive.username, 'yes', 'yes'], function(err, results, fields){
					if( err ) throw err;
					var receiver = results[0];
					console.log(receiver);
					if(feederdepth === receiver.depth){
						console.log('ok2')
						//check for a b or c
						securePin.generateString (10, charSet, function(str){
							var date = new Date();
							date.setHours(date.getHours() + 3);
							var year = date.getFullYear();
							var month = date.getMonth() + 1;
							var day = date.getDate() + 1;
							var order_id = 'fe' + str + year + month + day;
							
							if(receiver.a === null && receiver.receive === 'yes'){
								//fill a
								console.log('a')
								db.query('UPDATE feeder_tree SET a = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
									if(err) throw err;
									var purpose = 'feeder_matrix';
									db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, receiver.order_id], function(err, results, fields){
										if (err) throw err;
										db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.username, receiver.username, order_id, date], function(err, results, fields){
											if (err) throw err;
											db.query('UPDATE transactions SET receiving_order = ? WHERE order_id = ?', [receiver.order_id, order_id], function(err, results, fields){
												if (err) throw err;
												var success = 'You have been assigned to pay someone';
												req.flash('success', success);
												res.redirect('/dashboard')
											});
										});
									});
								});
							}else if(receiver.b === null && receiver.sponreceive === 'yes' && receive !== 'yes'){
								console.log('b')
								db.query('UPDATE feeder_tree SET b = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
									if(err) throw err;
									var purpose = 'feeder_bonus';
									db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, receiver.order_id], function(err, results, fields){
										if (err) throw err;
										db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.sponsor, receiver.username, order_id, date], function(err, results, fields){
											if (err) throw err;
											db.query('UPDATE transactions SET receiving_order = ? WHERE order_id = ?', [receiver.order_id, order_id], function(err, results, fields){
												if (err) throw err;
												var success = 'You have been assigned to pay someone';
												req.flash('success', success);
												res.redirect('/dashboard')
											});
										});
									});
								});
							} else if(receiver.a !== null && receiver.b === null && receiver.sponreceive === 'yes' ){
								console.log('b')
								db.query('UPDATE feeder_tree SET b = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
									if(err) throw err;
									var purpose = 'feeder_bonus';
									db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, receiver.order_id], function(err, results, fields){
										if (err) throw err;
										db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.sponsor, receiver.username, order_id, date], function(err, results, fields){
											if (err) throw err;
											db.query('UPDATE transactions SET receiving_order = ? WHERE order_id = ?', [receiver.order_id, order_id], function(err, results, fields){
												if (err) throw err;
												var success = 'You have been assigned to pay someone';
												req.flash('success', success);
												res.redirect('/dashboard')
											});
										});
									});
								});
							}else if (receiver.a !== null && receiver.c === null && receiver.receive !== 'yes' && receive !== 'yes'){
								//fill c
								console.log('c')
								db.query('UPDATE feeder_tree SET c = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
									if(err) throw err;
									var purpose = 'feeder_matrix';
									db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, receiver.order_id], function(err, results, fields){
										if (err) throw err;
										db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.username, receiver.username, order_id, date], function(err, results, fields){
											if (err) throw err;
											db.query('UPDATE transactions SET receiving_order = ? WHERE order_id = ?', [receiver.order_id, order_id], function(err, results, fields){
												if (err) throw err;
												var success = 'You have been assigned to pay someone';
												req.flash('success', success);
												res.redirect('/dashboard')
											});
										});
									});
								});
							}else{
								//put in c
								db.query('SELECT * FROM feeder_tree WHERE c is null and receive = ?', ['yes'], function(err, results, fields){
									if( err ) throw err;
									var receiver = results[0];
									console.log(receiver);
									console.log('okc')
									//check for a b or c
									securePin.generateString (10, charSet, function(str){
										var date = new Date();
										date.setHours(date.getHours() + 3);
										var year = date.getFullYear();
										var month = date.getMonth() + 1;
										var day = date.getDate() + 1;
										var order_id = 'fe' + str + year + month + day;
										db.query('UPDATE feeder_tree SET c = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
											if(err) throw err;
											var purpose = 'feeder_matrix';
											db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, receiver.order_id], function(err, results, fields){
												if (err) throw err;
												db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.username, receiver.username, order_id, date], function(err, results, fields){
													if (err) throw err;
													db.query('UPDATE transactions SET receiving_order = ? WHERE order_id = ?', [receiver.order_id, order_id], function(err, results, fields){
														if (err) throw err;
														var success = 'You have been assigned to pay someone';
														req.flash('success', success);
														res.redirect('/dashboard')
													});
												});
											});
										});
									});							
								});
							}
						});
					}else{
						//check for 3
						db.query('SELECT node.username, node.amount, node.a, node.b, node.c, node.requiredEntrance, node.receive, node.sponreceive, node.order_id, node.sponsor, (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM  feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? and (node.receive = ? or node.sponreceive = ?) GROUP BY node.username ORDER BY node.lft) AS sub_tree WHERE node.amount = 1 AND node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.username = sub_tree.username GROUP BY node.username HAVING depth > 0 ORDER BY depth', [receive.username, 'yes', 'yes'], function(err, results, fields){
							if( err ) throw err;
							var receiver = results[0];
							console.log(receiver);
							if(feederdepth === receiver.depth){
								console.log('ok3')
								//check for a b or c
								securePin.generateString (10, charSet, function(str){
									var date = new Date();
									date.setHours(date.getHours() + 3);
									var year = date.getFullYear();
									var month = date.getMonth() + 1;
									var day = date.getDate() + 1;
									var order_id = 'fe' + str + year + month + day;
									
									if(receiver.a === null && receiver.receive === 'yes'){
										//fill a
										console.log('a')
										db.query('UPDATE feeder_tree SET a = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
											if(err) throw err;
											var purpose = 'feeder_matrix';
											db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, receiver.order_id], function(err, results, fields){
												if (err) throw err;
												db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.username, receiver.username, order_id, date], function(err, results, fields){
													if (err) throw err;
													db.query('UPDATE transactions SET receiving_order = ? WHERE order_id = ?', [receiver.order_id, order_id], function(err, results, fields){
														if (err) throw err;
														var success = 'You have been assigned to pay someone';
														req.flash('success', success);
														res.redirect('/dashboard')
													});
												});
											});
										});
									}else if(receiver.b === null && receiver.sponreceive === 'yes' && receive !== 'yes'){
										console.log('b')
										db.query('UPDATE feeder_tree SET b = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
											if(err) throw err;
											var purpose = 'feeder_bonus';
											db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, receiver.order_id], function(err, results, fields){
												if (err) throw err;
												db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.sponsor, receiver.username, order_id, date], function(err, results, fields){
													if (err) throw err;
													db.query('UPDATE transactions SET receiving_order = ? WHERE order_id = ?', [receiver.order_id, order_id], function(err, results, fields){
														if (err) throw err;
														var success = 'You have been assigned to pay someone';
														req.flash('success', success);
														res.redirect('/dashboard')
													});
												});
											});
										});
									} else if(receiver.a !== null && receiver.b === null && receiver.sponreceive === 'yes' ){
										console.log('b')
										db.query('UPDATE feeder_tree SET b = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
											if(err) throw err;
											var purpose = 'feeder_bonus';
											db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, receiver.order_id], function(err, results, fields){
												if (err) throw err;
												db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.sponsor, receiver.username, order_id, date], function(err, results, fields){
													if (err) throw err;
													db.query('UPDATE transactions SET receiving_order = ? WHERE order_id = ?', [receiver.order_id, order_id], function(err, results, fields){
														if (err) throw err;
														var success = 'You have been assigned to pay someone';
														req.flash('success', success);
														res.redirect('/dashboard')
													});
												});
											});
										});
									}else if (receiver.a !== null && receiver.c === null && receiver.receive !== 'yes' && receive !== 'yes'){
										//fill c
										console.log('c')
										db.query('UPDATE feeder_tree SET c = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
											if(err) throw err;
											var purpose = 'feeder_matrix';
											db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, receiver.order_id], function(err, results, fields){
												if (err) throw err;
												db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.username, receiver.username, order_id, date], function(err, results, fields){
													if (err) throw err;
													db.query('UPDATE transactions SET receiving_order = ? WHERE order_id = ?', [receiver.order_id, order_id], function(err, results, fields){
														if (err) throw err;
														var success = 'You have been assigned to pay someone';
														req.flash('success', success);
														res.redirect('/dashboard')
													});
												});
											});
										});
									}else if (receiver.a !== null && receiver.c === null && receiver.b !== null && receive !== 'yes'){
										//fill c
										console.log('c')
										db.query('UPDATE feeder_tree SET c = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
											if(err) throw err;
											var purpose = 'feeder_matrix';
											db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, receiver.order_id], function(err, results, fields){
												if (err) throw err;
												db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.username, receiver.username, order_id, date], function(err, results, fields){
													if (err) throw err;
													db.query('UPDATE transactions SET receiving_order = ? WHERE order_id = ?', [receiver.order_id, order_id], function(err, results, fields){
														if (err) throw err;
														var success = 'You have been assigned to pay someone';
														req.flash('success', success);
														res.redirect('/dashboard')
													});
												});
											});
										});
									}else{
										//put in c
										db.query('SELECT * FROM feeder_tree WHERE c is null and receive = ?', ['yes'], function(err, results, fields){
											if( err ) throw err;
											var receiver = results[0];
											console.log(receiver);
											console.log('okc')
											//check for a b or c
											securePin.generateString (10, charSet, function(str){
												var date = new Date();
												date.setHours(date.getHours() + 3);
												var year = date.getFullYear();
												var month = date.getMonth() + 1;
												var day = date.getDate() + 1;
												var order_id = 'fe' + str + year + month + day;
												db.query('UPDATE feeder_tree SET c = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
													if(err) throw err;
													var purpose = 'feeder_matrix';
													db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, receiver.order_id], function(err, results, fields){
														if (err) throw err;
														db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.username, receiver.username, order_id, date], function(err, results, fields){
															if (err) throw err;
															db.query('UPDATE transactions SET receiving_order = ? WHERE order_id = ?', [receiver.order_id, order_id], function(err, results, fields){
																if (err) throw err;
																var success = 'You have been assigned to pay someone';
																req.flash('success', success);
																res.redirect('/dashboard')
															});
														});
													});
												});
											});							
										});
									}
								});
							}else{
								//put in c
								db.query('SELECT * FROM feeder_tree WHERE c is null and receive = ?', ['yes'], function(err, results, fields){
									if( err ) throw err;
									var receiver = results[0];
									console.log(receiver);
									console.log('okc')
									//check for a b or c
									securePin.generateString (10, charSet, function(str){
										var date = new Date();
										date.setHours(date.getHours() + 3);
										var year = date.getFullYear();
										var month = date.getMonth() + 1;
										var day = date.getDate() + 1;
										var order_id = 'fe' + str + year + month + day;
										db.query('UPDATE feeder_tree SET c = ?, amount = ? WHERE order_id = ?', [bio.username, receiver.amount + 1, receiver.order_id], function(err, results, fields){
											if(err) throw err;
											var purpose = 'feeder_matrix';
											db.query('CALL leafadd(?,?,?,?)', [receiver.username, order_id, bio.username, receiver.order_id], function(err, results, fields){
												if (err) throw err;
												db.query('CALL placefeeder(?,?,?,?,?,?)', [bio.username, purpose, receiver.username, receiver.username, order_id, date], function(err, results, fields){
													if (err) throw err;
													db.query('UPDATE transactions SET receiving_order = ? WHERE order_id = ?', [receiver.order_id, order_id], function(err, results, fields){
														if (err) throw err;
														var success = 'You have been assigned to pay someone';
														req.flash('success', success);
														res.redirect('/dashboard')
													});
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
}