exports.feeder2spill = function(){
	
	db.query('SELECT node.user,   (COUNT(parent.user) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.user, (COUNT(parent.user) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.user = ? GROUP BY node.user ORDER BY node.lft) AS sub_tree WHERE node.amount < 3 node.status = ? AND node.receive = ? AND node.sponreceive = ?  AND  node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.user = sub_tree.user GROUP BY node.user HAVING depth > 0 ORDER BY depth', [details.user, 'confirmed', 'yes', 'yes'], function(err, results, fields){
		if( err ) throw err;
		if(results.length === 0){
			res.redirect('/dashboard/#merging');
		}else{
			var second = {
				user: results.[0].user,
				sponsor: results.[0].sponsor,
				a: results.[0].a,
				b: results.[0].b,
				c: results.[0].c,
				receive: results.[0].receive,
				spon_receive: results.[0].spon_receive 
			}
			
			if (second.a === null && second.b === null && second.c === null){
				//place in a
				db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [details.username, second.user], function(err, results, fields){
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
				});
			}
			if (second.a !== null && second.b === null && second.c === null){
				//place in b
				db.query('UPDATE feeder_tree SET b = ? WHERE user = ?', [details.username, second.user], function(err, results, fields){
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
				});
			}
			if (second.a !== null && second.b !== null && second.c === null){
				//place in c
				db.query('UPDATE feeder_tree SET c = ? WHERE user = ?', [details.username, second.user], function(err, results, fields){
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
				});
			}
			if (second.a === null && second.b !== null && second.c === null){
				//place in a
				db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [details.username, second.user], function(err, results, fields){
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
				});
			}
			if (second.a === null && second.b === null && second.c !== null){
				//place in a
				db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [details.username, second.user], function(err, results, fields){
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
				});
			}
			if (second.a === null && second.b !== null && second.c !== null){
				//place in a
				db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [details.username, second.user], function(err, results, fields){
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
				});
			}
			if (second.a !== null && second.b === null && second.c !== null){
				//place in b
				db.query('UPDATE feeder_tree SET b = ? WHERE user = ?', [details.username, second.user], function(err, results, fields){
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
				});
			}
		}
	});
}