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