-- Insert into Offenders
INSERT INTO Offenders (Name, License_Number, Address, Contact_Number) VALUES
('Anil Mehra', 'DL20231234', '123 Connaught Place, Delhi', '9876543210'),
('Sunita Joshi', 'MH20239876', '78 Marine Drive, Mumbai', '9876501234'),
('Karthik Reddy', 'KA20234567', '56 BTM Layout, Bangalore', '9123456780'),
('Deepika Nair', 'TN20231230', '12 Anna Nagar, Chennai', '9012345678'),
('Aamir Khan', 'RJ20237890', '45 MI Road, Jaipur', '9988776655');

-- Insert into Vehicles
INSERT INTO Vehicles (Registration_Number, Owner_Name, Vehicle_type, Model, Color, Offender_ID) VALUES
('DL1C1234', 'Anil Mehra', 'Car', 'Hyundai i20', 'Red', 1),
('MH2A4321', 'Sunita Joshi', 'Scooter', 'Honda Activa', 'Black', 2),
('KA5B6789', 'Karthik Reddy', 'Car', 'Toyota Innova', 'Silver', 3),
('TN9Z4321', 'Deepika Nair', 'Bike', 'Bajaj Pulsar', 'Blue', 4),
('RJ3T7654', 'Aamir Khan', 'Truck', 'Tata LPT', 'White', 5);

-- Insert into Traffic_Officers
INSERT INTO Traffic_Officers (Name, Badge_Number, Rank_num, Station, Contact) VALUES
('Inspector Rajeev', 'INSP001', 'Inspector', 'Karol Bagh Station, Delhi', '8881234567'),
('SI Neha Singh', 'SI002', 'Sub-Inspector', 'Juhu Station, Mumbai', '8891234567'),
('Constable Manoj', 'CONST003', 'Constable', 'BTM Police Station, Bangalore', '8901234567'),
('Inspector Kavita', 'INSP004', 'Inspector', 'Anna Nagar PS, Chennai', '8911234567'),
('Constable Ravi', 'CONST005', 'Constable', 'MI Road PS, Jaipur', '8921234567');

-- Insert into Violations
INSERT INTO Violations (Offender_ID, Vehicle_ID, Violation_Type, Violation_Date, Location, Penalty_Amount, Officer_ID) VALUES
(1, 1, 'Overspeeding', '2024-03-01', 'NH-24, Delhi', 2500.00, 1),
(2, 2, 'Helmetless Riding', '2024-03-02', 'Marine Drive, Mumbai', 500.00, 2),
(3, 3, 'Signal Jumping', '2024-03-03', 'Silk Board, Bangalore', 1500.00, 3),
(4, 4, 'Wrong Parking', '2024-03-04', 'T Nagar, Chennai', 1000.00, 4),
(5, 5, 'Overloading', '2024-03-05', 'Tonk Road, Jaipur', 1200.00, 5);

-- Insert into Fines
INSERT INTO Fines (Violation_ID, Offender_ID, Amount, Due_Date, Payment_Status, Late_Fee) VALUES
(1, 1, 2500.00, '2024-03-10', 'Unpaid', 0.00),
(2, 2, 500.00, '2024-03-12', 'Paid', 0.00),
(3, 3, 1500.00, '2024-03-14', 'Unpaid', 100.00),
(4, 4, 1000.00, '2024-03-16', 'Paid', 0.00),
(5, 5, 1200.00, '2024-03-18', 'Unpaid', 150.00);

-- Insert into Payments
INSERT INTO Payments (Fine_ID, Payment_Date, Amount_Paid, Payment_Method, Transaction_ID) VALUES
(2, '2024-03-11', 500.00, 'Cash', 'TXN0001'),
(4, '2024-03-15', 1000.00, 'Online', 'TXN0002');

-- Insert into Cameras
INSERT INTO Cameras (Location, Installed_Date, Last_Maintenance_Date) VALUES
('NH-24, Delhi', '2023-01-01', '2024-01-01'),
('Marine Drive, Mumbai', '2023-02-01', '2024-02-01'),
('Silk Board, Bangalore', '2023-03-01', '2024-03-01'),
('T Nagar, Chennai', '2023-04-01', '2024-04-01'),
('Tonk Road, Jaipur', '2023-05-01', '2024-05-01');

-- Insert into Camera_Violations
INSERT INTO Camera_Violations (Camera_ID, Violation_ID, camera_location) VALUES
(1, 1, 'NH-24, Delhi'),
(2, 2, 'Marine Drive, Mumbai'),
(3, 3, 'Silk Board, Bangalore'),
(4, 4, 'T Nagar, Chennai'),
(5, 5, 'Tonk Road, Jaipur');