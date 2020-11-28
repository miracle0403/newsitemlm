Enter password: 
-- MariaDB dump 10.17  Distrib 10.5.5-MariaDB, for Android (armv7-a)
--
-- Host: localhost    Database: newdb
-- ------------------------------------------------------
-- Server version	10.5.5-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activation`
--

DROP TABLE IF EXISTS `activation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activation` (
  `username` varchar(255) NOT NULL,
  `alloted` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activation`
--

LOCK TABLES `activation` WRITE;
/*!40000 ALTER TABLE `activation` DISABLE KEYS */;
INSERT INTO `activation` VALUES ('miracle0403','679');
/*!40000 ALTER TABLE `activation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `default_sponsor`
--

DROP TABLE IF EXISTS `default_sponsor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `default_sponsor` (
  `user` varchar(255) NOT NULL,
  `number` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `default_sponsor`
--

LOCK TABLES `default_sponsor` WRITE;
/*!40000 ALTER TABLE `default_sponsor` DISABLE KEYS */;
INSERT INTO `default_sponsor` VALUES ('miracle04',12);
/*!40000 ALTER TABLE `default_sponsor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feeder_tree`
--

DROP TABLE IF EXISTS `feeder_tree`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `feeder_tree` (
  `sponsor` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `sponreceive` varchar(255) NOT NULL,
  `requiredEntrance` int(11) NOT NULL,
  `a` varchar(255) DEFAULT NULL,
  `b` varchar(255) DEFAULT NULL,
  `c` varchar(255) DEFAULT NULL,
  `receive` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `order_id` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL DEFAULT 0,
  `lft` int(11) NOT NULL,
  `rgt` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feeder_tree`
--

LOCK TABLES `feeder_tree` WRITE;
/*!40000 ALTER TABLE `feeder_tree` DISABLE KEYS */;
INSERT INTO `feeder_tree` VALUES ('fgdgfgcssyvx','fgfghbhufdx','yes',-6,NULL,NULL,NULL,'yes','confirmed','4f4yxs5gx5td',0,1,2,'2020-11-12 21:07:17');
/*!40000 ALTER TABLE `feeder_tree` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `passwordReset`
--

DROP TABLE IF EXISTS `passwordReset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `passwordReset` (
  `email` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
  `date_entered` datetime NOT NULL DEFAULT current_timestamp(),
  `expire` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `passwordReset`
--

LOCK TABLES `passwordReset` WRITE;
/*!40000 ALTER TABLE `passwordReset` DISABLE KEYS */;
INSERT INTO `passwordReset` VALUES ('Lawrenhacle72@gmail.com','/Lawrenhacle72@gmail.com/WwwWU43p18QLP0VK9izO2yI9otYfS1PDsST','2020-11-09 02:17:24','2020-11-09 02:37:24');
/*!40000 ALTER TABLE `passwordReset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('BPnXD3CwymOCvHFJ7fpwl9Su3hEvS7On',1605294610,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":{\"user_id\":15}}}'),('K5I7UWqxHsZ0M1T-0xdHXD1UIRiD0gTx',1605293957,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"returnTo\":\"/dashboard/\"}'),('KHPHlxEmVznYo2cJIWXNLElgcmv5MBsQ',1605294412,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"returnTo\":\"/dashboard\",\"flash\":{}}'),('SDr16af_RY2T_65N6PMJHQfjQVxSlPOe',1605294236,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":{\"user_id\":13}}}'),('UdqeCyX4m0N85zuQ_NmPRQJ-D_fwxoDd',1605294092,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":{\"user_id\":15}}}'),('XO2hit8PwttDuXFcL2aIUxJm9A2vtqq-',1605297112,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":{\"user_id\":15}}}'),('e1AbUBaCIvkx8WOddq2MmxRosNBd8Bfl',1605311251,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),('wzjRKsWc2-mWxToZe87Ftm90mSg9hkJU',1605297077,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":{\"user_id\":12}},\"flash\":{}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transactions` (
  `user` varchar(255) NOT NULL,
  `receiver_fullname` varchar(255) NOT NULL,
  `receiver_username` varchar(255) NOT NULL,
  `receiver_phone` bigint(10) NOT NULL,
  `receiver_bank_name` varchar(255) NOT NULL,
  `receiver_account_name` varchar(255) NOT NULL,
  `receiver_account_number` bigint(10) NOT NULL,
  `payer_fullname` varchar(255) NOT NULL,
  `payer_username` varchar(255) NOT NULL,
  `payer_phone` bigint(10) NOT NULL,
  `purpose` varchar(255) NOT NULL,
  `expire` datetime NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'PENDING',
  `order_id` varchar(255) NOT NULL,
  `pop` varchar(255) DEFAULT NULL,
  `date_entered` datetime NOT NULL DEFAULT current_timestamp(),
  `receiving_order` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(50) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'free',
  `account_name` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `account_number` bigint(10) DEFAULT NULL,
  `sponsor` text DEFAULT NULL,
  `verification` text NOT NULL DEFAULT 'No',
  `feeder` varchar(255) NOT NULL DEFAULT 'No',
  `user_type` varchar(255) DEFAULT 'user',
  `activated` text NOT NULL DEFAULT 'No',
  `date_joined` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (16,'fgggg gkgg','fgfghbhufdx','vjb@th.co','987654321','vjdty5856cseAfx45ghvcjdhv','paid','hjgjgh ghvhhhh','diamond',1234567890,'fgdgfgcssyvx','No','No','user','No','2020-11-12 21:03:56'),(18,'Miracle Lawrence','Miracle0403','Lawrencee71@gmail.com','08061179366','$2a$10$8//GTCOLLSWt9GEwvjD0B.JrqA4T9LIh7W8EJBgHWbZog5LYP/P3.','free',NULL,NULL,NULL,'fgfghbhufdx','No','No','user','No','2020-11-13 00:34:42'),(19,'Miracle Lawrence','Miracle04','Lawrencecle72@gmail.com','08061179358','$2a$10$NV6h7FmrxMIFKW2/Sbw0B..hVPyAvpkGPOcn6AVVGz2NkfBdg7MAy','free',NULL,NULL,NULL,'Miracle0403','No','No','user','No','2020-11-13 00:35:16'),(20,'Miracle Lawrence','Mimiluva','Lawrencemicle71@gmail.com','08061179386','$2a$10$8lRoeVljmrL.nxhUfbh3D.zy3MWDbAR/pt5lWOKEcAMHkcKJz7GL2','free',NULL,NULL,NULL,'miracle04','No','No','user','No','2020-11-13 00:35:42'),(21,'Miracle Lawrence','Mimiluvb','Lawrencemacle71@gmail.com','08065879366','$2a$10$MwOtX48M3wv4dETsCXDIn.yt19VeBddqD043YOmW1lfgdDYx3PkjC','free',NULL,NULL,NULL,'miracle04','No','No','user','No','2020-11-13 00:36:21'),(22,'Miracle Lawrence','Mimiluvc','Lawrencemirac72@gmail.com','08061185366','$2a$10$kTpiIr9PByxGFCZoRizKju/VRSDvyvbRBCT55G5Gupx610Vr3yd9u','free',NULL,NULL,NULL,'miracle04','No','No','user','No','2020-11-13 00:36:48'),(23,'Miracle Lawrence','Mimiluvd','Lawrencemle72@gmail.com','08061179341','$2a$10$n1.OOfKk3zSqwocyv9RkMegvH/Fkx2dRUujMs0Ea.K5VnILAKJeQu','free',NULL,NULL,NULL,'miracle04','No','No','user','No','2020-11-13 00:37:13'),(24,'Miracle Lawrence','Mimiluve','Lawrencemirafe72@gmail.com','08061541366','$2a$10$2jsHixUL1clg494lLJGe..st3wV15P4fI5.dxv3BRhmPQ3HzMu/qC','free',NULL,NULL,NULL,'miracle04','No','No','user','No','2020-11-13 00:37:37'),(25,'Miracle Lawrence','Mimiluvf','mify1@yahoo.com','08061180366','$2a$10$kmZ206R.1vOcxG6lDK1VFuHDHtiASeD3jGKiuSdmo6Ms6mcR7G5ce','free',NULL,NULL,NULL,'miracle04','No','No','user','No','2020-11-13 00:37:56'),(26,'Miracle Lawrence','Mimiluvg','Lawrencemie72@gmail.com','08067459366','$2a$10$GsxkvXvmfb02t7DFjZaaYO2EvGz95FBaE32Z.lWFyVqSNKIcMGyNO','free',NULL,NULL,NULL,'miracle04','No','No','user','No','2020-11-13 00:38:35'),(27,'Miracle Lawrence','Mimiluvi','mify1@yoo.com','08061179742','$2a$10$mW7PmXcbXOHhCyRsJ.v0kuRt1siAqvUiU/kKvhGV7J6um2jsiPC.i','free',NULL,NULL,NULL,'miracle04','No','No','user','No','2020-11-13 00:39:05'),(28,'Miracle Lawrence','Mimiluvj','mibbfy1@yoo.com','08061159742','$2a$10$yEwQh.pHvtks8RvCGOrdIemllPblqiU5U2XW9CA/ajXUMvk1ypmuu','free',NULL,NULL,NULL,'miracle04','No','No','user','No','2020-11-13 00:44:07'),(29,'Miracle Lawrence','Mimiluvk','Lawreniracle72@gmail.com','08853179366','$2a$10$C7pD7xVqngKgbUHh2PiIQOtibIkzcuodKrxsSzhJurDI8Obnbbtom','free',NULL,NULL,NULL,'miracle04','No','No','user','No','2020-11-13 00:44:42'),(30,'Miracle Lawrence','Mimiluvl','mify1@yavb.com','08061178562','$2a$10$zjbefY5vIgVCy7I6pr1EL.79oRu645Bqy07KxyH2nL7VAPIpphYcy','free',NULL,NULL,NULL,'miracle04','No','No','user','No','2020-11-13 00:45:15');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_tree`
--

DROP TABLE IF EXISTS `user_tree`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_tree` (
  `username` varchar(255) NOT NULL,
  `sponsor` text DEFAULT NULL,
  `activated` varchar(255) NOT NULL DEFAULT 'No',
  `feeder` varchar(255) NOT NULL DEFAULT 'No',
  `status` varchar(255) NOT NULL DEFAULT 'free',
  `lft` int(11) NOT NULL,
  `rgt` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_tree`
--

LOCK TABLES `user_tree` WRITE;
/*!40000 ALTER TABLE `user_tree` DISABLE KEYS */;
INSERT INTO `user_tree` VALUES ('fgfghbhufdx','fgdgfgcssyvx','No','yes','paid',1,28),('Miracle0403','fgfghbhufdx','No','No','free',2,27),('Miracle04','Miracle0403','No','No','free',3,26),('Mimiluva','miracle04','No','No','free',24,25),('Mimiluvb','miracle04','No','No','free',22,23),('Mimiluvc','miracle04','No','No','free',20,21),('Mimiluvd','miracle04','No','No','free',18,19),('Mimiluve','miracle04','No','No','free',16,17),('Mimiluvf','miracle04','No','No','free',14,15),('Mimiluvg','miracle04','No','No','free',12,13),('Mimiluvi','miracle04','No','No','free',10,11),('Mimiluvj','miracle04','No','No','free',8,9),('Mimiluvk','miracle04','No','No','free',6,7),('Mimiluvl','miracle04','No','No','free',4,5);
/*!40000 ALTER TABLE `user_tree` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verifyemail`
--

DROP TABLE IF EXISTS `verifyemail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verifyemail` (
  `email` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verifyemail`
--

LOCK TABLES `verifyemail` WRITE;
/*!40000 ALTER TABLE `verifyemail` DISABLE KEYS */;
/*!40000 ALTER TABLE `verifyemail` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-13  0:47:42
