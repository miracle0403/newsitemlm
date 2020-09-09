var db = require('../db');

CREATE PROCEDURE `register` (`sponsor` TEXT, `full_name` VARCHAR(255), `phone` VARCHAR(255), `code` INT(11), `username` VARCHAR(255), `email` VARCHAR(255), `password` VARCHAR(255), `status` VARCHAR(255), `verification` TEXT)  BEGIN

SELECT @myLeft := lft FROM user_tree WHERE user = sponsor;

UPDATE user_tree SET rgt = rgt + 2 WHERE rgt > @myLeft;

UPDATE user_tree SET lft = lft + 2 WHERE lft > @myLeft;

INSERT INTO user_tree(sponsor, user, rgt, lft) VALUES(sponsor, username, @myLeft + 2, @myLeft + 1);

INSERT INTO user (sponsor, full_name, phone, code, username, email, password, status, verification) VALUES ( sponsor, full_name, phone,code, username, email, password, 'active', 'no');
END$$