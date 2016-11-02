-- MySQL dump 10.13  Distrib 5.7.16, for Linux (x86_64)
--
-- Host: localhost    Database: Connected_Database
-- ------------------------------------------------------
-- Server version	5.7.16-0ubuntu0.16.04.1

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
-- Current Database: `Connected_Database`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `Connected` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `Connected`;

--
-- Table structure for table `Accounts`
--

DROP TABLE IF EXISTS `Accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Accounts` (
  `Account_number` int(11) NOT NULL,
  `Account_creation_date` date NOT NULL,
  `Credit_card_number` int(11) NOT NULL,
  PRIMARY KEY (`Account_number`,`Credit_card_number`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Accounts`
--

LOCK TABLES `Accounts` WRITE;
/*!40000 ALTER TABLE `Accounts` DISABLE KEYS */;
INSERT INTO `Accounts` VALUES (1,'2016-11-01',100000001),(2,'2016-11-01',100000002),(3,'2016-11-01',100000003),(4,'2016-11-01',100000004),(5,'2016-11-01',100000005),(6,'2016-11-01',100000006),(7,'2016-11-01',100000007),(8,'2016-11-01',100000008),(9,'2016-11-01',100000009),(10,'2016-11-01',100000010);
/*!40000 ALTER TABLE `Accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Advertisements_data`
--

DROP TABLE IF EXISTS `Advertisements_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Advertisements_data` (
  `AdvertisementId` int(11) NOT NULL,
  `EmployeeId` int(11) DEFAULT NULL,
  `Type` char(30) NOT NULL,
  `Date` date NOT NULL,
  `Company` char(30) NOT NULL,
  `Item_name` char(30) NOT NULL,
  `Content` text NOT NULL,
  `Unit_price` decimal(10,0) NOT NULL,
  `Number_of_available_units` int(11) NOT NULL,
  PRIMARY KEY (`AdvertisementId`),
  KEY `EmployeeId` (`EmployeeId`),
  CONSTRAINT `Advertisements_data_ibfk_1` FOREIGN KEY (`EmployeeId`) REFERENCES `Employee_data` (`Social_security_number`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Advertisements_data`
--

LOCK TABLES `Advertisements_data` WRITE;
/*!40000 ALTER TABLE `Advertisements_data` DISABLE KEYS */;
INSERT INTO `Advertisements_data` VALUES (1,100000000,'Car','2016-11-01','Company1','Car1','NEW CAR ITS GREAT',1000,10),(2,100000000,'Car','2016-11-01','Company1','Car1','NEW CAR ITS GREAT',1000,10),(3,100000000,'Car','2016-11-01','Company1','Car2','NEW CAR ITS GREAT',1000,10),(4,100000001,'Car','2016-11-01','Company2','Car3','NEW CAR ITS GREAT',1000,10),(5,100000002,'House','2016-11-01','Company3','House1','NEW HOUSE ITS GREAT',100000,10),(6,100000004,'Boat','2016-11-01','Company4','Boat1','NEW BOAT ITS GREAT',100,10),(7,100000004,'Car','2016-11-01','Company5','Car4','NEW CAR ITS GREAT',1010,10),(8,100000006,'Phone','2016-11-01','Company2','Phone1','NEW PHONE ITS GREAT',200,10),(9,100000007,'Phone','2016-11-01','Company4','Phone2','NEW PHONE ITS GREAT',500,10),(10,100000008,'Phone','2016-11-01','Company5','Phone3','NEW PHONE ITS GREAT',500,10);
/*!40000 ALTER TABLE `Advertisements_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Comments_data`
--

DROP TABLE IF EXISTS `Comments_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Comments_data` (
  `CommentId` int(11) NOT NULL,
  `PostId` int(11) DEFAULT NULL,
  `Date` date NOT NULL,
  `Content` text NOT NULL,
  `Author` int(11) DEFAULT NULL,
  PRIMARY KEY (`CommentId`),
  KEY `Author` (`Author`),
  KEY `PostId` (`PostId`),
  CONSTRAINT `Comments_data_ibfk_1` FOREIGN KEY (`Author`) REFERENCES `User` (`UserId`),
  CONSTRAINT `Comments_data_ibfk_2` FOREIGN KEY (`PostId`) REFERENCES `Posts_data` (`PostId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comments_data`
--

LOCK TABLES `Comments_data` WRITE;
/*!40000 ALTER TABLE `Comments_data` DISABLE KEYS */;
INSERT INTO `Comments_data` VALUES (1,1,'2016-11-01','content1',1),(2,2,'2016-11-01','content2',2),(3,3,'2016-11-01','content3',3),(4,4,'2016-11-01','content4',4),(5,5,'2016-11-01','content5',5),(6,6,'2016-11-01','content6',6),(7,7,'2016-11-01','content7',7),(8,8,'2016-11-01','content8',8),(9,9,'2016-11-01','content9',9),(10,10,'2016-11-01','content10',10);
/*!40000 ALTER TABLE `Comments_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Employee_data`
--

DROP TABLE IF EXISTS `Employee_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Employee_data` (
  `Social_security_number` int(11) NOT NULL,
  `Last_name` varchar(30) DEFAULT NULL,
  `First_name` varchar(30) DEFAULT NULL,
  `Address` char(30) DEFAULT NULL,
  `City` char(2) DEFAULT NULL,
  `State` char(2) DEFAULT NULL,
  `Zipcode` int(5) DEFAULT NULL,
  `Telephone` varchar(15) DEFAULT NULL,
  `Start_date` date NOT NULL,
  `Hourly_rate` int(11) NOT NULL,
  PRIMARY KEY (`Social_security_number`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Employee_data`
--

LOCK TABLES `Employee_data` WRITE;
/*!40000 ALTER TABLE `Employee_data` DISABLE KEYS */;
INSERT INTO `Employee_data` VALUES (100000000,'EmployeeLast1','EmployeeFirst1','Address1','C1','S1',12345,'999-999-9999','2016-11-01',10),(100000001,'EmployeeLast2','EmployeeFirst2','Address1','C2','S2',10001,'999-999-9998','2016-11-01',10),(100000002,'EmployeeLast3','EmployeeFirst3','Address3','C3','S3',10002,'999-999-9997','2016-11-01',10),(100000003,'EmployeeLast4','EmployeeFirst4','Address4','C4','S4',10003,'999-999-9996','2016-11-01',10),(100000004,'EmployeeLast5','EmployeeFirst5','Address5','C5','S5',10004,'999-999-9995','2016-11-01',10),(100000005,'EmployeeLast6','EmployeeFirst6','Address6','C6','S6',10005,'999-999-9994','2016-11-01',10),(100000006,'EmployeeLast7','EmployeeFirst7','Address7','C7','S7',10006,'999-999-9993','2016-11-01',10),(100000007,'EmployeeLast8','EmployeeFirst8','Address8','C8','S8',10007,'999-999-9992','2016-11-01',10),(100000008,'EmployeeLast9','EmployeeFirst9','Address9','C9','S9',10008,'999-999-9991','2016-11-01',10),(100000009,'EmployeeLast10','EmployeeFirst10','Address10','C1','S1',10009,'999-999-9990','2016-11-01',10);
/*!40000 ALTER TABLE `Employee_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Friends`
--

DROP TABLE IF EXISTS `Friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Friends` (
  `User1` int(11) NOT NULL,
  `User2` int(11) NOT NULL,
  PRIMARY KEY (`User1`,`User2`),
  KEY `User2` (`User2`),
  CONSTRAINT `Friends_ibfk_1` FOREIGN KEY (`User1`) REFERENCES `User` (`UserId`),
  CONSTRAINT `Friends_ibfk_2` FOREIGN KEY (`User2`) REFERENCES `User` (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Friends`
--

LOCK TABLES `Friends` WRITE;
/*!40000 ALTER TABLE `Friends` DISABLE KEYS */;
INSERT INTO `Friends` VALUES (10,1),(1,2),(2,3),(3,4),(4,5),(5,6),(6,7),(7,8),(8,9),(9,10);
/*!40000 ALTER TABLE `Friends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Groups_data`
--

DROP TABLE IF EXISTS `Groups_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Groups_data` (
  `GroupId` int(11) NOT NULL,
  `Group_name` varchar(30) DEFAULT NULL,
  `Type` varchar(20) NOT NULL,
  `Owner` int(11) DEFAULT NULL,
  PRIMARY KEY (`GroupId`),
  KEY `Owner` (`Owner`),
  CONSTRAINT `Groups_data_ibfk_1` FOREIGN KEY (`Owner`) REFERENCES `User` (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Groups_data`
--

LOCK TABLES `Groups_data` WRITE;
/*!40000 ALTER TABLE `Groups_data` DISABLE KEYS */;
INSERT INTO `Groups_data` VALUES (1,'group1','club',1),(2,'group2','club',2),(3,'group3','club',3),(4,'group4','club',4),(5,'group5','club',5),(6,'group6','club',6),(7,'group7','club',7),(8,'group8','club',8),(9,'group9','club',9),(10,'group10','club',10);
/*!40000 ALTER TABLE `Groups_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Joins`
--

DROP TABLE IF EXISTS `Joins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Joins` (
  `Stat` enum('accepted','rejected','pending') DEFAULT NULL,
  `UserId` int(11) NOT NULL,
  `GroupId` int(11) NOT NULL,
  PRIMARY KEY (`UserId`,`GroupId`),
  KEY `GroupId` (`GroupId`),
  CONSTRAINT `Joins_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `User` (`UserId`),
  CONSTRAINT `Joins_ibfk_2` FOREIGN KEY (`GroupId`) REFERENCES `Groups_data` (`GroupId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Joins`
--

LOCK TABLES `Joins` WRITE;
/*!40000 ALTER TABLE `Joins` DISABLE KEYS */;
INSERT INTO `Joins` VALUES ('accepted',1,2),('rejected',1,3),('pending',1,5),('accepted',1,7),('rejected',2,9),('pending',3,6),('accepted',4,8),('rejected',5,9),('accepted',6,10),('pending',7,2);
/*!40000 ALTER TABLE `Joins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Messages_data`
--

DROP TABLE IF EXISTS `Messages_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Messages_data` (
  `MessageId` int(11) NOT NULL,
  `Date` date NOT NULL,
  `Subject` char(255) DEFAULT NULL,
  `Content` text NOT NULL,
  `Sender` int(11) DEFAULT NULL,
  `Receiver` int(11) DEFAULT NULL,
  PRIMARY KEY (`MessageId`),
  KEY `Sender` (`Sender`),
  KEY `Receiver` (`Receiver`),
  CONSTRAINT `Messages_data_ibfk_1` FOREIGN KEY (`Sender`) REFERENCES `User` (`UserId`),
  CONSTRAINT `Messages_data_ibfk_2` FOREIGN KEY (`Receiver`) REFERENCES `User` (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Messages_data`
--

LOCK TABLES `Messages_data` WRITE;
/*!40000 ALTER TABLE `Messages_data` DISABLE KEYS */;
INSERT INTO `Messages_data` VALUES (1,'2016-11-01','Subject1','Content1',1,2),(2,'2016-11-01','Subject2','Content2',2,3),(3,'2016-11-01','Subject3','Content3',3,4),(4,'2016-11-01','Subject4','Content4',4,5),(5,'2016-11-01','Subject5','Content5',5,6),(6,'2016-11-01','Subject6','Content6',6,7),(7,'2016-11-01','Subject7','Content7',7,8),(8,'2016-11-01','Subject8','Content8',8,9),(9,'2016-11-01','Subject9','Content9',9,10),(10,'2016-11-01','Subject10','Content10',10,1);
/*!40000 ALTER TABLE `Messages_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Pages`
--

DROP TABLE IF EXISTS `Pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Pages` (
  `PageId` int(11) NOT NULL,
  `Owner` int(11) DEFAULT NULL,
  `Associated_group` int(11) DEFAULT NULL,
  `Post_count` int(11) NOT NULL,
  PRIMARY KEY (`PageId`),
  KEY `Owner` (`Owner`),
  KEY `Associated_group` (`Associated_group`),
  CONSTRAINT `Pages_ibfk_1` FOREIGN KEY (`Owner`) REFERENCES `User` (`UserId`),
  CONSTRAINT `Pages_ibfk_2` FOREIGN KEY (`Associated_group`) REFERENCES `Groups_data` (`GroupId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pages`
--

LOCK TABLES `Pages` WRITE;
/*!40000 ALTER TABLE `Pages` DISABLE KEYS */;
INSERT INTO `Pages` VALUES (1,1,1,10),(2,2,2,16),(3,3,3,17),(4,4,4,3),(5,5,5,10),(6,6,6,6),(7,7,7,7),(8,8,8,9),(9,9,9,17),(10,10,10,10);
/*!40000 ALTER TABLE `Pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Posts_data`
--

DROP TABLE IF EXISTS `Posts_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Posts_data` (
  `PostId` int(11) NOT NULL,
  `PageId` int(11) DEFAULT NULL,
  `Post_date` date NOT NULL,
  `Content` text NOT NULL,
  `Comment_count` int(11) NOT NULL,
  PRIMARY KEY (`PostId`),
  KEY `PageId` (`PageId`),
  CONSTRAINT `Posts_data_ibfk_1` FOREIGN KEY (`PageId`) REFERENCES `Pages` (`PageId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Posts_data`
--

LOCK TABLES `Posts_data` WRITE;
/*!40000 ALTER TABLE `Posts_data` DISABLE KEYS */;
INSERT INTO `Posts_data` VALUES (1,1,'2016-11-01','content1',4),(2,2,'2016-11-01','content2',5),(3,3,'2016-11-01','content3',4),(4,4,'2016-11-01','content4',2),(5,5,'2016-11-01','content5',7),(6,6,'2016-11-01','content6',42),(7,7,'2016-11-01','content7',9),(8,8,'2016-11-01','content8',11),(9,9,'2016-11-01','content9',31),(10,10,'2016-11-01','content10',6);
/*!40000 ALTER TABLE `Posts_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Requests_friends`
--

DROP TABLE IF EXISTS `Requests_friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Requests_friends` (
  `Stat` enum('accepted','rejected','pending') DEFAULT NULL,
  `Sender` int(11) NOT NULL,
  `Receiver` int(11) NOT NULL,
  PRIMARY KEY (`Sender`,`Receiver`),
  KEY `Receiver` (`Receiver`),
  CONSTRAINT `Requests_friends_ibfk_1` FOREIGN KEY (`Sender`) REFERENCES `User` (`UserId`),
  CONSTRAINT `Requests_friends_ibfk_2` FOREIGN KEY (`Receiver`) REFERENCES `User` (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Requests_friends`
--

LOCK TABLES `Requests_friends` WRITE;
/*!40000 ALTER TABLE `Requests_friends` DISABLE KEYS */;
INSERT INTO `Requests_friends` VALUES ('accepted',1,2),('rejected',1,3),('pending',1,5),('accepted',1,7),('rejected',2,9),('pending',3,6),('accepted',4,8),('rejected',5,9),('accepted',6,10),('pending',7,2);
/*!40000 ALTER TABLE `Requests_friends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sales_data`
--

DROP TABLE IF EXISTS `Sales_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Sales_data` (
  `TransactionId` int(11) NOT NULL,
  `Sale_date_time` datetime NOT NULL,
  `AdvertisementId` int(11) DEFAULT NULL,
  `Number_of_units` int(11) NOT NULL,
  `Account_number` int(11) DEFAULT NULL,
  PRIMARY KEY (`TransactionId`),
  KEY `AdvertisementId` (`AdvertisementId`),
  KEY `Account_number` (`Account_number`),
  CONSTRAINT `Sales_data_ibfk_1` FOREIGN KEY (`AdvertisementId`) REFERENCES `Advertisements_data` (`AdvertisementId`),
  CONSTRAINT `Sales_data_ibfk_2` FOREIGN KEY (`Account_number`) REFERENCES `Accounts` (`Account_number`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sales_data`
--

LOCK TABLES `Sales_data` WRITE;
/*!40000 ALTER TABLE `Sales_data` DISABLE KEYS */;
INSERT INTO `Sales_data` VALUES (1,'2016-11-01 17:07:26',1,10,1),(2,'2016-11-01 17:07:26',2,10,2),(3,'2016-11-01 17:07:26',3,10,3),(4,'2016-11-01 17:07:26',4,10,4),(5,'2016-11-01 17:07:26',5,10,5),(6,'2016-11-01 17:07:26',6,10,6),(7,'2016-11-01 17:07:26',7,10,7),(8,'2016-11-01 17:07:26',8,10,8),(9,'2016-11-01 17:07:26',9,10,9),(10,'2016-11-01 17:07:26',10,10,10);
/*!40000 ALTER TABLE `Sales_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `UserId` int(11) NOT NULL,
  `First_name` varchar(30) NOT NULL,
  `Last_name` varchar(30) NOT NULL,
  `Address` varchar(30) DEFAULT NULL,
  `City` varchar(10) DEFAULT NULL,
  `State` varchar(2) DEFAULT NULL,
  `Zip_code` int(5) DEFAULT NULL,
  `Telephone` varchar(15) DEFAULT NULL,
  `Email` varchar(30) NOT NULL,
  `Preferences` varchar(255) DEFAULT NULL,
  `Rating` int(11) DEFAULT NULL,
  `Account_number` int(11) NOT NULL,
  PRIMARY KEY (`UserId`,`Account_number`),
  KEY `Account_number` (`Account_number`),
  CONSTRAINT `User_ibfk_1` FOREIGN KEY (`Account_number`) REFERENCES `Accounts` (`Account_number`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'first1','last1','address1','city1','NY',10001,'631-568-0001','1@gmail.com','preference1',5,1),(2,'first2','last2','address2','city2','NY',10002,'631-568-0002','2@gmail.com','preference2',6,2),(3,'first3','last3','address3','city3','NY',10003,'631-568-0003','3@gmail.com','preference3',4,3),(4,'first4','last4','address4','city4','NY',10004,'631-568-0004','4@gmail.com','preference4',5,4),(5,'first5','last5','address5','city5','NY',10005,'631-568-0005','5@gmail.com','preference5',7,5),(6,'first6','last6','address6','city6','NY',10006,'631-568-0006','6@gmail.com','preference6',8,6),(7,'first7','last7','address7','city7','NY',10007,'631-568-0007','7@gmail.com','preference7',4,7),(8,'first8','last8','address8','city8','NY',10008,'631-568-0008','8@gmail.com','preference8',1,8),(9,'first9','last9','address9','city9','NY',10009,'631-568-0009','9@gmail.com','preference9',9,9),(10,'first10','last10','address10','city10','NY',10010,'631-568-0010','10@gmail.com','preference10',5,10);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-11-01 17:08:15
