CREATE TABLE Accounts(
	Account_number INTEGER,
	Account_creation_date DATE NOT NULL,
	Credit_card_number INTEGER,
	PRIMARY KEY(Account_number,Credit_card_number)
);


CREATE TABLE User (
UserId INTEGER,
First_name VARCHAR(30) NOT NULL,
Last_name VARCHAR(30) NOT NULL,
Address VARCHAR(30),
City VARCHAR(10),
State VARCHAR(2),
Zip_code INTEGER(5),
Telephone VARCHAR(15),
Email VARCHAR(30) NOT NULL,
Preferences VARCHAR(255),
Rating INTEGER,
Account_number Integer,
FOREIGN KEY(Account_number) REFERENCES Accounts(Account_number),
PRIMARY KEY (UserId,Account_number)
);


CREATE TABLE Groups_data(
GroupId INTEGER,
Group_name VARCHAR(30),
Type VARCHAR(20) NOT NULL,
Owner INTEGER,
PRIMARY KEY (GroupId),
FOREIGN KEY (Owner) REFERENCES User(UserId)
);


CREATE TABLE Pages(
PageId INTEGER,
Owner INTEGER,
Associated_group INTEGER,
Post_count INTEGER NOT NULL,
PRIMARY KEY(PageId),
FOREIGN KEY (Owner) REFERENCES User(UserId),
FOREIGN KEY (Associated_group) REFERENCES Groups_data(GroupId)
);


CREATE TABLE Posts_data(
PostId INTEGER,
PageId INTEGER,
	Post_date DATE NOT NULL,
	Content TEXT NOT NULL,
	Comment_count INTEGER NOT NULL,
	FOREIGN KEY (PageId) REFERENCES Pages(PageId),
	PRIMARY KEY (PostId)
);

CREATE TABLE Requests_friends(
Stat ENUM('accepted','rejected','pending'),
Sender INTEGER,
Receiver INTEGER,
PRIMARY KEY (Sender,Receiver),
FOREIGN KEY (Sender) REFERENCES User(UserId),
FOREIGN KEY (Receiver) REFERENCES User(Userid)
);
CREATE TABLE Comments_data(
	CommentId INTEGER,
	PostId INTEGER,
Date DATE NOT NULL,
Content TEXT NOT NULL,
Author INTEGER,
FOREIGN KEY(Author) REFERENCES User(UserId),
FOREIGN KEY(PostId) REFERENCES Posts_data(PostId),
PRIMARY KEY(CommentId)
);
CREATE TABLE Messages_data(
	MessageId INTEGER,
Date DATE NOT NULL,
Subject CHAR(255),
Content TEXT NOT NULL,
Sender INTEGER,
Receiver INTEGER,
FOREIGN KEY(Sender) REFERENCES User(UserId),
FOREIGN KEY(Receiver) REFERENCES User(UserId),
PRIMARY KEY(MessageId)
);

CREATE TABLE Employee_data(
Social_security_number INTEGER,
Last_name VARCHAR(30),
First_name VARCHAR(30),
Address CHAR(30),
City CHAR(2),
State CHAR(2),
Zipcode INTEGER(5),
Telephone VARCHAR(15),
Start_date DATE NOT NULL,
Hourly_rate INTEGER NOT NULL,
PRIMARY KEY(Social_security_number)
);


CREATE TABLE Friends(
	User1 INTEGER,
	User2 INTEGER,
	FOREIGN KEY(User1) REFERENCES User(UserId),
	FOREIGN KEY(User2) REFERENCES User(UserId),
	PRIMARY KEY(User1, User2)
);


CREATE TABLE Joins(
Stat ENUM('accepted','rejected','pending'),
UserId INTEGER,
GroupId INTEGER,
FOREIGN KEY (UserId) REFERENCES User(UserId),
FOREIGN KEY (GroupId) REFERENCES Groups_data(GroupId),
PRIMARY KEY (UserId,GroupId)
);
CREATE TABLE Advertisements_data(
 	AdvertisementId INTEGER,
EmployeeId INTEGER,
Type CHAR(30) NOT NULL,
Date DATE NOT NULL,
Company CHAR(30) NOT NULL,
Item_name CHAR(30) NOT NULL,
Content TEXT NOT NULL,
Unit_price DECIMAL NOT NULL,
Number_of_available_units INTEGER NOT NULL,
	FOREIGN KEY(EmployeeId) REFERENCES Employee_data(Social_security_number),
	PRIMARY KEY(AdvertisementId)
);
CREATE TABLE Sales_data(
	TransactionId INTEGER,
        	Sale_date_time DATETIME NOT NULL,
AdvertisementId INTEGER,
Number_of_units INTEGER NOT NULL,
Account_number INTEGER,
FOREIGN KEY(AdvertisementId) REFERENCES Advertisements_data(AdvertisementId),
FOREIGN KEY(Account_number) REFERENCES Accounts(Account_number),
PRIMARY KEY(TransactionId)
);
