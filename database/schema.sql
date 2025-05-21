-- Create database and use it
USE Trafficproject;

-- Offenders Table
CREATE TABLE Offenders (
    Offender_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    License_Number VARCHAR(50) UNIQUE NOT NULL,
    Address TEXT NOT NULL,
    Contact_Number VARCHAR(15) NOT NULL
);

-- Vehicles Table
CREATE TABLE Vehicles (
    Vehicle_ID INT PRIMARY KEY AUTO_INCREMENT,
    Registration_Number VARCHAR(20) UNIQUE NOT NULL,
    Owner_Name VARCHAR(100) NOT NULL,
    Vehicle_type VARCHAR(100) NOT NULL,
    Model VARCHAR(100) NOT NULL,
    Color VARCHAR(50) NOT NULL,
    Offender_ID INT NOT NULL,
    FOREIGN KEY (Offender_ID) REFERENCES Offenders(Offender_ID)
);

-- Traffic Officers Table
CREATE TABLE Traffic_Officers (
    Officer_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Badge_Number VARCHAR(50) UNIQUE NOT NULL,
    Rank_num VARCHAR(50) NOT NULL,
    Station VARCHAR(100) NOT NULL,
    Contact VARCHAR(15) NOT NULL
);

-- Violations Table
CREATE TABLE Violations (
    Violation_ID INT PRIMARY KEY AUTO_INCREMENT,
    Offender_ID INT NOT NULL,
    Vehicle_ID INT NOT NULL,
    Violation_Type VARCHAR(100) NOT NULL,
    Violation_Date DATE NOT NULL,
    Location VARCHAR(255) NOT NULL,
    Penalty_Amount DECIMAL(10,2) NOT NULL,
    Officer_ID INT NOT NULL,
    FOREIGN KEY (Offender_ID) REFERENCES Offenders(Offender_ID),
    FOREIGN KEY (Vehicle_ID) REFERENCES Vehicles(Vehicle_ID),
    FOREIGN KEY (Officer_ID) REFERENCES Traffic_Officers(Officer_ID)
);

-- Fines Table
CREATE TABLE Fines (
    Fine_ID INT PRIMARY KEY AUTO_INCREMENT,
    Violation_ID INT NOT NULL,
    Offender_ID INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    Due_Date DATE NOT NULL,
    Payment_Status VARCHAR(100),
    Late_Fee DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (Violation_ID) REFERENCES Violations(Violation_ID),
    FOREIGN KEY (Offender_ID) REFERENCES Offenders(Offender_ID)
);

-- Payments Table
CREATE TABLE Payments (
    Payment_ID INT PRIMARY KEY AUTO_INCREMENT,
    Fine_ID INT NOT NULL,
    Payment_Date DATE NOT NULL,
    Amount_Paid DECIMAL(10,2) NOT NULL,
    Payment_Method VARCHAR(100) NOT NULL,
    Transaction_ID VARCHAR(50) UNIQUE NOT NULL,
    FOREIGN KEY (Fine_ID) REFERENCES Fines(Fine_ID)
);

-- Cameras Table
CREATE TABLE Cameras (
    Camera_ID INT PRIMARY KEY AUTO_INCREMENT,
    Location VARCHAR(255) NOT NULL,
    Installed_Date DATE NOT NULL,
    Last_Maintenance_Date DATE NOT NULL
);

-- Camera Violations Table
CREATE TABLE Camera_Violations (
    CameraViolation_ID INT PRIMARY KEY AUTO_INCREMENT,
    Camera_ID INT NOT NULL,
    Violation_ID INT NOT NULL,
    camera_location VARCHAR(100) NOT NULL,
    FOREIGN KEY (Camera_ID) REFERENCES Cameras(Camera_ID),
    FOREIGN KEY (Violation_ID) REFERENCES Violations(Violation_ID)
);