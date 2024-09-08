-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: order_jersey_db
-- ------------------------------------------------------
-- Server version	8.0.37

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
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ProductName` varchar(255) DEFAULT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (7,'Jersey Men, women & Kids','Nice Jersey for Women and Kids','2024-09-06 09:06:43','2024-09-06 09:06:43',0),(8,'Cap and Hat','Nice Cap and Hat','2024-09-06 09:07:08','2024-09-06 09:07:08',0);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordercarts`
--

DROP TABLE IF EXISTS `ordercarts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordercarts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int NOT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `productName` varchar(255) DEFAULT NULL,
  `size` enum('XS','S','M','XL','XXL','3XL') DEFAULT NULL,
  `color` enum('Dark','Yellow','White','Red','Green','Blue','Sky','Gray') DEFAULT NULL,
  `quantity` int DEFAULT '0',
  `price` decimal(10,2) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `productId` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordercarts`
--

LOCK TABLES `ordercarts` WRITE;
/*!40000 ALTER TABLE `ordercarts` DISABLE KEYS */;
INSERT INTO `ordercarts` VALUES (1,3,NULL,NULL,NULL,NULL,2,60.00,30.00,'2024-09-08 14:25:09','2024-09-08 15:06:13',2),(2,3,NULL,NULL,NULL,NULL,5,60.00,12.00,'2024-09-08 14:37:36','2024-09-08 15:09:56',1),(3,3,NULL,NULL,NULL,NULL,1,40.00,40.00,'2024-09-08 14:37:50','2024-09-08 14:37:50',3),(4,3,NULL,NULL,NULL,NULL,1,40.00,40.00,'2024-09-08 14:38:01','2024-09-08 14:38:01',4),(5,3,NULL,NULL,NULL,NULL,6,180.00,30.00,'2024-09-08 14:46:10','2024-09-08 15:34:38',5),(6,3,'image-1725543998241-dolphins.jpg','Dolpgin New Jersey','XS','Red',1,30.00,30.00,'2024-09-08 15:07:26','2024-09-08 15:07:26',7),(7,3,'image-1725544160185-jersy-3.jpeg',' Real Madira New Jersey','XS','Red',1,15.00,15.00,'2024-09-08 15:14:24','2024-09-08 15:14:24',10);
/*!40000 ALTER TABLE `ordercarts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `postal_code` int DEFAULT NULL,
  `shipping_method` varchar(255) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,'John','Doe','john.doe@example.com','123-456-7890','123 Elm St','Abeokuta','Nigeria',12345,'credit Card','FedEx','2024-09-05 11:50:43','2024-09-05 11:50:43'),(2,2,'Jane','Smith','jane.smith@example.com','098-765-4321','456 Oak St','Ibadan','Nigeria',67890,'credit Card','DHL','2024-09-05 11:50:43','2024-09-05 11:50:43'),(3,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-09-07 21:14:17','2024-09-07 21:14:17');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL,
  `productId` varchar(255) NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `payment_method` enum('credit_card','PayPal','bank_transfer') NOT NULL,
  `amount` int NOT NULL,
  `payment_status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productName` varchar(255) DEFAULT NULL,
  `productBrand` varchar(255) DEFAULT NULL,
  `gender` enum('Men','Women','Other') DEFAULT NULL,
  `size` enum('XS','S','M','XL','XXL','3XL') DEFAULT NULL,
  `color` enum('Dark','Yellow','White','Red','Green','Blue','Sky','Gray') DEFAULT NULL,
  `description` text,
  `tagNumber` int DEFAULT NULL,
  `quantity` int DEFAULT '0',
  `price` decimal(10,2) DEFAULT NULL,
  `discount` float DEFAULT NULL,
  `tax` float DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `soldAmount` int DEFAULT NULL,
  `categoryId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Nigeria Jersey','Addidas','Women','M','White','Very good Jersey',78878,30,12.00,11,0,'image-1725532576899-nigeria-away jersey.jpeg','2024-09-05 10:36:16','2024-09-07 19:18:42',11,13,0),(2,'Nigeria Jersey','NiKe','Men','S','Dark','Nice product',100009,100,30.00,25,8,'image-1725532688626-Nigeria j.jpeg','2024-09-05 10:38:08','2024-09-05 14:36:22',11,0,0),(3,'Tripple44fc','Addidas','Other','M','Yellow','Nice',99991,9,40.00,30,0,'image-1725532766335-dolphins.jpg','2024-09-05 10:39:26','2024-09-05 14:36:31',1,0,0),(4,'3sc Jerser','NiKe','Men','M','Yellow','Very nice Jersey',123,12,40.00,30,0,'image-1725540070432-Mens-New3.jpg','2024-09-05 12:41:10','2024-09-05 12:41:10',NULL,0,0),(5,'Tripple44fcs','Addidas','Men','XS','Yellow','Good',1028787,12,30.00,23,5,'image-1725540666372-Mens-Jersey.jpg','2024-09-05 12:51:06','2024-09-05 13:34:40',NULL,0,0),(6,'Mens New Jersey','Addidas','Other','M','Yellow','Nice one',90,12,20.00,10,2,'image-1725543912572-Mens-Kansas2.jpg','2024-09-05 13:45:12','2024-09-05 13:45:12',0,0,0),(7,'Dolpgin New Jersey','Addidas','Men','XS','Red','Nice one',90,6,30.00,29,2,'image-1725543998241-dolphins.jpg','2024-09-05 13:46:38','2024-09-05 14:52:43',1,0,0),(8,'Men New Jersey','Addidas','Men','XS','Red','Nice one',90,6,15.00,13,2,'image-1725544055778-Mens-New3.jpg','2024-09-05 13:47:35','2024-09-05 14:52:29',1,0,0),(9,'Nigeria New Jersey','Addidas','Other','XS','Red','Nice one',90,6,15.00,13,2,'image-1725544099191-Nigeria j.jpeg','2024-09-05 13:48:19','2024-09-05 13:48:19',0,0,0),(10,' Real Madira New Jersey','Addidas','Women','XS','Red','Nice one',90,6,15.00,13,2,'image-1725544160185-jersy-3.jpeg','2024-09-05 13:49:20','2024-09-05 20:00:08',1,0,0),(13,'Niger Jersey','Addidas','Men','M','Yellow','Niger Jesery',9898,20,20.00,0,0,'image-1725616396964-Mens-Kansas2.jpg','2024-09-06 09:53:16','2024-09-06 09:53:16',0,7,0),(17,'Hat and Cap','Addidas','Men','XXL','White','Nice',2232,12,12.00,11,0,'image-1725623066012-Mens-New3.jpg','2024-09-06 11:44:26','2024-09-06 11:44:26',0,8,0),(18,'Tripple44fc','Addidas','Men','M','Yellow','Goood',34223,23,30.00,29,0,'image-1725625090254-Mens-Jersey.jpg','2024-09-06 12:18:10','2024-09-06 12:18:10',0,7,0),(19,'Tripple44fc','Addidas','Men','XXL','White','Goood',34223,23,30.00,29,0,'image-1725625249030-Mens-Jersey.jpg','2024-09-06 12:20:49','2024-09-06 12:20:49',0,7,0),(23,'3sc Jerser','Addidas','Men','S','Yellow','Good',121,10,12.00,10,0,'image-1725739149731-jersey-4.jpeg','2024-09-07 19:59:09','2024-09-07 19:59:09',0,13,1);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20240828215540-create-product.js'),('20240830073033-create-user.js'),('20240830073438-create-payment.js'),('20240902104929-create-order.js'),('20240903133820-create-order-cart.js'),('20240906055807-create-category.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `postal_code` int DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `isactive` enum('true','false') DEFAULT 'true',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'John','Doe','john.doe@example.com','admin','123 Elm St','123-456-7890','Abeokuta','Nigeria',12345,'Ogun','true','2024-09-05 11:33:19','2024-09-05 22:06:59'),(2,'Jane','Smith','jane.smith@example.com','admin','456 Oak St','098-765-4321','Ibadan','Nigeria',67890,'Oyo','false','2024-09-05 11:33:19','2024-09-05 22:06:59'),(3,'Johnson','Shola','johnson@gmail.com','admin',NULL,NULL,NULL,NULL,NULL,NULL,'true','2024-09-07 17:23:52','2024-09-07 17:23:52'),(4,'Johnson','Shola','johnson123@gmail.com','$2a$10$tWGeHxdXVCLGxZazFDekT.cxBPt.0jPsy7FHgIVTfhErvrZ0VLvcC',NULL,NULL,NULL,NULL,NULL,NULL,'true','2024-09-07 17:46:43','2024-09-07 17:46:43');
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

-- Dump completed on 2024-09-08 18:07:22
