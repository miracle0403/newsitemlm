DELIMITER //
CREATE PROCEDURE `confirm-feeder2`
( `orderId` INT(11), `mother` VARCHAR(255), `child` VARCHAR(255))
BEGIN



END // 


DELIMITER //
CREATE PROCEDURE `confirm_feeder1`
( `orderId` VARCHAR(255), `mother` VARCHAR(255), `child` VARCHAR(255))
BEGIN

UPDATE user SET status = 'paid' WHERE username = child and status = 'free';

UPDATE transactions SET status = 'confirmed' WHERE order_id = orderId;

UPDATE feeder_tree SET status = 'confirmed' WHERE order_id = orderId;


END // 

ALTER TABLE `feeder_tree` ADD `restricted` VARCHAR(255) NOT NULL DEFAULT 'No' AFTER `c`;
	



DELIMITER //
CREATE PROCEDURE `register` (`regsponsor` VARCHAR(255), `regfullname` VARCHAR(255), `regphone` VARCHAR(255), `regusername` VARCHAR(255), `regemail` VARCHAR(255), `reghash` VARCHAR(255))
BEGIN

SELECT @regLeft := lft FROM user_tree WHERE username = regsponsor;

UPDATE user_tree SET rgt = rgt + 2 WHERE rgt > @regLeft;
UPDATE user_tree SET lft = lft + 2 WHERE lft > @regLeft;

INSERT INTO user_tree (sponsor,   username,  lft, rgt) VALUES (regsponsor, regusername, @regLeft + 1, @regLeft + 2);

INSERT INTO user (sponsor ,  full_name ,  phone ,  username ,  email , password) VALUES (regsponsor, regfullname, regphone, regusername, regemail, reghash);

END //



DELIMITER //
CREATE PROCEDURE `leafadd` (`mother` VARCHAR(255), `order_d` VARCHAR(255), `child` VARCHAR(255), `ordId` VARCHAR(255))  
BEGIN

SELECT @myLeft := lft FROM feeder_tree WHERE username = mother;


UPDATE feeder_tree SET rgt = rgt + 2 WHERE rgt > @myLeft;
UPDATE feeder_tree SET lft = lft + 2 WHERE lft > @myLeft;


SELECT @sponreceive := receive FROM feeder_tree WHERE username = mother;

SELECT @count := COUNT(username),  @receive := receive, @requiredEntrance := requiredEntrance FROM feeder_tree WHERE username = child;


INSERT INTO feeder_tree(username, sponreceive, receive, sponsor, requiredEntrance, lft, amount, rgt, status, order_id) VALUES(child, 'yes', @receive, mother, requiredEntrance, @myLeft + 1, 0, @myLeft + 2, 'pending', order_id);

UPDATE feeder_tree SET receive = 'No', requiredEntrance = 2 WHERE @count = 0 and username = child;




END //


DELIMITER // 
CREATE PROCEDURE `leafdel` (`mother` VARCHAR(255), `child` VARCHAR(255), `orderId` VARCHAR(255), `ordId` VARCHAR(255))
BEGIN

SELECT @myLeft := lft FROM feeder_tree WHERE username = mother;

DELETE FROM feeder_tree WHERE order_id = orderId;

UPDATE feeder_tree SET rgt = rgt - 2 WHERE rgt > @myLeft;

UPDATE feeder_tree SET lft = lft - 2 WHERE lft > @myLeft;

UPDATE transactions SET status = 'Not Paid'  WHERE order_id = orderId;

UPDATE feeder_tree SET amount = amount -1  WHERE order_id = ordId;

UPDATE feeder_tree SET a = null  WHERE a = child and order_id = ordId;


UPDATE feeder_tree SET b = null WHERE b = child and order_id = ordId;


UPDATE feeder_tree SET c = null WHERE c = child and order_id = ordId;

END //
DELIMETER;

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
CREATE PROCEDURE `placefeeder` (`child` VARCHAR(255), `purpose` VARCHAR(255), `mother` VARCHAR(255), `user` VARCHAR(255)
, `order_id` VARCHAR(255)
, `date` VARCHAR(255)
)  BEGIN

SELECT @bankname := bank_name, @fullname := full_name, @accountname := account_name, @accountnumber := account_number, @phone := phone FROM user WHERE username = mother;

SELECT @payerfullname := full_name, @payerphone := phone, @payerusername := username FROM user WHERE username = child;


INSERT INTO transactions (user, purpose, payer_fullname, payer_username, payer_phone, receiver_fullname, receiver_username, receiver_phone, receiver_bank_name, receiver_account_name, receiver_account_number, status, order_id, expire) Values (user, purpose, @payerfullname, @payerusername, @payerphone, @fullname, mother, @phone, @bankname, @accountname, @accountnumber, 'pending', order_id, date);


END //
DELIMETER;


CREATE PROCEDURE `leafadd` (`sponsor` VARCHAR(255), `mother` VARCHAR(255), `child` VARCHAR(255))  BEGIN

UPDATE feeder_entrance SET required_entrance = required_entrance - 1 WHERE user = child;
UPDATE feeder_entrance SET required_entrance = required_entrance + 1 WHERE user = mother;

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