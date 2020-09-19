CREATE PROCEDURE `leafadd` (`sponsor` VARCHAR(255), `mother` VARCHAR(255), `child` VARCHAR(255))  BEGIN

SELECT @myLeft := lft FROM feeder_tree WHERE user = mother;

UPDATE feeder_tree SET rgt = rgt + 2 WHERE rgt > @myLeft;
UPDATE feeder_tree SET lft = lft + 2 WHERE lft > @myLeft;


INSERT INTO feeder_tree(user, lft, rgt, status) VALUES(child, @myLeft + 1, @myLeft + 2, pending);


END$$

CREATE PROCEDURE `placefeeder` (`mother` VARCHAR(255), `child` VARCHAR(255), `user` VARCHAR(255), `order_id` VARCHAR(255), `date` VARCHAR(255))  BEGIN

SELECT @bankname := bank_name, @fullname := fullname, @accountname := account_name, @accountnumber := account_number, @phone := phone FROM user WHERE username = mother;

SELECT @payerfullname := fullname, @payerphone := phone, @payerusername := username FROM user WHERE username = child;


INSERT INTO transactions (user, payername, payerusername, payerphone, receivername, receiverusername, receiverphone, bankname, accountname, accountnumber, amount, status, order_id, expire) Values (user, @payername, @payerusername, @payerphone, @fullname, mother, @phone, @bankname, @accountname, accountnumber, 10000, 'pending', order_id, date);

UPDATE feeder_tree SET amount = amount + 1 WHERE order_id = order_id;


END$$


CREATE PROCEDURE `leafadd` (`sponsor` VARCHAR(255), `mother` VARCHAR(255), `child` VARCHAR(255))  BEGIN

UPDATE feeder_entrance SET required_entrance = required_entrance - 1 WHERE user = child;
UPDATE feeder_entrance SET required_entrance = required_entrance + 1 WHERE user = mother;

END$$

CREATE PROCEDURE `denyactivationpayment` (`mother` VARCHAR(255), `child` VARCHAR(255), `order_id` VARCHAR(255))  
BEGIN

SELECT @receiverusername := receiverusername, @payerusername := payerusername FROM transactions WHERE order_id = order_id;

UPDATE transactions SET status = 'in contest' WHERE order_id = order_id;

SELECT @myRgt := rgt FROM chat DESC

INSERT INTO chat (agent, receiver, sender, order_id, status, lft, rgt, message) VALUES ('Miracle0403', @receiverusername, @payerusername, order_id, 'open', myRgt + 1, myRgt + 2, 'Hello! The receiver stated he or she did not receive payment. We need to solve this very quick so both of you can keep earning as we do not want dishonesty in this platform. We also understand it can be a case of delay in the bank so we will need you to do these simple things. ' @sender ', forward your email debit alert or POP to our support email. ' + receiver ', forward your bank statement to our support email. You will find our support email on the support page. THE MAIL SHOULD BE FORWARDED.  You both will be unblocked afterthe issue is resolved.  If you resolve the issue on your own, drop a message here. GOODLUCK ');


INSERT INTO messages (user, message) VALUES (@receiverusername, 'You can not earn till you resolve the issue you have at hand.'), (@payerusername, 'You can not earn till you resolve the issue you have at hand.')


END$$

CREATE PROCEDURE `confirmactivationpayment` (`mother` VARCHAR(255), `child` VARCHAR(255), `order_id` VARCHAR(255))  
BEGIN

UPDATE transactions SET status = 'in contest' WHERE order_id = order_id;

UPDATE user SET activation = 'yes' WHERE username = child;

UPDATE activation SET alloted = alloted - 1 WHERE username = mother;

END


CREATE PROCEDURE `denyfeeder` (`mother` VARCHAR(255), `child` VARCHAR(255), `order_id` VARCHAR(255))  
BEGIN

SELECT @receiverusername := receiverusername, @payerusername := payerusername FROM transactions WHERE order_id = order_id;

UPDATE transactions SET status = 'in contest' WHERE order_id = order_id;

UPDATE feeder_tree SET status = 'in contest' WHERE order_id = order_id;

SELECT @myRgt := rgt FROM chat DESC

INSERT INTO chat (agent, receiver, sender, order_id, status, lft, rgt, message) VALUES ('Miracle0403', @receiverusername, @payerusername, order_id, 'open', myRgt + 1, myRgt + 2, 'Hello! The receiver stated he or she did not receive payment. We need to solve this very quick so both of you can keep earning as we do not want dishonesty in this platform. We also understand it can be a case of delay in the bank so we will need you to do these simple things. ' @sender ', forward your email debit alert or POP to our support email. ' + receiver ', forward your bank statement to our support email. You will find our support email on the support page. THE MAIL SHOULD BE FORWARDED.  You both will be unblocked afterthe issue is resolved.  If you resolve the issue on your own, drop a message here. GOODLUCK ');

UPDATE feeder_tree SET receive = 'No' WHERE user = receiver or user = sender;
UPDATE feeder_tree SET sponreceive = 'No' WHERE user = receiver or user = sender;

INSERT INTO messages (user, message) VALUES (@receiverusername, 'You can not earn till you resolve the issue you have at hand.'), (@payerusername, 'You can not earn till you resolve the issue you have at hand.')

END