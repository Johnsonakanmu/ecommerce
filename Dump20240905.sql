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
-- Table structure for table `ordercarts`
--

DROP TABLE IF EXISTS `ordercarts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordercarts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL,
  `productId` int NOT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `productName` varchar(255) NOT NULL,
  `size` enum('XS','S','M','XL','XXL','3XL') DEFAULT NULL,
  `color` enum('Dark','Yellow','White','Red','Green','Blue','Sky','Gray') DEFAULT NULL,
  `productStock` int NOT NULL DEFAULT '0',
  `productPrice` decimal(10,2) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `orderId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  CONSTRAINT `ordercarts_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordercarts`
--

LOCK TABLES `ordercarts` WRITE;
/*!40000 ALTER TABLE `ordercarts` DISABLE KEYS */;
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
  `userId` varchar(255) NOT NULL,
  `productId` varchar(255) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'1','3','John','Doe','john.doe@example.com','123-456-7890','123 Elm St','Abeokuta','Nigeria',12345,'credit Card','FedEx','2024-09-05 11:50:43','2024-09-05 11:50:43'),(2,'2','3','Jane','Smith','jane.smith@example.com','098-765-4321','456 Oak St','Ibadan','Nigeria',67890,'credit Card','DHL','2024-09-05 11:50:43','2024-09-05 11:50:43');
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
  `productName` varchar(255) NOT NULL,
  `productCategories` enum('Cloths','Jersey','Sportswear') NOT NULL,
  `productBrand` varchar(255) DEFAULT NULL,
  `productWeight` varchar(255) DEFAULT NULL,
  `gender` enum('Men','Women','Other') DEFAULT NULL,
  `size` enum('XS','S','M','XL','XXL','3XL') DEFAULT NULL,
  `color` enum('Dark','Yellow','White','Red','Green','Blue','Sky','Gray') DEFAULT NULL,
  `description` text,
  `tagNumber` int DEFAULT NULL,
  `productStock` int NOT NULL DEFAULT '0',
  `tag` enum('Fashion','Clothes','Jersey') DEFAULT NULL,
  `productPrice` decimal(10,2) NOT NULL,
  `productDiscount` float DEFAULT NULL,
  `productTax` float DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `soldAmount` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Nigeria Jersey','Sportswear','Addidas','1','Men','M','White','Very good Jersey',78878,30,'Fashion',12.00,11,0,'image-1725532576899-nigeria-away jersey.jpeg','2024-09-05 10:36:16','2024-09-05 14:39:29',11),(2,'Nigeria Jersey','Jersey','NiKe','1','Men','S','Dark','Nice product',100009,100,'Fashion',30.00,25,8,'image-1725532688626-Nigeria j.jpeg','2024-09-05 10:38:08','2024-09-05 14:36:22',11),(3,'Tripple44fc','Cloths','Addidas','2kg','Other','M','Yellow','Nice',99991,9,'Fashion',40.00,30,0,'image-1725532766335-dolphins.jpg','2024-09-05 10:39:26','2024-09-05 14:36:31',1),(4,'3sc Jerser','Jersey','NiKe','1kg','Men','M','Yellow','Very nice Jersey',123,12,'Fashion',40.00,30,0,'image-1725540070432-Mens-New3.jpg','2024-09-05 12:41:10','2024-09-05 12:41:10',NULL),(5,'Tripple44fcs','Jersey','Addidas','2kg','Men','XS','Yellow','Good',1028787,12,'Clothes',30.00,23,5,'image-1725540666372-Mens-Jersey.jpg','2024-09-05 12:51:06','2024-09-05 13:34:40',NULL),(6,'Mens New Jersey','Cloths','Addidas','1','Other','M','Yellow','Nice one',90,12,'Fashion',20.00,10,2,'image-1725543912572-Mens-Kansas2.jpg','2024-09-05 13:45:12','2024-09-05 13:45:12',0),(7,'Dolpgin New Jersey','Sportswear','Addidas','1','Men','XS','Red','Nice one',90,6,'Fashion',30.00,29,2,'image-1725543998241-dolphins.jpg','2024-09-05 13:46:38','2024-09-05 14:52:43',1),(8,'Men New Jersey','Cloths','Addidas','1','Men','XS','Red','Nice one',90,6,'Fashion',15.00,13,2,'image-1725544055778-Mens-New3.jpg','2024-09-05 13:47:35','2024-09-05 14:52:29',1),(9,'Nigeria New Jersey','Jersey','Addidas','1','Other','XS','Red','Nice one',90,6,'Fashion',15.00,13,2,'image-1725544099191-Nigeria j.jpeg','2024-09-05 13:48:19','2024-09-05 13:48:19',0),(10,' Real Madira New Jersey','Cloths','Addidas','1','Women','XS','Red','Nice one',90,6,'Fashion',15.00,13,2,'image-1725544160185-jersy-3.jpeg','2024-09-05 13:49:20','2024-09-05 20:00:08',1),(12,' Man United New Jersey','Cloths','Addidas','1','Men','XXL','Yellow','Nice Jesery',90,6,'Fashion',15.00,13,2,'image-1725547816554-dolphins.jpg','2024-09-05 14:50:16','2024-09-05 14:50:16',0);
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
INSERT INTO `sequelizemeta` VALUES ('20240828215540-create-product.js'),('20240830073033-create-user.js'),('20240830073438-create-payment.js'),('20240902104929-create-order.js'),('20240903133820-create-order-cart.js');
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
  `sessionId` varchar(255) DEFAULT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,'John','Doe','john.doe@example.com','admin','123 Elm St','123-456-7890','Abeokuta','Nigeria',12345,'Ogun','true','2024-09-05 11:33:19','2024-09-05 11:33:19'),(2,NULL,'Jane','Smith','jane.smith@example.com','admin','456 Oak St','098-765-4321','Ibadan','Nigeria',67890,'Oyo','false','2024-09-05 11:33:19','2024-09-05 11:33:19');
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

-- Dump completed on 2024-09-05 21:10:18
