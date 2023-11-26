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
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chats`
--

LOCK TABLES `chats` WRITE;
/*!40000 ALTER TABLE `chats` DISABLE KEYS */;
INSERT INTO `chats` VALUES (71,6,5,'Snir Evgi','Beber Snir'),(72,6,1,'Snir Evgi','Admin Admin');
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
) ENGINE=InnoDB AUTO_INCREMENT=255 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (254,'Beber Snir','asdasdasd',71,'2:10:59');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

CREATE TABLE IF NOT EXISTS group_chats (
  group_chat_id INT AUTO_INCREMENT PRIMARY KEY,
  chat_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_chat_name (chat_name)
);

CREATE TABLE IF NOT EXISTS group_chat_members (
  group_chat_id INT,
  user_id INT,  -- Change this line to use INT type
  FOREIGN KEY (group_chat_id) REFERENCES group_chats(group_chat_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE  
);

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
INSERT INTO `users` VALUES (1,'Admin','Admin','init@init.com','1234','user','1234','2023-11-11 13:00:40'),(2,'Stas','Shubaev','init2@init.com','1234','admin','1234','2023-11-11 13:00:40'),(3,'Maor','Sheiman','root@root.com','$2b$10$rIQzPtjxLJqXnSNmiIpMDu440kLkSEiUEG7gv9efRLADqFjk7mf/G','user','$2b$10$rIQzPtjxLJqXnSNmiIpMDu','2023-11-11 13:21:52'),(4,'Yuval','Chen','yuval@gmail.com','$2b$10$x2.PtgNP02GIKnRS/VMei.dtK6sppsXJV98/iv1aFmX5g/7U9ZrSG','user','$2b$10$x2.PtgNP02GIKnRS/VMei.','2023-11-12 15:53:55'),(5,'Beber','Snir','admin@gmail.com','$2b$10$snj6ITvHusH/Rwk.VezUWeBY/m/eK8/AZSrflSadGJix33RpzcYGS','user','$2b$10$snj6ITvHusH/Rwk.VezUWe','2023-11-14 16:16:52'),(6,'Snir','Evgi','snirevg@gmail.com','$2b$10$3Ia1AJnWNOUHiax0r49PzOp/6VI1l5.sBJAxGpka3p303lzZYaDW6','user','$2b$10$3Ia1AJnWNOUHiax0r49PzO','2023-11-19 17:41:27');
INSERT INTO group_chats (chat_name) VALUES (?) ;
SELECT LAST_INSERT_ID() AS group_chat_id;
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

-- Dump completed on 2023-11-24  2:54:38
