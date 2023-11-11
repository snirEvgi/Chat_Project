CREATE SCHEMA `chat` ;


CREATE TABLE `chat`.`users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(45) DEFAULT NULL,
  `lastName` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `role` varchar(45) DEFAULT 'user',
  `salt` varchar(200) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  UNIQUE KEY `email_UNIQUE` (`email`),
  PRIMARY KEY (`id`)
);




INSERT INTO `chat`.`users` (`firstName`, `lastName`,`email`,`password`,`role`,`salt`) VALUES ('snir', 'evgi','init@init.com','1234','user','1234'),('yuval', 'chen','init2@init.com','1234','admin','1234');
