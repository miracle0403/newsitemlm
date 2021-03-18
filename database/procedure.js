delete from feeder_tree;
INSERT INTO `feeder_tree` (`sponsor`, `username`, `sponreceive`, `requiredEntrance`, `a`, `b`, `c`, `restricted`, `receive`, `status`, `order_id`, `amount`, `lft`, `rgt`, `date`) VALUES ('default_user', 'default_user', 'yes', '-8', NULL, NULL, NULL, 'No', 'yes', 'confirmed', '453trt4ret5464rt56', '0', '1', '2', current_timestamp());
ALTER TABLE `feeder_tree` CHANGE `sponreceive` `sponreceive` VARCHAR(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL, CHANGE `requiredEntrance` `requiredEntrance` INT(11) NULL;
ALTER TABLE `user` ADD `lft` INT(11) NOT NULL AFTER `activated`, ADD `rgt` INT(11) NOT NULL AFTER `lft`; 


DELIMITER //
CREATE PROCEDURE `confirm-feeder`
(`userId` INT(11), `orderId` INT(11), `mother` VARCHAR(255), `child` VARCHAR(255), `regusername` VARCHAR(255), `regemail` VARCHAR(255), `reghash` VARCHAR(255))
BEGIN

UPDATE user SET status = 'paid' WHERE user_id = userId and status = 'free';

UPDATE transactions SET status = 'confirmed' WHERE order_id = orderId;

UPDATE feeder_tree SET status = 'confirmed' WHERE order_id = orderId;


UPDATE feeder_tree SET requiredEntrance = requiredEntrance + 1 WHERE username = mother;

UPDATE feeder_tree SET  WHERE username = mother and order_id not orderId;

UPDATE feeder_tree SET requiredEntrance = requiredEntrance - 1 WHERE username = child;

END//


DELIMITER //
CREATE PROCEDURE `register` (`regsponsor` VARCHAR(255), `regfullname` VARCHAR(255), `regphone` VARCHAR(255), `regusername` VARCHAR(255), `regemail` VARCHAR(255), `reghash` VARCHAR(255))
BEGIN

SELECT @myLeft := lft FROM user WHERE username = regsponsor;


UPDATE user SET rgt = rgt + 2 WHERE rgt > @myLeft;
UPDATE user SET lft = lft + 2 WHERE lft > @myLeft;

INSERT INTO user (lft, rgt, sponsor ,  full_name ,  phone ,  username ,  email , password) VALUES (@myLeft + 1, @myLeft + 2, regsponsor, regfullname, regphone, regusername, regemail, reghash);

END //



DELIMITER //
CREATE PROCEDURE `leafadd` (`mother` VARCHAR(255), `orderId` VARCHAR(255), `child` VARCHAR(255),  `spon` VARCHAR(255))  
BEGIN

SELECT @myLeft := lft FROM feeder_tree WHERE username = mother;


UPDATE feeder_tree SET rgt = rgt + 2 WHERE rgt > @myLeft;
UPDATE feeder_tree SET lft = lft + 2 WHERE lft > @myLeft;


INSERT INTO feeder_tree(username, sponsor,  lft, rgt, status, order_id) VALUES(child, spon, @myLeft + 1,  @myLeft + 2, 'pending', orderId);



END //




CREATE PROCEDURE `leafdel` (`sponsor` VARCHAR(255), `mother` VARCHAR(255), `child` VARCHAR(255), `order_id` VARCHAR(255)
)  BEGIN

SELECT @myLeft := lft FROM feeder_tree WHERE user = mother;

DELETE FROM feeder_tree WHERE order_id = order_id;

UPDATE feeder_tree SET rgt = rgt - 2 WHERE rgt > @myLeft;

UPDATE feeder_tree SET lft = lft - 2 WHERE lft > @myLeft;

UPDATE transactions SET status = 'expired'  WHERE order_id = order_id;


END //
DELIMETER;

DELIMITER //
CREATE PROCEDURE `register` (`sponsor` VARCHAR(255), `full_name` VARCHAR(255)
, `phone` VARCHAR(255)
,  `username` VARCHAR(255)
, `email` VARCHAR(255)
, `password` VARCHAR(255)
, `status` VARCHAR(255)
, `verification` VARCHAR(255)
, `activation` VARCHAR(255)
 ) 

BEGIN

INSERT INTO `user` (sponsor, `full_name`, `phone`, `username`, `email`, `password`, `status`, `verification`) VALUES ( sponsor, full_name, phone, username, email, password, 'active', 'no');

END //
DELIMETER;


DELIMITER //
CREATE PROCEDURE `placefeeder` (`child` VARCHAR(255), `reason` VARCHAR(255), `spon` VARCHAR(255), `mother` VARCHAR(255)
, `orderId` VARCHAR(255)
, `dateEntered` VARCHAR(255), `oldId` VARCHAR(255)
)  BEGIN

SELECT @bankname := bank_name, @fullname := full_name, @accountname := account_name, @accountnumber := account_number, @phone := phone FROM user WHERE username = mother;

SELECT @payerfullname := full_name, @payerphone := phone, @payerusername := username FROM user WHERE username = child;


INSERT INTO transactions ( user, purpose, payer_fullname, payer_username, payer_phone, receiver_fullname, receiver_username, receiver_phone, receiver_bank_name, receiver_account_name, receiver_account_number, status, order_id, expire, receiving_order) Values (mother, reason, @payerfullname, @payerusername, @payerphone, @fullname, mother, @phone, @bankname, @accountname, @accountnumber, 'pending', orderId, dateEntered, oldId);


END //
DELIMETER;


DELIMITER //
CREATE PROCEDURE `placefeeder1` (`child` VARCHAR(255), `reason` VARCHAR(255), `spon` VARCHAR(255), `mother` VARCHAR(255)
, `orderId` VARCHAR(255)
, `dateEntered` VARCHAR(255), `oldId` VARCHAR(255)
)  BEGIN

SELECT @bankname := bank_name, @fullname := full_name, @accountname := account_name, @accountnumber := account_number, @phone := phone FROM user WHERE username = spon;

SELECT @payerfullname := full_name, @payerphone := phone, @payerusername := username FROM user WHERE username = child;


INSERT INTO transactions ( user, purpose, payer_fullname, payer_username, payer_phone, receiver_fullname, receiver_username, receiver_phone, receiver_bank_name, receiver_account_name, receiver_account_number, status, order_id, expire, receiving_order) Values (mother, reason, @payerfullname, @payerusername, @payerphone, @fullname, spon, @phone, @bankname, @accountname, @accountnumber, 'pending', orderId, dateEntered, oldId);


END //
DELIMETER;

CREATE PROCEDURE `denyactivationpayment` (`mother` VARCHAR(255), `child` VARCHAR(255), `order_id` VARCHAR(255)
)  
BEGIN

SELECT @receiverusername := receiverusername, @payerusername := payerusername FROM transactions WHERE order_id = order_id;

UPDATE transactions SET status = 'in contest' WHERE order_id = order_id;

SELECT @myRgt := rgt FROM chat DESC

INSERT INTO chat (agent, receiver, sender, order_id, status, lft, rgt, message) VALUES ('Miracle0403', @receiverusername, @payerusername, order_id, 'open', myRgt + 1, myRgt + 2, 'Hello! The receiver stated he or she did not receive payment. We need to solve this very quick so both of you can keep earning as we do not want dishonesty in this platform. We also understand it can be a case of delay in the bank so we will need you to do these simple things. ' @sender ', forward your email debit alert or POP to our support email. ' + receiver ', forward your bank statement to our support email. You will find our support email on the support page. THE MAIL SHOULD BE FORWARDED.  You both will be unblocked afterthe issue is resolved.  If you resolve the issue on your own, drop a message here. GOODLUCK ');


INSERT INTO messages (user, message) VALUES (@receiverusername, 'You can not earn till you resolve the issue you have at hand.'), (@payerusername, 'You can not earn till you resolve the issue you have at hand.')


END //
DELIMETER;

CREATE PROCEDURE `confirmactivationpayment` (`mother` VARCHAR(255), `child` VARCHAR(255), `order_id` VARCHAR(255)
)  
BEGIN

UPDATE transactions SET status = 'confirmed' WHERE order_id = order_id;

UPDATE user SET activation = 'yes' WHERE username = child;

UPDATE activation SET alloted = alloted - 1 WHERE username = mother;

END


CREATE PROCEDURE `denyfeeder` (`mother` VARCHAR(255), `child` VARCHAR(255), `order_id` VARCHAR(255)
)  
BEGIN

SELECT @receiverusername := receiverusername, @payerusername := payerusername FROM transactions WHERE order_id = order_id;

UPDATE transactions SET status = 'in contest' WHERE order_id = order_id;

UPDATE feeder_tree SET status = 'in contest' WHERE order_id = order_id;

SELECT @myRgt := rgt FROM chat DESC

INSERT INTO chat (agent, receiver, sender, order_id, status, lft, rgt, message) VALUES ('Miracle0403', @receiverusername, @payerusername, order_id, 'open', myRgt + 1, myRgt + 2, 'Hello! The receiver stated he or she did not receive payment. We need to solve this very quick so both of you can keep earning as we do not want dishonesty in this platform. We also understand it can be a case of delay in the bank so we will need you to do these simple things. ' @sender ', forward your email debit alert or POP to our support email. ' + receiver ', forward your bank statement to our support email. You will find our support email on the support page. THE MAIL SHOULD BE FORWARDED.  You both will be unblocked afterthe issue is resolved.  If you resolve the issue on your own, drop a message here. GOODLUCK ');

UPDATE feeder_tree SET receive = 'No' WHERE user = receiver or user = sender;
UPDATE feeder_tree SET sponreceive = 'No' WHERE user = receiver or user = sender;

INSERT INTO messages (user, message) VALUES (@receiverusername, 'You can not earn till you resolve the issue you have at hand.'), (@payerusername, 'You can not earn till you resolve the issue you have at hand.');

END

CREATE PROCEDURE `confirmfeeder` (`mother` VARCHAR(255), `child` VARCHAR(255), `order_id` VARCHAR(255)
)  
BEGIN

UPDATE transactions SET status = 'confirmed' WHERE order_id = order_id;

UPDATE feeder_tree SET status = 'confirmed' WHERE order_id = order_id;

UPDATE feeder_tree SET feeder_entrance = feeder_entrance + 1 WHERE user = mother;

UPDATE feeder_tree SET receive =  'No' WHERE user = mother AND feeder_entrance > 0;

UPDATE feeder_tree SET sponreceive =  'No' WHERE sponsor = mother AND feeder_entrance > 0;

UPDATE feeder_tree SET feeder_entrance = feeder_entrance - 1 WHERE user = child;

UPDATE feeder_tree SET receive =  'Yes' WHERE user = child AND feeder_entrance < 1;

UPDATE feeder_tree SET sponreceive =  'Yes' WHERE sponsor = child AND feeder_entrance < 1;

END