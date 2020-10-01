exports.dashboard = function(currentUser){
	db.query('SELECT username, fullname FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
		if (err) throw err;
		var details = {
			username: results[0].username,
			fullname: results[0].fullname
		};
		//check if activated
		db.query('SELECT activation FROM user WHERE username = ?', [details.username], function(err, results, fields){
			if (err) throw err;
			var activated = results[0].activated;
			if(activated === 'No'){
				var error = 'You have not activated your account. Activated your account now.';
				res.render('dashboard', {mess: 'Dashboard', erroractivate: error, username: details.username, fullname: details.fullname});
			}else{
				//check if gotten money from activation.
				db.query('SELECT COUNT AS activation FROM transactions WHERE purpose = ? AND receiver = ?', ['activation', details.username], function(err, results, fields){
					if (err) throw err;
					var activation = results[0].feeder * 1000;
					//check for feeder
					db.query('SELECT COUNT AS feeder FROM transactions WHERE user = ? AND receiver = ? AND purpose = ?', [details.username, details.username, 'feeder matrix'], function(err, results, fields){
						if (err) throw err;
						var feeder = results[0].feeder * 10000;
						db.query('SELECT COUNT AS feeder FROM transactions WHERE user = ? AND receiver = ? AND purpose = ?', [details.username, details.username, 'feeder matrix'], function(err, results, fields){
							if (err) throw err;
							var feeder_bonus = results[0].feeder_bonus * 10000;
							//check for number of times to enter
							db.query('SELECT required_entrance FROM feeder_tree WHERE user = ?', [details.username], function(err, results, fields){
								if (err) throw err;
								var required_entrance = results[0].required_entrance;
								//check if message
								db.query('SELECT message  FROM messages WHERE user = ?' [details.username], function(err, results, fields){
									if (err) throw err;
									if (results.length === 0){
										//check for giving
										db.query('SELECT *  FROM transactions WHERE user = ? OR receiverusername = ? OR giverusername = ?' [details.username], function(err, results, fields){
											if (err) throw err;
											if (results.length === 0){
												res.render ('dashboard',{
													mess: 'User Dashboard',
													required_entrance: required_entrance,
													feeder: feeder,
													feeder_bonus: feeder_bonus,
													nomerge: 'Keep Refreshing, something will come up soon';
												})
											}else{
												var merge = {
													giver: results
												}
											}
										});
									}else{
										
									}
								});
							});
						});
					});
				});
			}
		});
	});
}