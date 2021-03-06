var db = require('../db');

/*
delete from feeder_tree;
insert into feeder_tree (sponsor, username, lft, rgt, requiredEntrance, status, receive, sponreceive, order_id) values('fgdgfgcssyvx', 'fgfghbhufdx', 1, 2, -6, 'confirmed', 'yes', 'yes', '4f4yxs5gx5td');//
insert into user (sponsor, full_name, phone, username, bank_name, account_name, account_number, password, status, verification, activated, email) VALUES ('fgdgfgcssyvx', 'fgggg gkgg', 0987654321, 'fgfghbhufdx', 'diamond', 'hjgjgh ghvhhhh', 1234567890, 'vjdty5856cseAfx45ghvcjdhv', 'paid', 'No', 'No', 'vjb@th.co');
insert into user_tree (sponsor, username, lft, rgt, status, feeder) VALUES ('fgdgfgcssyvx', 'fgfghbhufdx', 1,2, 'paid', 'yes');
update feeder_tree set requiredEntrance = 1, status = 'confirmed' where username = 'Miracle0403';//
update user_tree set feeder = 'yes', status = 'paid' where username = 'Miracle0403';//

update user set  status = 'paid' where username = 'Miracle0403';//
*/

CREATE TABLE `mainleg` (
	`username` VARCHAR(255) NOT NULL
);
	
CREATE TABLE `user` (
	`user_id` INT(11) NOT NULL AUTO_INCREMENT,
	`full_name` VARCHAR(50) NOT NULL,
	`username` VARCHAR(255) NOT NULL,
	`email` VARCHAR(255) NOT NULL,
	`phone` VARCHAR(255) NOT NULL,
	`password` TEXT NOT NULL,
	`status` VARCHAR(255) NOT NULL DEFAULT 'free',
	
	`account_name` VARCHAR(255) NULL,
	`bank_name` VARCHAR(255) NULL,
	`account_number` BIGINT (10)  NULL,
	`sponsor` TEXT NULL DEFAULT NULL,
	`verification` TEXT NOT NULL DEFAULT 'No',
	`feeder` VARCHAR(255) NOT NULL DEFAULT 'No',
	`user_type` VARCHAR (255) DEFAULT 'user' ,
	`activated` TEXT NOT NULL DEFAULT 'No',
	`date_joined` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`user_id`),
	UNIQUE INDEX `username` (`username`),
	UNIQUE INDEX `email` (`email`)
)

CREATE TABLE `default_sponsor` (
	
	`username` VARCHAR (255) NOT NULL,
	`amount` INT (11) NOT NULL DEFAULT 0
	
);

CREATE TABLE `restrict` (
	`username` VARCHAR (255) NOT NULL,
	`date_entered`DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	
);

CREATE TABLE `verifyemail` (
	`email` VARCHAR (255) NOT NULL,
	`link` VARCHAR (255) NOT NULL,
	`date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	UNIQUE INDEX `email` (`email`)
);

CREATE TABLE `transactions` (
	`user` VARCHAR (255) NOT NULL,
	`receiver_fullname` VARCHAR (255) NOT NULL,
	`receiver_username` VARCHAR (255) NOT NULL,
	`receiver_phone` BIGINT (10) NOT NULL,
	`receiver_bank_name` VARCHAR (255) NOT NULL,
	`receiver_account_name` VARCHAR (255) NOT NULL,
	`receiver_account_number` BIGINT (10) NOT NULL,
	`payer_fullname` VARCHAR (255) NOT NULL,
	`payer_username` VARCHAR (255) NOT NULL,
	`payer_phone` BIGINT (10) NOT NULL,
	`purpose` VARCHAR (255) NOT NULL,
	`expire` DATETIME NOT NULL,
	`status` VARCHAR (255) NOT NULL DEFAULT 'PENDING',
	`order_id` VARCHAR (255) NOT NULL,
	`pop` VARCHAR (255) NULL,
	`receiving_order` VARCHAR (255) NULL,
	`date_entered` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `activation` (
	`username` VARCHAR (255) NOT NULL,
	`alloted` VARCHAR (255) NOT NULL
);

CREATE TABLE `passwordReset` (
	`email` VARCHAR (255) NOT NULL,
	`link` VARCHAR (255) NOT NULL,
	`date_entered` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	expire DATETIME NOT NULL
);


CREATE TABLE `feeder_tree` (
	`sponsor` VARCHAR (255) NOT NULL,
	`username` VARCHAR (255) NOT NULL,
	`sponreceive` VARCHAR (255) NOT NULL,
	`requiredEntrance` INT (11) NOT NULL,
	`a` VARCHAR (255)  NULL,
	`b` VARCHAR (255)  NULL,
	`c` VARCHAR (255)  NULL,
	`receive` VARCHAR (255)  NULL,
	`status` VARCHAR (255) NOT NULL,
	`order_id` VARCHAR (255) NOT NULL,
	`amount` INT (11) NOT NULL DEFAULT 0,
	`lft` INT (11) NOT NULL,
	`rgt` INT (11) NOT NULL,
	`date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);