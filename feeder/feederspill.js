var flash = require('express-flash-messages');
//var securePin = require('secure-pin');
var db = require('../db.js');

exports.feederspill = function(bio, req, res, orderId){
	//get the general next user.
	db.query('SELECT node.username, (COUNT(parent.username) - 1 ) AS depth FROM feeder_tree AS node, feeder_tree AS parent, WHERE node.lft BETWEEN parent.lft AND parent.rgt GROUP BY node.username ORDER BY node.lft', function(err, results, fields){
		if(err) throw err;
	});
}


		
		/*db.query('SELECT node.username, (COUNT(parent.username) - (sub_tree.depth + 1)) AS depth FROM feeder_tree AS node, feeder_tree AS parent, feeder_tree AS sub_parent, (SELECT node.username, (COUNT(parent.username) - 1) AS depth FROM feeder_tree AS node, feeder_tree AS parent, WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.username = ? GROUP BY node.username ORDER BY node.lft ) AS sub_tree WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt AND sub_parent.username = sub_tree.username GROUP BY node.username ORDER BY node.lft', [bio.sponsor], function(err, results, fields){
		if(err) throw err;
		console.log(results);
	});*/