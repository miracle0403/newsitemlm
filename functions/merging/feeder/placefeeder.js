exports.feederspill = function(){
	
	db.query('SELECT node.user,   (COUNT(parent.user) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.user, (COUNT(parent.user) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.user = ? GROUP BY node.user ORDER BY node.lft) AS sub_tree WHERE node.amount < 3 node.status = ? AND (node.receive = ? OR node.sponreceive = ? ) AND  node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.user = sub_tree.user GROUP BY node.user HAVING depth > 0 ORDER BY depth', [details.user, 'confirmed', 'yes', 'yes'], function(err, results, fields){
		if( err ) throw err;
		if(results.length === 0){
			res.redirect('/dashboard/#merging');
		}else{
			var first = {
				user: results.[0].user,
				sponsor: results.[0].sponsor,
				a: results.[0].a,
				b: results.[0].b,
				c: results.[0].c,
				receive: results.[0].receive,
				spon_receive: results.[0].spon_receive 
			}
			if (first.a === null && first.b === null && first.c === null && first.receive === 'yes'  first.spon_receive === 'yes'){
				//place in a
				db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [details.username, first.user], function(err, results, fields){
					if(err) throw err;
					var purpose = 'matrix'
					db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
						if (err) throw err;
						securePin.generateString (10, charSet, function(str){
							var date = new Date();
							date.setHours(date.getHours() + 3);							var year = date.getFullYear();
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
			if (first.a !== null && first.b === null && first.c === null && first.receive === 'yes'  first.spon_receive === 'yes'){
				//place in b
				db.query('UPDATE feeder_tree SET b = ? WHERE user = ?', [details.username, first.user], function(err, results, fields){
					if(err) throw err;
					var purpose = 'matrix'
					db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
						if (err) throw err;
						securePin.generateString (10, charSet, function(str){
							var date = new Date();
							date.setHours(date.getHours() + 3);							var year = date.getFullYear();
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
			if (first.a !== null && first.b !== null && first.c === null && first.receive === 'yes'  first.spon_receive === 'yes'){
				//place in c
				db.query('UPDATE feeder_tree SET c = ? WHERE user = ?', [details.username, first.user], function(err, results, fields){
					if(err) throw err;
					var purpose = 'matrix'
					db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
						if (err) throw err;
						securePin.generateString (10, charSet, function(str){
							var date = new Date();
							date.setHours(date.getHours() + 3);							var year = date.getFullYear();
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
			if (first.a === null && first.b !== null && first.c === null && first.receive === 'yes'  first.spon_receive === 'yes'){
				//place in a
				db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [details.username, first.user], function(err, results, fields){
					if(err) throw err;
					var purpose = 'matrix'
					db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
						if (err) throw err;
						securePin.generateString (10, charSet, function(str){
							var date = new Date();
							date.setHours(date.getHours() + 3);							var year = date.getFullYear();
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
			if (first.a === null && first.b !== null && first.c !== null && first.receive === 'yes'  first.spon_receive === 'yes'){
				//place in a
				db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [details.username, first.user], function(err, results, fields){
					if(err) throw err;
					var purpose = 'matrix'
					db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
						if (err) throw err;
						securePin.generateString (10, charSet, function(str){
							var date = new Date();
							date.setHours(date.getHours() + 3);							var year = date.getFullYear();
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
			if (first.a === null && first.b === null && first.c !== null && first.receive === 'yes'  first.spon_receive === 'yes'){
				//place in a
				db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [details.username, first.user], function(err, results, fields){
					if(err) throw err;
					var purpose = 'matrix'
					db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
						if (err) throw err;
						securePin.generateString (10, charSet, function(str){
							var date = new Date();
							date.setHours(date.getHours() + 3);							var year = date.getFullYear();
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
			if (first.a !== null && first.b === null && first.c !== null && first.receive === 'yes'  first.spon_receive === 'yes'){
				//place in b
				db.query('UPDATE feeder_tree SET b = ? WHERE user = ?', [details.username, first.user], function(err, results, fields){
					if(err) throw err;
					var purpose = 'matrix'
					db.query('CALL leafadd(?,?,?)', [details.sponsor, first.user, username], function(err, results, fields){
						if (err) throw err;
						securePin.generateString (10, charSet, function(str){
							var date = new Date();
							date.setHours(date.getHours() + 3);							var year = date.getFullYear();
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
			if (first.a === null && first.b === null && first.c === null && first.receive !== 'yes'  first.spon_receive === 'yes'){
				//place in b
				db.query('UPDATE feeder_tree SET b = ? WHERE user = ?', [details.username, first.user], function(err, results, fields){
					if(err) throw err;
					var purpose = 'matrix'
					db.query('CALL leafadd(?,?,?)', [details.sponsor, first.user, username], function(err, results, fields){
						if (err) throw err;
						securePin.generateString (10, charSet, function(str){
							var date = new Date();
							date.setHours(date.getHours() + 3);							var year = date.getFullYear();
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
			if (first.a !== null && first.b === null && first.c !== null && first.receive !== 'yes'  first.spon_receive === 'yes'){
				//place in b
				db.query('UPDATE feeder_tree SET b = ? WHERE user = ?', [details.username, first.user], function(err, results, fields){
					if(err) throw err;
					var purpose = 'matrix'
					db.query('CALL leafadd(?,?,?)', [details.sponsor, first.user, username], function(err, results, fields){
						if (err) throw err;
						securePin.generateString (10, charSet, function(str){
							var date = new Date();
							date.setHours(date.getHours() + 3);							var year = date.getFullYear();
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
			if (first.a === null && first.b === null && first.c !== null && first.receive !== 'yes'  first.spon_receive === 'yes'){
				//place in b
				db.query('UPDATE feeder_tree SET b = ? WHERE user = ?', [details.username, first.user], function(err, results, fields){
					if(err) throw err;
					var purpose = 'matrix'
					db.query('CALL leafadd(?,?,?)', [details.sponsor, first.user, username], function(err, results, fields){
						if (err) throw err;
						securePin.generateString (10, charSet, function(str){
							var date = new Date();
							date.setHours(date.getHours() + 3);							var year = date.getFullYear();
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
			if (first.a === null && first.b !== null && first.c === null && first.receive !== 'yes'  first.spon_receive === 'yes'){
				//spill it over to one with the  highest number of downlines and can receive from both sides.,a
				
				fill.feeder2spill()
			}
			if (first.a === null && first.b === null && first.c === null && first.receive === 'yes'  first.spon_receive !== 'yes'){
				//place in a
				db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [details.username, first.user], function(err, results, fields){
					if(err) throw err;
					var purpose = 'matrix'
					db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
						if (err) throw err;
						securePin.generateString (10, charSet, function(str){
							var date = new Date();
							date.setHours(date.getHours() + 3);							var year = date.getFullYear();
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
			if (first.a !== null && first.b === null && first.c === null && first.receive === 'yes'  first.spon_receive !== 'yes'){
				//place in c
				db.query('UPDATE feeder_tree SET c = ? WHERE user = ?', [details.username, first.user], function(err, results, fields){
					if(err) throw err;
					var purpose = 'matrix'
					db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
						if (err) throw err;
						securePin.generateString (10, charSet, function(str){
							var date = new Date();
							date.setHours(date.getHours() + 3);							var year = date.getFullYear();
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
			if (first.a === null && first.b === null && first.c !== null && first.receive === 'yes'  first.spon_receive !== 'yes'){
				//place in a
				db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [details.username, first.user], function(err, results, fields){
					if(err) throw err;
					var purpose = 'matrix'
					db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
						if (err) throw err;
						securePin.generateString (10, charSet, function(str){
							var date = new Date();
							date.setHours(date.getHours() + 3);							var year = date.getFullYear();
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
			if (first.a !== null && first.b === null && first.c !== null && first.receive === 'yes'  first.spon_receive !== 'yes'){
				//spillover
				fill.feeder2spill()
			}
			if (first.a !== null && first.b === null && first.c === null && first.receive === 'yes'  first.spon_receive !== 'yes'){
				//place in c
				db.query('UPDATE feeder_tree SET c = ? WHERE user = ?', [details.username, first.user], function(err, results, fields){
					if(err) throw err;
					var purpose = 'matrix'
					db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
						if (err) throw err;
						securePin.generateString (10, charSet, function(str){
							var date = new Date();
							date.setHours(date.getHours() + 3);							var year = date.getFullYear();
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
			if (first.a !== null && first.b !== null && first.c !== null && first.receive === 'yes'  first.spon_receive !== 'yes'){
				//place in a
				db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [details.username, first.user], function(err, results, fields){
					if(err) throw err;
					var purpose = 'matrix'
					db.query('CALL leafadd(?,?,?)', [details.sponsor, details.user, username], function(err, results, fields){
						if (err) throw err;
						securePin.generateString (10, charSet, function(str){
							var date = new Date();
							date.setHours(date.getHours() + 3);							var year = date.getFullYear();
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