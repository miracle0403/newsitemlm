exports.activate = function(count, details){
	
	var amount = (count - 4) / 5;
	if (amount is a whole number){
		db.query('SELECT username FROM user WHERE username = ? and verification = ? and activation = ?', [details.sponsor, 'yes', 'yes'], function(err, results, fields){
			if(err) throw err;
			if(results.length === 0){
				db.query('SELECT username, alloted FROM activation ORDER BY alloted DESC', function(err, results, fields){
					if (err) throw err;
					if (results.length === 0){
						res.redirect('/dashboard/#merging');
					}else{
						var receive = results[0];
					db.query('SELECT fullname, phone, bank_name, account_name, account_number FROM user WHERE username = ?' [receive.username], function(err, results, fields){
						if (err) throw err;
						var receiver = results[0];
						db.query('UPDATE activation SET alloted = ? WHERE username = ? ', [receive.alloted - 1, receive.username], function(err, results, fields){
							if (err) throw err;
							if(receive - 1 == 0){
								db.query('DELETE FROM activation WHERE username = ? and alloted = ?', [receive.username, 0], function(err, results, fields){
									if (err) throw err;
									//transactions_pending
									securePin.generateString(15, charSet, function(str){
										var order_id = 'act' + str;
										var date = new Date();
										var dt = new Date();
										date.setHours(date.getHours() + 3);
										db.query('INSERT INTO transactions ( receiver, bank_name, account_name, account_number, giver_number, giver_name, order_id, created_on, expire, purpose) VALUES(?,?,?,?,?,?,?,?,?,?)', [receiver.fullname, receiver.bank_name, receiver.account_name, receiver_account_number, details.phone, details.fullname, order_id, dt, date, 'activation'], function(err, results, fields){
											if (err) throw err;
											var success = 'Successful!';
											res.redirect('/dashboard/#merging');
											});
										});
									});
								}else{
									securePin.generateString(15, charSet, function(str){
										var order_id = 'act' + str;
										var date = new Date();
										var dt = new Date();
										date.setHours(date.getHours() + 3);
										db.query('INSERT INTO pending_transactions ( receiver, bank_name, account_name, account_number, giver_number, giver_name, order_id, created_on, expire) VALUES(?,?,?,?,?,?,?,?,?)', [receiver.fullname, receiver.bank_name, receiver.account_name, receiver_account_number, details.phone, details.fullname, order_id, dt, date], function(err, results, fields){
											if (err) throw err;
											var success = 'Successful!';
											res.redirect('/dashboard/#merging');
											});
										});
								}
							});
						});
					}
				});
			}else{
				db.query('SELECT fullname, phone, bank_name, account_name, account_number FROM user WHERE username = ?' [details.sponsor], function(err, results, fields){
					if (err) throw err;
					var receiver = results[0];
					db.query('UPDATE activation SET alloted = -1 WHERE username = ? ', [receive.username], function(err, results, fields){
						if (err) throw err;
						if(receive - 1 == 0){
								db.query('DELETE FROM activation WHERE username = ? and alloted = ?', [receive.username, 0], function(err, results, fields){
									if (err) throw err;
									//transactions_pending
									securePin.generateString(15, charSet, function(str){
										var order_id = 'act' + str;
										var date = new Date();
										var dt = new Date();
										date.setHours(date.getHours() + 3);
										db.query('INSERT INTO pending_transactions ( receiver, bank_name, account_name, account_number, giver_number, giver_name, order_id, created_on, expire) VALUES(?,?,?,?,?,?,?,?,?)', [receiver.fullname, receiver.bank_name, receiver.account_name, receiver_account_number, details.phone, details.fullname, order_id, dt, date], function(err, results, fields){
											if (err) throw err;
											var success = 'Successful!';
											res.redirect('/dashboard/#merging');
											});
										});
									});
								}else{
									securePin.generateString(15, charSet, function(str){
										var order_id = 'act' + str;
										var date = new Date();
										var dt = new Date();
										date.setHours(date.getHours() + 3);
										db.query('INSERT INTO pending_transactions ( receiver, bank_name, account_name, account_number, giver_number, giver_name, order_id, created_on, expire) VALUES(?,?,?,?,?,?,?,?,?)', [receiver.fullname, receiver.bank_name, receiver.account_name, receiver_account_number, details.phone, details.fullname, order_id, dt, date], function(err, results, fields){
											if (err) throw err;
											var success = 'Successful!';
											res.redirect('/dashboard/#merging');
											});
										});
									}
					});
				});
			}
		})
	}else{	
		db.query('SELECT username, alloted FROM activation ORDER BY alloted DESC', function(err, results, fields){
			if (err) throw err;
			if (results.length === 0){
			res.redirect('/dashboard/#merging');
			}else{
				var receive = results[0];
				db.query('SELECT fullname, phone, bank_name, account_name, account_number FROM user WHERE username = ?' [receive.username], function(err, results, fields){
						if (err) throw err;
						var receiver = results[0];
						db.query('UPDATE activation SET alloted = ? WHERE username = ? ', [receive.alloted - 1, receive.username], function(err, results, fields){
							if (err) throw err;
							if(receive - 1 == 0){
								db.query('DELETE FROM activation WHERE username = ? and alloted = ?', [receive.username, 0], function(err, results, fields){
									if (err) throw err;
									//transactions_pending
									securePin.generateString(15, charSet, function(str){
										var order_id = 'act' + str;
										var date = new Date();
										var dt = new Date();
										date.setHours(date.getHours() + 3);
										db.query('INSERT INTO pending_transactions ( receiver, bank_name, account_name, account_number, giver_number, giver_name, order_id, created_on, expire) VALUES(?,?,?,?,?,?,?,?,?)', [receiver.fullname, receiver.bank_name, receiver.account_name, receiver_account_number, details.phone, details.fullname, order_id, dt, date], function(err, results, fields){
											if (err) throw err;
											var success = 'Successful!';
											res.redirect('/dashboard/#merging');
											});
										});
									});
								}else{
									securePin.generateString(15, charSet, function(str){
										var order_id = 'act' + str;
										var date = new Date();
										var dt = new Date();
										date.setHours(date.getHours() + 3);
										db.query('INSERT INTO pending_transactions ( receiver, bank_name, account_name, account_number, giver_number, giver_name, order_id, created_on, expire) VALUES(?,?,?,?,?,?,?,?,?)', [receiver.fullname, receiver.bank_name, receiver.account_name, receiver_account_number, details.phone, details.fullname, order_id, dt, date], function(err, results, fields){
											if (err) throw err;
											var success = 'Successful!';
											res.redirect('/dashboard/#merging');
											});
										});
								}
							});
						});
					}
				});
			}else{
				db.query('SELECT fullname, phone, bank_name, account_name, account_number FROM user WHERE username = ?' [details.sponsor], function(err, results, fields){
					if (err) throw err;
					var receiver = results[0];
					db.query('UPDATE activation SET alloted = -1 WHERE username = ? ', [receive.username], function(err, results, fields){
						if (err) throw err;
						if(receive - 1 == 0){
								db.query('DELETE FROM activation WHERE username = ? and alloted = ?', [receive.username, 0], function(err, results, fields){
									if (err) throw err;
									//transactions_pending
									securePin.generateString(15, charSet, function(str){
										var order_id = 'act' + str;
										var date = new Date();
										var dt = new Date();
										date.setHours(date.getHours() + 3);
										db.query('INSERT INTO pending_transactions ( receiver, bank_name, account_name, account_number, giver_number, giver_name, order_id, created_on, expire) VALUES(?,?,?,?,?,?,?,?,?)', [receiver.fullname, receiver.bank_name, receiver.account_name, receiver_account_number, details.phone, details.fullname, order_id, dt, date], function(err, results, fields){
											if (err) throw err;
											var success = 'Successful!';
											res.redirect('/dashboard/#merging');
											});
										});
									});
								}else{
									securePin.generateString(15, charSet, function(str){
										var order_id = 'act' + str;
										var date = new Date();
										var dt = new Date();
										date.setHours(date.getHours() + 3);
										db.query('INSERT INTO pending_transactions ( receiver, bank_name, account_name, account_number, giver_number, giver_name, order_id, created_on, expire) VALUES(?,?,?,?,?,?,?,?,?)', [receiver.fullname, receiver.bank_name, receiver.account_name, receiver_account_number, details.phone, details.fullname, order_id, dt, date], function(err, results, fields){
											if (err) throw err;
											var success = 'Successful!';
											res.redirect('/dashboard/#merging');
											});
										});
									}
					});
				});
			}
		});
	}
}