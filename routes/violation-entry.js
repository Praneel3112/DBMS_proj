const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Route to handle police officer entering a fine
router.post('/', (req, res) => {
  const { regNum, violationType, location, penalty, date, officerId } = req.body;

  if (!regNum || !violationType || !location || !penalty || !date || !officerId) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  // Normalize registration number
  const normalizedRegNum = regNum.trim().toUpperCase();

  // Step 1: Get Vehicle_ID and Offender_ID
  const vehicleQuery = `
  SELECT Vehicles.Vehicle_ID, Offenders.Offender_ID
  FROM Vehicles
  JOIN Offenders ON Vehicles.Offender_ID = Offenders.Offender_ID
  WHERE TRIM(UPPER(Vehicles.Registration_Number)) = TRIM(UPPER(?))
`;

  db.query(vehicleQuery, [normalizedRegNum], (err, result) => {
    if (err) {
      console.error("DB Error during vehicle lookup:", err);
      return res.status(500).json({ message: "Database error during vehicle lookup." });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Vehicle not found." });
    }

    const { Vehicle_ID, Offender_ID } = result[0];

    // Step 2: Insert into Violations
    const insertViolation = `
      INSERT INTO Violations (
        Offender_ID, Vehicle_ID, Violation_Type, Violation_Date, Location, Penalty_Amount, Officer_ID
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(insertViolation, [Offender_ID, Vehicle_ID, violationType, date, location, penalty, officerId], (err, violationRes) => {
      if (err) {
        console.error("Error inserting violation:", err.sqlMessage || err);
        return res.status(500).json({ message: "Error inserting violation." });
      }

      const violationId = violationRes.insertId;

      // Step 3: Insert into Fines
      const dueDate = new Date(date);
      dueDate.setDate(dueDate.getDate() + 15); // Set due date to 15 days later

      const insertFine = `
        INSERT INTO Fines (Violation_ID, Offender_ID, Amount, Due_Date, Payment_Status, Late_Fee)
        VALUES (?, ?, ?, ?, 'Unpaid', 0)
      `;

      db.query(insertFine, [violationId, Offender_ID, penalty, dueDate], (err, fineRes) => {
        if (err) {
          console.error("Error inserting fine:", err.sqlMessage || err);
          return res.status(500).json({ message: "Error inserting fine." });
        }
        // Step 4: Calculate total unpaid fines for this vehicle
        const totalUnpaidSql = `
          SELECT SUM(Amount) AS totalUnpaid
          FROM Fines f
          JOIN Violations v ON f.Violation_ID = v.Violation_ID
          WHERE v.Vehicle_ID = ? AND f.Payment_Status = 'Unpaid'
        `;
        db.query(totalUnpaidSql, [Vehicle_ID], (sumErr, sumRes) => {
          if (sumErr) {
            console.error("Error calculating total unpaid fines:", sumErr);
            return res.status(200).json({ message: "Violation and fine added successfully!", totalUnpaid: null });
          }
          const totalUnpaid = sumRes[0].totalUnpaid || 0;
          return res.status(200).json({ message: "Violation and fine added successfully!", totalUnpaid });
        });
      });
    });
  });
});

module.exports = router;
