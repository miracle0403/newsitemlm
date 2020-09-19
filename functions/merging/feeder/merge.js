var fillfeeder = require('./fillfeeder');

exports.merge = function (info, currentUser){
	
	db.query('SELECT username, activation FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
		if (err ) throw err;
		var details = results[0];
		
		if (details.activation == 'NO'){
			var error = 'Activate your account first';
			res.redirect('/dashboard/#activate');
		}else{
			db.query('SELECT parent.sponsor, parent.user FROM feeder_tree AS node, feeder_tree AS parent, receive, spon_receive, a, b, c WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.user = ? AND parent.user is not null AND (receive = ? OR spon_receive = ?)  ORDER BY parent.lft', [username, 'yes', 'yes'], function(err, results, fields){
				if( err ) throw err;
				console.log(results)
				if(results.length === 0){
					res.redirect('/dashboard/#merging')
				}else{
					var last = {
						user: results.slice(-1)[0].user,
						sponsor: results.slice(-1)[0].sponsor,
						a: results.slice(-1)[0].a,
						b: results.slice(-1)[0].b,
						c: results.slice(-1)[0].c,
						receive: results.slice(-1)[0].receive,
						spon_receive: results.slice(-1)[0].spon_receive
					}
					if (last.a === null && last.b === null && last.c === null && last.receive === 'yes'  last.spon_receive === 'yes'){
						//insert into a
						db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [details.username, last.user], function(err, results, fields){
							if(err) throw err;
							var purpose = 'matrix'
							db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
								if (err) throw err;
								securePin.generateString (10, charSet, function(str){
								var date = new Date();
								date.setHours( getHours() + 25 );
								var year = date.getFullYear();
								var month = date.getMonth() + 1;
								var day = date.getDate() + 1;
								var order_id = 'fe' + str + year + month + day;
								db.query('CALL placefeeder(?,?,?,?,?)', [details.user, username, details.sponsor, order_id, date], function(err, results, fields){
									if (err) throw err;
									db.query('UPDATE transactions SET purpose = ? WHERE order_id = ? ', [purpose, order_id], function(err, results, fields){
										if (err) throw err;
										res.redirect('dashboard/#merging');
									});
								});
							});
						});
					}
					if (last.a === null && last.b === null && last.c !== null && last.receive === 'yes'  last.spon_receive === 'yes'){
						//insert into a
						db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [details.username, last.user], function(err, results, fields){
							if(err) throw err;
							var purpose = 'matrix'
							db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
								if (err) throw err;
								securePin.generateString (10, charSet, function(str){
								var date = new Date();
								date.setHours( getHours() + 25 );
								var year = date.getFullYear();
								var month = date.getMonth() + 1;
								var day = date.getDate() + 1;
								var order_id = 'fe' + str + year + month + day;
								db.query('CALL placefeeder(?,?,?,?,?)', [details.user, username, details.sponsor, order_id, date], function(err, results, fields){
									if (err) throw err;
									db.query('UPDATE transactions SET purpose = ? WHERE order_id = ? ', [purpose, order_id], function(err, results, fields){
										if (err) throw err;
										res.redirect('dashboard/#merging');
									});
								});
							});
						});
					}
					if (last.a === null && last.b !== null && last.c !== null && last.receive === 'yes'  last.spon_receive === 'yes'){
						//insert into a
						db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [details.username, last.user], function(err, results, fields){
							if(err) throw err;
							var purpose = 'matrix'
							db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
								if (err) throw err;
								securePin.generateString (10, charSet, function(str){
								var date = new Date();
								date.setHours( getHours() + 25 );
								var year = date.getFullYear();
								var month = date.getMonth() + 1;
								var day = date.getDate() + 1;
								var order_id = 'fe' + str + year + month + day;
								db.query('CALL placefeeder(?,?,?,?,?)', [details.user, username, details.sponsor, order_id, date], function(err, results, fields){
									if (err) throw err;
									db.query('UPDATE transactions SET purpose = ? WHERE order_id = ? ', [purpose, order_id], function(err, results, fields){
										if (err) throw err;
										res.redirect('dashboard/#merging');
									});
								});
							});
						});
					}
					if (last.a !== null && last.b === null && last.c === null && last.receive === 'yes'  last.spon_receive === 'yes'){
						//insert into b
						db.query('UPDATE feeder_tree SET b = ? WHERE user = ?', [details.username, last.user], function(err, results, fields){
							if(err) throw err;
							var purpose = 'bonus'
							db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
								if (err) throw err;
								securePin.generateString (10, charSet, function(str){
								var date = new Date();
								date.setHours( getHours() + 25 );
								var year = date.getFullYear();
								var month = date.getMonth() + 1;
								var day = date.getDate() + 1;
								var order_id = 'fe' + str + year + month + day;
								db.query('CALL placefeeder(?,?,?,?,?)', [details.sponsor, username, order_id, date], function(err, results, fields){
									if (err) throw err;
									db.query('UPDATE transactions SET purpose = ? WHERE order_id = ? ', [purpose, order_id], function(err, results, fields){
										if (err) throw err;
										res.redirect('dashboard/#merging');
									});
								});
							});
						});
					}
					if (last.a !== null && last.b !== null && last.c === null && last.receive === 'yes'  last.spon_receive === 'yes'){
						//insert into c
						db.query('UPDATE feeder_tree SET c = ? WHERE user = ?', [details.username, last.user], function(err, results, fields){
							if(err) throw err;
							var purpose = 'matrix'
							db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
								if (err) throw err;
								securePin.generateString (10, charSet, function(str){
								var date = new Date();
								date.setHours( getHours() + 25 );
								var year = date.getFullYear();
								var month = date.getMonth() + 1;
								var day = date.getDate() + 1;
								var order_id = 'fe' + str + year + month + day;
								db.query('CALL placefeeder(?,?,?,?,?)', [details.user, username, details.sponsor, order_id, date], function(err, results, fields){
									if (err) throw err;
									db.query('UPDATE transactions SET purpose = ? WHERE order_id = ? ', [purpose, order_id], function(err, results, fields){
										if (err) throw err;
										res.redirect('dashboard/#merging');
									});
								});
							});
						});
					}
					if (last.a !== null && last.b === null && last.c !== null && last.receive !== 'yes'  last.spon_receive !== 'yes'){
						//spill to the next available user.
					}
					if (last.a === null && last.b === null && last.c === null && last.receive !== 'yes'  last.spon_receive === 'yes'){
						//insert into b
						db.query('UPDATE feeder_tree SET b = ? WHERE user = ?', [details.username, last.user], function(err, results, fields){
							if(err) throw err;
							var purpose = 'bonus'
							db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
								if (err) throw err;
								securePin.generateString (10, charSet, function(str){
								var date = new Date();
								date.setHours( getHours() + 25 );
								var year = date.getFullYear();
								var month = date.getMonth() + 1;
								var day = date.getDate() + 1;
								var order_id = 'fe' + str + year + month + day;
								db.query('CALL placefeeder(?,?,?,?,?)', [details.sponsor, username, order_id, date], function(err, results, fields){
									if (err) throw err;
									db.query('UPDATE transactions SET purpose = ? WHERE order_id = ? ', [purpose, order_id], function(err, results, fields){
										if (err) throw err;
										res.redirect('dashboard/#merging');
									});
								});
							});
						});
					}
					if (last.a !== null && last.b === null && last.c === null && last.receive !== 'yes'  last.spon_receive === 'yes'){
						//insert into b
						db.query('UPDATE feeder_tree SET b = ? WHERE user = ?', [details.username, last.user], function(err, results, fields){
							if(err) throw err;
							var purpose = 'bonus'
							db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
								if (err) throw err;
								securePin.generateString (10, charSet, function(str){
								var date = new Date();
								date.setHours( getHours() + 25 );
								var year = date.getFullYear();
								var month = date.getMonth() + 1;
								var day = date.getDate() + 1;
								var order_id = 'fe' + str + year + month + day;
								db.query('CALL placefeeder(?,?,?,?,?)', [details.sponsor, username, order_id, date], function(err, results, fields){
									if (err) throw err;
									db.query('UPDATE transactions SET purpose = ? WHERE order_id = ? ', [purpose, order_id], function(err, results, fields){
										if (err) throw err;
										res.redirect('dashboard/#merging');
									});
								});
							});
						});
					}
					if (last.a !== null && last.b !== null && last.c === null && last.receive !== 'yes'  last.spon_receive === 'yes'){
						//go to spill
					}
					if (last.a !== null && last.b === null && last.c !== null && last.receive !== 'yes'  last.spon_receive === 'yes'){
						//insert into b
						db.query('UPDATE feeder_tree SET b = ? WHERE user = ?', [details.username, last.user], function(err, results, fields){
							if(err) throw err;
							var purpose = 'bonus'
							db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
								if (err) throw err;
								securePin.generateString (10, charSet, function(str){
								var date = new Date();
								date.setHours( getHours() + 25 );
								var year = date.getFullYear();
								var month = date.getMonth() + 1;
								var day = date.getDate() + 1;
								var order_id = 'fe' + str + year + month + day;
								db.query('CALL placefeeder(?,?,?,?,?)', [details.sponsor, username, order_id, date], function(err, results, fields){
									if (err) throw err;
									db.query('UPDATE transactions SET purpose = ? WHERE order_id = ? ', [purpose, order_id], function(err, results, fields){
										if (err) throw err;
										res.redirect('dashboard/#merging');
									});
								});
							});
						});
					}
					if (last.a !== null && last.b !== null && last.c !== null && last.receive !== 'yes'  last.spon_receive === 'yes'){
						//spill to next user
					}
					if (last.a === null && last.b === null && last.c === null && last.receive === 'yes'  last.spon_receive !== 'yes'){
						//insert into a
						db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [details.username, last.user], function(err, results, fields){
							if(err) throw err;
							var purpose = 'matrix'
							db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
								if (err) throw err;
								securePin.generateString (10, charSet, function(str){
								var date = new Date();
								date.setHours( getHours() + 25 );
								var year = date.getFullYear();
								var month = date.getMonth() + 1;
								var day = date.getDate() + 1;
								var order_id = 'fe' + str + year + month + day;
								db.query('CALL placefeeder(?,?,?,?,?)', [details.user, username, details.sponsor, order_id, date], function(err, results, fields){
									if (err) throw err;
									db.query('UPDATE transactions SET purpose = ? WHERE order_id = ? ', [purpose, order_id], function(err, results, fields){
										if (err) throw err;
										res.redirect('dashboard/#merging');
									});
								});
							});
						});
					}
					if (last.a === null && last.b !== null && last.c === null && last.receive === 'yes'  last.spon_receive !== 'yes'){
						//insert into a
						db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [details.username, last.user], function(err, results, fields){
							if(err) throw err;
							var purpose = 'matrix'
							db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
								if (err) throw err;
								securePin.generateString (10, charSet, function(str){
								var date = new Date();
								date.setHours( getHours() + 25 );
								var year = date.getFullYear();
								var month = date.getMonth() + 1;
								var day = date.getDate() + 1;
								var order_id = 'fe' + str + year + month + day;
								db.query('CALL placefeeder(?,?,?,?,?)', [details.user, username, details.sponsor, order_id, date], function(err, results, fields){
									if (err) throw err;
									db.query('UPDATE transactions SET purpose = ? WHERE order_id = ? ', [purpose, order_id], function(err, results, fields){
										if (err) throw err;
										res.redirect('dashboard/#merging');
									});
								});
							});
						});
					}
					if (last.a === null && last.b === null && last.c !== null && last.receive === 'yes'  last.spon_receive !== 'yes'){
						//insert into a
						db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [details.username, last.user], function(err, results, fields){
							if(err) throw err;
							var purpose = 'matrix'
							db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
								if (err) throw err;
								securePin.generateString (10, charSet, function(str){
								var date = new Date();
								date.setHours( getHours() + 25 );
								var year = date.getFullYear();
								var month = date.getMonth() + 1;
								var day = date.getDate() + 1;
								var order_id = 'fe' + str + year + month + day;
								db.query('CALL placefeeder(?,?,?,?,?)', [details.user, username, details.sponsor, order_id, date], function(err, results, fields){
									if (err) throw err;
									db.query('UPDATE transactions SET purpose = ? WHERE order_id = ? ', [purpose, order_id], function(err, results, fields){
										if (err) throw err;
										res.redirect('dashboard/#merging');
									});
								});
							});
						});
					}
					if (last.a === null && last.b !== null && last.c !== null && last.receive === 'yes'  last.spon_receive !== 'yes'){
						//insert into a
						db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [details.username, last.user], function(err, results, fields){
							if(err) throw err;
							var purpose = 'matrix'
							db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
								if (err) throw err;
								securePin.generateString (10, charSet, function(str){
								var date = new Date();
								date.setHours( getHours() + 25 );
								var year = date.getFullYear();
								var month = date.getMonth() + 1;
								var day = date.getDate() + 1;
								var order_id = 'fe' + str + year + month + day;
								db.query('CALL placefeeder(?,?,?,?,?)', [details.user, username, details.sponsor, order_id, date], function(err, results, fields){
									if (err) throw err;
									db.query('UPDATE transactions SET purpose = ? WHERE order_id = ? ', [purpose, order_id], function(err, results, fields){
										if (err) throw err;
										res.redirect('dashboard/#merging');
									});
								});
							});
						});
					}
					if (last.a == null && last.b === null && last.c === null && last.receive === 'yes'  last.spon_receive !== 'yes'){
						//insert into a
						db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [details.username, last.user], function(err, results, fields){
							if(err) throw err;
							var purpose = 'matrix'
							db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
								if (err) throw err;
								securePin.generateString (10, charSet, function(str){
								var date = new Date();
								date.setHours( getHours() + 25 );
								var year = date.getFullYear();
								var month = date.getMonth() + 1;
								var day = date.getDate() + 1;
								var order_id = 'fe' + str + year + month + day;
								db.query('CALL placefeeder(?,?,?,?,?)', [details.user, username, details.sponsor, order_id, date], function(err, results, fields){
									if (err) throw err;
									db.query('UPDATE transactions SET purpose = ? WHERE order_id = ? ', [purpose, order_id], function(err, results, fields){
										if (err) throw err;
										res.redirect('dashboard/#merging');
									});
								});
							});
						});
					}
					if (last.a != null && last.b !== null && last.c !== null && last.receive === 'yes'  last.spon_receive !== 'yes'){
						//spill to next user
					}
					if (last.a != null && last.b === null && last.c !== null && last.receive === 'yes'  last.spon_receive !== 'yes'){
						//spill to next user
					}
					if (last.a != null && last.b === null && last.c === null && last.receive === 'yes'  last.spon_receive !== 'yes'){
						//insert into c
						db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [details.username, last.user], function(err, results, fields){
							if(err) throw err;
							var purpose = 'matrix'
							db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
								if (err) throw err;
								securePin.generateString (10, charSet, function(str){
								var date = new Date();
								date.setHours( getHours() + 25 );
								var year = date.getFullYear();
								var month = date.getMonth() + 1;
								var day = date.getDate() + 1;
								var order_id = 'fe' + str + year + month + day;
								db.query('CALL placefeeder(?,?,?,?,?)', [details.user, username, details.sponsor, order_id, date], function(err, results, fields){
									if (err) throw err;
									db.query('UPDATE transactions SET purpose = ? WHERE order_id = ? ', [purpose, order_id], function(err, results, fields){
										if (err) throw err;
										res.redirect('dashboard/#merging');
									});
								});
							});
						});
					}
					if (last.a != null && last.b !== null && last.c === null && last.receive === 'yes'  last.spon_receive !== 'yes'){
						//insert into c
						db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [details.username, last.user], function(err, results, fields){
							if(err) throw err;
							var purpose = 'matrix'
							db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
								if (err) throw err;
								securePin.generateString (10, charSet, function(str){
								var date = new Date();
								date.setHours( getHours() + 25 );
								var year = date.getFullYear();
								var month = date.getMonth() + 1;
								var day = date.getDate() + 1;
								var order_id = 'fe' + str + year + month + day;
								db.query('CALL placefeeder(?,?,?,?,?)', [details.user, username, details.sponsor, order_id, date], function(err, results, fields){
									if (err) throw err;
									db.query('UPDATE transactions SET purpose = ? WHERE order_id = ? ', [purpose, order_id], function(err, results, fields){
										if (err) throw err;
										res.redirect('dashboard/#merging');
									});
								});
							});
						});
					}
				}
			});
		}
	});
}