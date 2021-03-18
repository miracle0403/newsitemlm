var flash = require('express-flash-messages');
//var securePin = require('secure-pin');
var db = require('../db.js');
var feeder2spill = require('./feeder2spill.js');
var Math = require('mathjs')
exports.feederspill = function(bio, req, res, orderId, date){
	//get the general next user.
	db.query('SELECT node.username, node.a, node.b, node.c, node.amount, node.restricted, node.sponsor, node.requiredEntrance, node.receive, node.sponreceive, node.order_id, (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? GROUP BY node.username ORDER BY node.lft )AS sub_tree WHERE node.amount = 0 and (node.receive = ? or node.sponreceive = ?) and node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.username = sub_tree.username GROUP BY node.username  HAVING depth > 0  ORDER BY depth', [bio.sponsor, 'yes', 'yes'], function(err, results, fields){
		if(err) throw err;
		var receiver = results;
		//console.log(results)
		db.query('SELECT node.username, node.a, node.b, node.c, node.amount, node.restricted, node.sponsor, node.requiredEntrance, node.receive, node.sponreceive, node.order_id, (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? GROUP BY node.username ORDER BY node.lft )AS sub_tree WHERE node.amount = 1 and (node.receive = ? or node.sponreceive = ?) and node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.username = sub_tree.username GROUP BY node.username  HAVING depth > 0  ORDER BY depth', [bio.sponsor, 'yes', 'yes'], function(err, results, fields){
			if(err) throw err;
			var receiver2 = results;
			//check 3
			db.query('SELECT node.username, node.a, node.b, node.c, node.amount, node.restricted, node.sponsor, node.requiredEntrance, node.receive, node.sponreceive, node.order_id, (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? GROUP BY node.username ORDER BY node.lft )AS sub_tree WHERE node.amount = 2 and (node.receive = ? or node.sponreceive = ?) and node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.username = sub_tree.username  GROUP BY node.username  HAVING depth > 0  ORDER BY depth', [bio.sponsor, 'yes', 'yes'], function(err, results, fields){
				if(err) throw err;
				var receiver3 = results;
				if(receiver2.length === 0 && receiver3.length === 0){
					//receiver is the receover
					var receive = receiver[0];
					//console.log('receive is receiver')
					//enter the function
					
					feeder2spill.feeder2spill(bio, receive, req, res, orderId, date);
						
				}else if(receiver2.length > 0 && receiver3.length === 0){
					//receiver is between receiver2 and receiver
					console.log('its here receiver 2', receiver2[0])
					var feederdepth = Math.min(receiver[0].depth, receiver2[0].depth);
					//match the feederdepth with the receiver
					if(feederdepth === receiver[0].depth){
						//start another clear function for the merging here
						var receive = receiver[0];
						onsole.log('its here 1 receiver 2', receiver2)
						console.log('receive is receiver', receiver)
						//enter the function
						
						//feeder2spill.feeder2spill(bio, receive, req, res, orderId, date);
						
						
					}else if(feederdepth === receiver2[0].depth){
						//start another clear function for the merging here
						var receive = receiver2[0];
						//enter the function
						
						feeder2spill.feeder2spill(bio, receive, req, res, orderId, date);
					}
				}else if(receiver2.length === 0 && receiver3.length > 0){
					console.log('its here receiver 3', receiver3[0])
					//receiver is between receiver3 and receiver
					var feederdepth = Math.min(receiver[0].depth, receiver3[0].depth);
					//match the feederdepth with the receiver
					if(feederdepth === receiver[0].depth){
						//start another clear function for the merging here
						var receive = receiver[0];
						console.log('receive is receiver in the second phase')
						//enter the function
						//console.log('its here receiver 3', receiver3[0])
						feeder2spill.feeder2spill(bio, receive, req, res, orderId, date);
						
						
					}else if(feederdepth === receiver3[0].depth){
						//start another clear function for the merging here
						var receive = receiver3[0];
						//console.log('receive is receiver3')
						//enter the function
						
						feeder2spill.feeder2spill(bio, receive, req, res, orderId, date);
						
						
					}
				}else if(receiver2.length > 0 && receiver3.length > 0){
					//get all the min
					var feederdepth = Math.min(receiver[0].depth, receiver[0].depth, receiver2[0].depth);
					if(feederdepth === receiver[0].depth){
						//start another clear function for the merging here
						var receive = receiver[0];
						console.log('receive is receiver in the second phase')
						//enter the function
						
						//feeder2spill.feeder2spill(bio, receive, req, res, orderId, date);
						
						
					}else if(feederdepth === receiver2[0].depth){
						//start another clear function for the merging here
						var receive = receiver2[0];
						console.log('receive is receiver2')
						//enter the function
						
						//feeder2spill.feeder2spill(bio, receive, req, res, orderId, date);
						
						
					}else if(feederdepth === receiver3[0].depth){
						//start another clear function for the merging here
						var receive = receiver3[0];
						//console.log('receive is receiver3')
						//enter the function
						
						feeder2spill.feeder2spill(bio, receive, req, res, orderId, date);
						
						
					}
				}
			});
		});
	});
}


		
		/*db.query('SELECT node.username, (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, (SELECT node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent, WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? GROUP BY node.username ORDER BY node.lft ) AS sub_tree WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.username = sub_tree.username GROUP BY node.username ORDER BY node.lft', [bio.sponsor], function(err, results, fields){
		if(err) throw err;
		console.log(results);
	});
	//if all are numbers, get the least number
				if(typeof(receiver.depth) === 'number' && typeof(receiver2.depth) === 'number' && typeof(receiver3.depth) === 'number'){
					//get the least number
					console.log('receiver1')
				}else if(typeof(receiver.depth) === 'number' && typeof(receiver2.depth) !== 'number' && typeof(receiver3.depth) === 'number'){
					//get the least number between receiver and receiver3
					console.log('receiver2')
				}else if(typeof(receiver.depth) === 'number' && typeof(receiver2.depth) === 'number' && typeof(receiver3.depth) !== 'number'){
					//get the least number between receiver and receiver2
					console.log('receiver3')
				}	
	SELECT node.name, (COUNT(parent.name) - (sub_tree.depth + 1)) AS depth FROM nested_category AS node, nested_category AS parent, nested_category AS sub_parent, ( SELECT node.name, (COUNT(parent.name) - 1) AS depth FROM nested_category AS node, nested_category AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.name = 'PORTABLE ELECTRONICS' GROUP BY node.name ORDER BY node.lft )AS sub_tree WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.name = sub_tree.name GROUP BY node.name ORDER BY node.lft
	
	
	db.query('SELECT node.username, node.sponsor, node.requiredEntrance, node.receive, node.sponreceive, node.order_id, (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? GROUP BY node.username ORDER BY node.lft )AS sub_tree WHERE node.amount = 0 and (node.receive = ? or node.sponreceive = ?) and node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.username = sub_tree.username GROUP BY node.username  HAVING depth > 0  ORDER BY depth', [bio.sponsor, 'yes', 'yes'], function(err, results, fields){
		if(err) throw err;
		var receiver = results[0];
		console.log(results)
		db.query('SELECT node.username,  node.sponsor, node.requiredEntrance, node.receive, node.sponreceive, node.order_id, (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? GROUP BY node.username ORDER BY node.lft )AS sub_tree WHERE node.amount = 1 and (node.receive = ? or node.sponreceive = ?) and node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.username = sub_tree.username GROUP BY node.username  HAVING depth > 0  ORDER BY depth', [bio.sponsor, 'yes', 'yes'], function(err, results, fields){
			if(err) throw err;
			console.log(results)
			if(results.length === 0){
				//check 3
				db.query('SELECT node.username, node.sponsor, node.requiredEntrance, node.receive, node.sponreceive, node.order_id, (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? GROUP BY node.username ORDER BY node.lft )AS sub_tree WHERE node.amount = 2 and (node.receive = ? or node.sponreceive = ?) and node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.username = sub_tree.username  GROUP BY node.username  HAVING depth > 0  ORDER BY depth', [bio.sponsor, 'yes', 'yes'], function(err, results, fields){
					if(err) throw err;
					if(results.length > 0){
						var receiver3 = results[0];
						console.log(results)
					
					}
					
				});
			}else{
				var receiver2 = results[0];
				//check for 3
				db.query('SELECT node.username, node.sponsor, node.requiredEntrance, node.receive, node.sponreceive, node.order_id, (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, ( SELECT node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? GROUP BY node.username ORDER BY node.lft )AS sub_tree WHERE node.amount = 2 and (node.receive = ? or node.sponreceive = ?) and node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.username = sub_tree.username  GROUP BY node.username  HAVING depth > 0  ORDER BY depth', [bio.sponsor, 'yes', 'yes'], function(err, results, fields){
					if(err) throw err;
					if(results.length > 0){
						var receiver3 = results[0];
						console.log(results)
					
					}
				});
			}
		});
	})
	*/