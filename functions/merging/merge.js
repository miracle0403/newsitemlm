var fillfeeder = require('./fillfeeder');

exports.merge = function (details, currentUser){
	
	db.query('SELECT username, activation FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
		if (err ) throw err;
		var details = results[0];
		
		if (details.activation == 'NO'){
			var error = 'Activate your account first';
			res.redirect('/dashboard/#activate');
		}else{
			db.query('SELECT parent.sponsor, parent.user FROM feeder_tree AS node, user_tree AS parent, receive, spon_receive, a, b, c WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.user = ? AND parent.feeder is not null AND (receive = ? OR spon_receive = ?)  ORDER BY parent.lft', [username, 'yes', 'yes'], function(err, results, fields){
				if( err ) throw err;
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
					}
					if (last.a === null && last.b === null && last.c !== null && last.receive === 'yes'  last.spon_receive === 'yes'){
						//insert into a
					}
					if (last.a === null && last.b !== null && last.c !== null && last.receive === 'yes'  last.spon_receive === 'yes'){
						//insert into a
					}
					if (last.a !== null && last.b === null && last.c === null && last.receive === 'yes'  last.spon_receive === 'yes'){
						//insert into b
					}
					if (last.a !== null && last.b !== null && last.c === null && last.receive === 'yes'  last.spon_receive === 'yes'){
						//insert into c
					}
					if (last.a !== null && last.b === null && last.c !== null && last.receive !== 'yes'  last.spon_receive !== 'yes'){
						//spill to the next available user.
					}
					if (last.a === null && last.b === null && last.c === null && last.receive !== 'yes'  last.spon_receive === 'yes'){
						//insert into b
					}
					if (last.a !== null && last.b === null && last.c === null && last.receive !== 'yes'  last.spon_receive === 'yes'){
						//insert into b
					}
					if (last.a !== null && last.b !== null && last.c === null && last.receive !== 'yes'  last.spon_receive === 'yes'){
						//go to spill
					}
					if (last.a !== null && last.b === null && last.c !== null && last.receive !== 'yes'  last.spon_receive === 'yes'){
						//insert into b
					}
					if (last.a !== null && last.b !== null && last.c !== null && last.receive !== 'yes'  last.spon_receive === 'yes'){
						//spill to next user
					}
					if (last.a === null && last.b === null && last.c === null && last.receive === 'yes'  last.spon_receive !== 'yes'){
						//insert into a
					}
					if (last.a === null && last.b !== null && last.c === null && last.receive === 'yes'  last.spon_receive !== 'yes'){
						//insert into a
					}
					if (last.a === null && last.b === null && last.c !== null && last.receive === 'yes'  last.spon_receive !== 'yes'){
						//insert into a
					}
					if (last.a === null && last.b !== null && last.c !== null && last.receive === 'yes'  last.spon_receive !== 'yes'){
						//insert into a
					}
					if (last.a == null && last.b === null && last.c === null && last.receive === 'yes'  last.spon_receive !== 'yes'){
						//insert into a
					}
					if (last.a != null && last.b !== null && last.c !== null && last.receive === 'yes'  last.spon_receive !== 'yes'){
						//spill to next user
					}
					if (last.a != null && last.b === null && last.c !== null && last.receive === 'yes'  last.spon_receive !== 'yes'){
						//spill to next user
					}
					if (last.a != null && last.b === null && last.c === null && last.receive === 'yes'  last.spon_receive !== 'yes'){
						//insert into c
					}
					if (last.a != null && last.b !== null && last.c === null && last.receive === 'yes'  last.spon_receive !== 'yes'){
						//insert into c
					}
				}
			});
		}
	});
}