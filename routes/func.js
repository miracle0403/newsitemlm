var db = require('../db.js');
exports.timer = function(now, distance){
	var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
 return days + ' days ' + hours + ' hours ' + ' minutes ' + minutes + ' seconds ';
}

exports.actimer = function(){
	db.query( 'SELECT * FROM transactions', function ( err, results, fields ){
		if (err) throw err;
		
		var trans = results;
		var now = new Date()
		for(var i = 0; i < trans.length; i++){ 
			
			var cd = results[i].expire;
			var countDown = cd
			var receiver = trans[i].receiver_username;
			
			//var distance = countDown - now;
			console.log(now, cd, now > cd)
			
			if(now >= cd){
 				db.query('UPDATE transactions SET status = ? WHERE expire = ?', ['Not Paid', cd], function(err, results, fields){
 					if (err) throw err;
 					db.query('UPDATE activation SET alloted = alloted + 1 WHERE username = ?', [receiver], function(err, results, fields){
 						if (err) throw err;
 					});
 				});
 			}
		}
	});
}

exports.spamActi = function(currentUser, req, res){
	db.query( 'SELECT COUNT(payer_username) AS count FROM transactions WHERE status = ? AND payer_username = ?', ['Not Paid', currentUser ],function ( err, results, fields ){
		if (err) throw err;
		var count = results[0].count;
		db.query( 'SELECT payer_username FROM transactions WHERE (status = ? OR status = ? OR status = ? OR status = ?) AND payer_username = ?',	['confirmed', 'pending', 'unconfirmed', 'in contest', currentUser ],function ( err, results, fields ){
			if (err) throw err;
			if (results.length === 0 && count >= 3){
				var error = 'You have been banned for spam';
				req.flash('mergeerror', error);
				res.redirect('/dashboard/#mergeerror');;
			}
		});
	});
}