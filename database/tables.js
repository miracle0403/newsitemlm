var db = require('../db');



CREATE TABLE `user` (
	`user_id` INT(11) NOT NULL AUTO_INCREMENT,
	`full_name` VARCHAR(50) NOT NULL DEFAULT '0',
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
	
	`user_type` VARCHAR (255) DEFAULT 'user' ,
	`activated` TEXT NOT NULL DEFAULT 'No',
	`date_joined` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`user_id`),
	UNIQUE INDEX `username` (`username`),
	UNIQUE INDEX `email` (`email`)
)

CREATE TABLE `default_sponsor` (
	`user` VARCHAR (255) NOT NULL 
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
	`date_entered` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `activation` (
	`username` VARCHAR (255) NOT NULL,
	`alloted` VARCHAR (255) NOT NULL
);


CREATE TABLE `feeder_tree` (
	`sponsor` VARCHAR (255) NOT NULL,
	`username` VARCHAR (255) NOT NULL,
	`sponreceive` VARCHAR (255) NOT NULL,
	`requiredEntrance` INT (11) NOT NULL,
	`a` VARCHAR (255)  NULL,
	`b` VARCHAR (255)  NULL,
	`c` VARCHAR (255)  NULL,
	`receive` VARCHAR (255) NOT NULL,
	`status` VARCHAR (255) NOT NULL,
	`order_id` VARCHAR (255) NOT NULL,
	`lft` INT (11) NOT NULL,
	`rgt` INT (11) NOT NULL,
	`date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);