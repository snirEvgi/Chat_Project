CREATE DATABASE  IF NOT EXISTS `chat` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `chat`;
-- MySQL dump 10.13  Distrib 8.0.34, for macos13 (x86_64)
--
-- Host: 127.0.0.1    Database: chat
-- ------------------------------------------------------
-- Server version	8.2.0

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
  `firstUserName` varchar(45) DEFAULT NULL,
  `secondUserName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`chatId`),
  KEY `firstUserId` (`firstUserId`),
  KEY `secondUserId` (`secondUserId`),
  CONSTRAINT `fk_firstUserId` FOREIGN KEY (`firstUserId`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_secondUserId` FOREIGN KEY (`secondUserId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chats`
--

LOCK TABLES `chats` WRITE;
/*!40000 ALTER TABLE `chats` DISABLE KEYS */;
INSERT INTO `chats` VALUES (1,34567,34567,'snir','yuval'),(2,34567,34567,'demo','demo'),(3,6,3,'snirevg@gmail.com','root@root.com'),(4,6,4,'snirevg@gmail.com','yuval@gmail.com');
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
  `name` varchar(45) DEFAULT NULL,
  `text` varchar(450) DEFAULT NULL,
  `room` int DEFAULT NULL,
  `time` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `chatId` (`room`),
  KEY `fk_senderId` (`name`),
  CONSTRAINT `fk_chatId` FOREIGN KEY (`room`) REFERENCES `chats` (`chatId`)
) ENGINE=InnoDB AUTO_INCREMENT=220 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (193,'snire','sssss',2,'12:12:12 PM'),(194,'snire','asasassasa',2,'22:15:23 PM'),(195,'root@root.com','s',1,'7:10:48 PM'),(196,'root@root.com','sup',2,'7:11:41 PM'),(197,'root@root.com','yo',2,'7:13:49 PM'),(198,'root@root.com','a',2,'7:14:43 PM'),(199,'root@root.com','a',2,'7:15:41 PM');
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'snir','evgi','init@init.com','1234','user','1234','2023-11-11 13:00:40'),(2,'yuval','chen','init2@init.com','1234','admin','1234','2023-11-11 13:00:40'),(3,'Yuval','Chen','root@root.com','$2b$10$rIQzPtjxLJqXnSNmiIpMDu440kLkSEiUEG7gv9efRLADqFjk7mf/G','user','$2b$10$rIQzPtjxLJqXnSNmiIpMDu','2023-11-11 13:21:52'),(4,'Yuval','Chen','yuval@gmail.com','$2b$10$x2.PtgNP02GIKnRS/VMei.dtK6sppsXJV98/iv1aFmX5g/7U9ZrSG','user','$2b$10$x2.PtgNP02GIKnRS/VMei.','2023-11-12 15:53:55'),(5,'Beber','Snir','admin@gmail.com','$2b$10$snj6ITvHusH/Rwk.VezUWeBY/m/eK8/AZSrflSadGJix33RpzcYGS','user','$2b$10$snj6ITvHusH/Rwk.VezUWe','2023-11-14 16:16:52'),(6,'Snir','Evgi','snirevg@gmail.com','$2b$10$3Ia1AJnWNOUHiax0r49PzOp/6VI1l5.sBJAxGpka3p303lzZYaDW6','user','$2b$10$3Ia1AJnWNOUHiax0r49PzO','2023-11-19 17:41:27');
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

-- Dump completed on 2023-11-20 23:39:12
