CREATE DATABASE  IF NOT EXISTS `chat` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `chat`;
-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: chat
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chats`
--

DROP TABLE IF EXISTS `chats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chats` (
  `chatId` int NOT NULL AUTO_INCREMENT,
  `firstUserId` int DEFAULT NULL,
  `secondUserId` int DEFAULT NULL,
  PRIMARY KEY (`chatId`),
  KEY `firstUserId` (`firstUserId`),
  KEY `secondUserId` (`secondUserId`),
  CONSTRAINT `fk_firstUserId` FOREIGN KEY (`firstUserId`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_secondUserId` FOREIGN KEY (`secondUserId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chats`
--

LOCK TABLES `chats` WRITE;
/*!40000 ALTER TABLE `chats` DISABLE KEYS */;
INSERT INTO `chats` VALUES (1,34567,34567),(2,34567,34567);
/*!40000 ALTER TABLE `chats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `senderId` varchar(45) DEFAULT NULL,
  `text` varchar(450) DEFAULT NULL,
  `chatId` int DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `chatId` (`chatId`),
  KEY `fk_senderId` (`senderId`),
  CONSTRAINT `fk_chatId` FOREIGN KEY (`chatId`) REFERENCES `chats` (`chatId`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,'zVDB3MeMx2xNkggXAACD','beber',1,'2023-11-14 16:08:33'),(2,'','beber2',2,'2023-11-14 16:09:04'),(3,'','beber',1,'2023-11-14 16:11:40'),(4,'3bxxu0QtgPPz61BaAACR','beber',1,'2023-11-14 16:11:49'),(5,'','beber',1,'2023-11-14 16:12:05'),(6,'Fn17s3GaqEtAeln8AACX','yuval',1,'2023-11-14 16:12:14'),(7,'','hi yuval',1,'2023-11-14 16:17:18'),(8,'jiMD3jycuRLk29fCAACh','hi beber',1,'2023-11-14 16:17:28'),(9,'','me',1,'2023-11-14 16:20:52'),(10,'Yuval Chen','asdfasf',1,'2023-11-14 16:32:35'),(11,'Yuval Chen','beber',1,'2023-11-14 16:32:49'),(12,'Beber Snir','hi',1,'2023-11-14 16:32:57'),(13,'Yuval Chen','hi hh',1,'2023-11-14 16:33:03'),(14,'','adsfdasf',1,'2023-11-14 16:33:47'),(15,'','sadas',1,'2023-11-14 16:34:28'),(16,'Unknown','advasdv',1,'2023-11-14 16:34:38'),(17,'','mymy',1,'2023-11-14 16:36:02'),(18,'','ggg',1,'2023-11-14 16:37:05'),(19,'','gf',1,'2023-11-14 16:37:31'),(20,'','sadasd',1,'2023-11-14 16:37:42'),(21,'BUf_w3HUpA2P7psdAAAJ','sadasd',1,'2023-11-14 16:38:49'),(22,'3','hi beber',1,'2023-11-14 16:40:09'),(23,'5','hi yuval',1,'2023-11-14 16:40:19'),(24,'3','zxc',1,'2023-11-14 16:41:30'),(25,'3','ggg',1,'2023-11-14 16:41:44'),(26,'3','ddd',1,'2023-11-14 16:41:50'),(27,'3','asd',1,'2023-11-14 16:41:54'),(28,'3','hi',1,'2023-11-14 16:47:40'),(29,'3','hi',1,'2023-11-14 16:48:22'),(30,'3','hi',1,'2023-11-14 16:48:44'),(31,'3','hi',1,'2023-11-14 16:48:51'),(32,'','fff',1,'2023-11-14 16:51:03'),(33,'hFESnnp5QfKQns0wAAAJ','sdf',1,'2023-11-14 16:51:07'),(34,'hFESnnp5QfKQns0wAAAJ','sfsd',1,'2023-11-14 16:51:10'),(35,'hFESnnp5QfKQns0wAAAJ','sfsd my socket',1,'2023-11-14 16:51:26'),(36,'','hi',1,'2023-11-14 16:54:02'),(37,'','hi',1,'2023-11-14 16:54:17'),(38,'','hi',1,'2023-11-15 03:01:15'),(39,'','hi',1,'2023-11-15 03:01:22'),(40,'','hi',1,'2023-11-15 03:03:51'),(41,'XUIgtFvtSClDm76QAAAV','hi',1,'2023-11-15 03:04:03'),(42,'','hi',2,'2023-11-15 03:16:43'),(43,'','wait',2,'2023-11-15 03:17:01'),(44,'','nope',2,'2023-11-15 03:17:21'),(45,'i3e174_V7gK_SGX7AAAY','nope',2,'2023-11-15 03:17:41');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nakama`
--

DROP TABLE IF EXISTS `nakama`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nakama` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `nakamaId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userKey_idx` (`userId`),
  CONSTRAINT `userKey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nakama`
--

LOCK TABLES `nakama` WRITE;
/*!40000 ALTER TABLE `nakama` DISABLE KEYS */;
/*!40000 ALTER TABLE `nakama` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(45) DEFAULT NULL,
  `lastName` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `role` varchar(45) DEFAULT 'user',
  `salt` varchar(200) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'snir','evgi','init@init.com','1234','user','1234','2023-11-11 13:00:40'),(2,'yuval','chen','init2@init.com','1234','admin','1234','2023-11-11 13:00:40'),(3,'Yuval','Chen','root@root.com','$2b$10$rIQzPtjxLJqXnSNmiIpMDu440kLkSEiUEG7gv9efRLADqFjk7mf/G','user','$2b$10$rIQzPtjxLJqXnSNmiIpMDu','2023-11-11 13:21:52'),(4,'Yuval','Chen','yuval@gmail.com','$2b$10$x2.PtgNP02GIKnRS/VMei.dtK6sppsXJV98/iv1aFmX5g/7U9ZrSG','user','$2b$10$x2.PtgNP02GIKnRS/VMei.','2023-11-12 15:53:55'),(5,'Beber','Snir','admin@gmail.com','$2b$10$snj6ITvHusH/Rwk.VezUWeBY/m/eK8/AZSrflSadGJix33RpzcYGS','user','$2b$10$snj6ITvHusH/Rwk.VezUWe','2023-11-14 16:16:52');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-15 18:16:25
