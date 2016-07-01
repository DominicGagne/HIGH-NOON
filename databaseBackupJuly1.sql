-- MySQL dump 10.13  Distrib 5.7.11, for osx10.10 (x86_64)
--
-- Host: localhost    Database: HighNoon
-- ------------------------------------------------------
-- Server version	5.7.11

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `BannedFromChat`
--

DROP TABLE IF EXISTS `BannedFromChat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BannedFromChat` (
  `UserID` int(11) NOT NULL,
  `BannedUntil` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  CONSTRAINT `bannedfromchat_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BannedFromChat`
--

LOCK TABLES `BannedFromChat` WRITE;
/*!40000 ALTER TABLE `BannedFromChat` DISABLE KEYS */;
/*!40000 ALTER TABLE `BannedFromChat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ChatTokens`
--

DROP TABLE IF EXISTS `ChatTokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ChatTokens` (
  `TokenID` int(11) NOT NULL AUTO_INCREMENT,
  `ExpiryTime` text,
  PRIMARY KEY (`TokenID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ChatTokens`
--

LOCK TABLES `ChatTokens` WRITE;
/*!40000 ALTER TABLE `ChatTokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `ChatTokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Stats`
--

DROP TABLE IF EXISTS `Stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Stats` (
  `VisitorID` int(11) NOT NULL AUTO_INCREMENT,
  `VisitorZone` varchar(50) NOT NULL,
  `NetworkIP` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`VisitorID`)
) ENGINE=InnoDB AUTO_INCREMENT=267 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Stats`
--

LOCK TABLES `Stats` WRITE;
/*!40000 ALTER TABLE `Stats` DISABLE KEYS */;
INSERT INTO `Stats` VALUES (1,'EDT','::1'),(2,'EDT','::1'),(3,'EDT','::1'),(4,'EDT','::1'),(5,'EDT','::1'),(6,'EDT','::1'),(7,'EDT','::1'),(8,'EDT','::1'),(9,'EDT','::1'),(10,'EDT','::1'),(11,'EDT','::1'),(12,'EDT','::1'),(13,'EDT','::1'),(14,'EDT','::1'),(15,'EDT','::1'),(16,'EDT','::1'),(17,'EDT','::1'),(18,'EDT','::1'),(19,'EDT','::1'),(20,'EDT','::1'),(21,'EDT','::1'),(22,'EDT','::1'),(23,'EDT','::1'),(24,'EDT','::1'),(25,'EDT','::1'),(26,'EDT','::1'),(27,'EDT','::1'),(28,'EDT','::1'),(29,'EDT','::1'),(30,'EDT','::1'),(31,'EDT','::1'),(32,'EDT','::1'),(33,'EDT','::1'),(34,'EDT','::1'),(35,'EDT','::1'),(36,'EDT','::1'),(37,'EDT','::1'),(38,'EDT','::1'),(39,'EDT','::1'),(40,'EDT','::1'),(41,'EDT','::1'),(42,'EDT','::1'),(43,'EDT','::1'),(44,'EDT','::1'),(45,'EDT','::1'),(46,'EDT','::1'),(47,'EDT','::1'),(48,'EDT','::1'),(49,'EDT','::1'),(50,'EDT','::1'),(51,'EDT','::1'),(52,'EDT','::1'),(53,'EDT','::1'),(54,'EDT','::1'),(55,'EDT','::1'),(56,'EDT','::1'),(57,'EDT','::1'),(58,'EDT','::1'),(59,'EDT','::1'),(60,'EDT','::1'),(61,'EDT','::1'),(62,'EDT','::1'),(63,'EDT','::1'),(64,'EDT','::1'),(65,'EDT','::1'),(66,'EDT','::1'),(67,'EDT','::1'),(68,'EDT','::1'),(69,'EDT','::1'),(70,'EDT','::1'),(71,'EDT','::1'),(72,'EDT','::1'),(73,'EDT','::1'),(74,'EDT','::1'),(75,'EDT','::1'),(76,'EDT','::1'),(77,'EDT','::1'),(78,'EDT','::1'),(79,'EDT','::1'),(80,'EDT','::1'),(81,'EDT','::1'),(82,'EDT','::1'),(83,'EDT','::1'),(84,'EDT','::1'),(85,'EDT','::1'),(86,'EDT','::1'),(87,'EDT','::1'),(88,'EDT','::1'),(89,'EDT','::1'),(90,'EDT','::1'),(91,'EDT','::1'),(92,'EDT','::1'),(93,'EDT','::1'),(94,'EDT','::1'),(95,'EDT','::1'),(96,'EDT','::1'),(97,'EDT','::1'),(98,'EDT','::1'),(99,'EDT','::1'),(100,'EDT','::1'),(101,'EDT','::1'),(102,'EDT','::1'),(103,'EDT','::1'),(104,'EDT','::1'),(105,'EDT','::1'),(106,'EDT','::1'),(107,'EDT','::1'),(108,'EDT','::1'),(109,'EDT','::1'),(110,'EDT','::1'),(111,'EDT','::1'),(112,'EDT','::1'),(113,'EDT','::1'),(114,'EDT','::1'),(115,'EDT','::1'),(116,'EDT','::1'),(117,'EDT','::1'),(118,'EDT','::1'),(119,'EDT','::1'),(120,'EDT','::1'),(121,'EDT','::1'),(122,'EDT','::1'),(123,'EDT','::1'),(124,'EDT','::1'),(125,'EDT','::1'),(126,'EDT','::1'),(127,'EDT','::1'),(128,'EDT','::1'),(129,'EDT','::1'),(130,'EDT','::1'),(131,'EDT','::1'),(132,'EDT','::1'),(133,'EDT','::1'),(134,'EDT','::1'),(135,'EDT','::1'),(136,'EDT','::1'),(137,'EDT','::1'),(138,'EDT','::1'),(139,'EDT','::1'),(140,'EDT','::1'),(141,'EDT','::1'),(142,'EDT','::1'),(143,'EDT','::1'),(144,'EDT','::1'),(145,'EDT','::1'),(146,'EDT','::1'),(147,'EDT','::1'),(148,'EDT','::1'),(149,'EDT','::1'),(150,'EDT','::1'),(151,'EDT','::1'),(152,'EDT','::1'),(153,'EDT','::1'),(154,'EDT','::1'),(155,'EDT','::1'),(156,'EDT','::1'),(157,'EDT','::1'),(158,'EDT','::1'),(159,'EDT','::1'),(160,'EDT','::1'),(161,'EDT','::1'),(162,'EDT','::1'),(163,'EDT','::1'),(164,'EDT','::1'),(165,'EDT','::1'),(166,'EDT','::1'),(167,'EDT','::1'),(168,'EDT','::1'),(169,'EDT','::1'),(170,'EDT','::1'),(171,'EDT','::1'),(172,'EDT','::1'),(173,'EDT','::1'),(174,'EDT','::1'),(175,'EDT','::1'),(176,'EDT','::1'),(177,'EDT','::1'),(178,'EDT','::1'),(179,'EDT','::1'),(180,'EDT','::1'),(181,'EDT','::1'),(182,'EDT','::1'),(183,'EDT','::1'),(184,'EDT','::1'),(185,'EDT','::1'),(186,'EDT','::1'),(187,'EDT','::1'),(188,'EDT','::1'),(189,'EDT','::1'),(190,'EDT','::1'),(191,'EDT','::1'),(192,'EDT','::1'),(193,'EDT','::1'),(194,'EDT','::1'),(195,'EDT','::1'),(196,'EDT','::1'),(197,'EDT','::1'),(198,'EDT','::1'),(199,'EDT','::1'),(200,'EDT','::1'),(201,'EDT','::1'),(202,'EDT','::1'),(203,'EDT','::1'),(204,'EDT','::1'),(205,'EDT','::1'),(206,'EDT','::1'),(207,'EDT','::1'),(208,'EDT','::1'),(209,'EDT','::1'),(210,'EDT','::1'),(211,'EDT','::1'),(212,'EDT','::1'),(213,'EDT','::1'),(214,'EDT','::1'),(215,'EDT','::1'),(216,'EDT','::1'),(217,'EDT','::1'),(218,'EDT','::1'),(219,'EDT','::1'),(220,'EDT','::1'),(221,'EDT','::1'),(222,'EDT','::1'),(223,'EDT','::1'),(224,'EDT','::1'),(225,'EDT','::1'),(226,'EDT','::1'),(227,'EDT','::1'),(228,'EDT','::1'),(229,'EDT','::1'),(230,'EDT','::1'),(231,'EDT','::1'),(232,'EDT','::1'),(233,'EDT','::1'),(234,'EDT','::1'),(235,'EDT','::1'),(236,'EDT','::1'),(237,'EDT','::1'),(238,'EDT','::1'),(239,'EDT','::1'),(240,'EDT','::1'),(241,'EDT','::1'),(242,'EDT','::1'),(243,'EDT','::1'),(244,'EDT','::1'),(245,'EDT','::1'),(246,'EDT','::1'),(247,'EDT','::1'),(248,'EDT','::1'),(249,'EDT','::1'),(250,'EDT','::1'),(251,'EDT','::1'),(252,'EDT','::1'),(253,'EDT','::1'),(254,'EDT','::1'),(255,'EDT','::1'),(256,'EDT','::1'),(257,'EDT','::1'),(258,'EDT','::1'),(259,'EDT','::1'),(260,'EDT','::1'),(261,'EDT','::1'),(262,'EDT','::1'),(263,'EDT','::1'),(264,'EDT','::1'),(265,'EDT','::1'),(266,'EDT','::1');
/*!40000 ALTER TABLE `Stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `test` (
  `testID` int(11) NOT NULL,
  PRIMARY KEY (`testID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
/*!40000 ALTER TABLE `test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `Password` text,
  `NumWins` int(11) DEFAULT '0',
  `TotalPoints` int(11) DEFAULT '0',
  `SoundEffects` tinyint(4) DEFAULT '1',
  `UTCOffset` int(11) DEFAULT NULL,
  `BannedUntil` varchar(50) DEFAULT '0',
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username` (`Username`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-07-01 11:47:05
