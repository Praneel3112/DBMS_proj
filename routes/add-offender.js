const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', (req, res) => {
  const { name, license, address, contact, fineAmount, regNum } = req.body;
  if (!name || !license || !address || !contact || !fineAmount || !regNum || isNaN(fineAmount) || Number(fineAmount) <= 0) {
    return res.json({ success: false, message: 'All fields are required and fine amount must be valid.' });
  }
  // Step 1: Check if offender exists
  db.query('SELECT * FROM Offenders WHERE License_Number = ?', [license], (offErr, offRes) => {
    if (offErr) return res.json({ success: false, message: 'Database error.' });
    let offenderId;
    if (offRes.length > 0) {
      // Offender exists, use existing
      offenderId = offRes[0].Offender_ID;
    } else {
      // Insert new offender
      return db.query(
        'INSERT INTO Offenders (Name, License_Number, Address, Contact_Number) VALUES (?, ?, ?, ?)',
        [name, license, address, contact],
        (err, result) => {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              return res.json({ success: false, message: 'License number already exists.' });
            }
            return res.json({ success: false, message: 'Database error.' });
          }
          addVehicleAndFine(result.insertId);
        }
      );
    }
    addVehicleAndFine(offenderId);
    function addVehicleAndFine(offenderId) {
      // Step 2: Check if vehicle exists for this offender
      db.query('SELECT * FROM Vehicles WHERE Registration_Number = ?', [regNum], (vehErr, vehRes) => {
        if (vehErr) return res.json({ success: false, message: 'Error checking vehicle.' });
        let vehicleId;
        if (vehRes.length > 0) {
          vehicleId = vehRes[0].Vehicle_ID;
        } else {
          // Insert new vehicle
          return db.query(
            'INSERT INTO Vehicles (Registration_Number, Owner_Name, Vehicle_type, Model, Color, Offender_ID) VALUES (?, ?, ?, ?, ?, ?)',
            [regNum, name, 'Unknown', 'Unknown', 'Unknown', offenderId],
            (vehErr2, vehRes2) => {
              if (vehErr2) return res.json({ success: false, message: 'Error creating vehicle.' });
              vehicleId = vehRes2.insertId;
              addViolationAndFine(vehicleId);
            }
          );
        }
        addViolationAndFine(vehicleId);
      });
      function addViolationAndFine(vehicleId) {
        // Insert a violation
        db.query(
          'INSERT INTO Violations (Offender_ID, Vehicle_ID, Violation_Type, Violation_Date, Location, Penalty_Amount, Officer_ID) VALUES (?, ?, ?, CURDATE(), ?, ?, ?)',
          [offenderId, vehicleId, 'Manual Entry', 'Unknown', fineAmount, 1],
          (vioErr, vioRes) => {
            if (vioErr) return res.json({ success: false, message: 'Error creating violation.' });
            const violationId = vioRes.insertId;
            // Insert a fine
            db.query(
              'INSERT INTO Fines (Violation_ID, Offender_ID, Amount, Due_Date, Payment_Status, Late_Fee) VALUES (?, ?, ?, DATE_ADD(CURDATE(), INTERVAL 15 DAY), ?, ?)',
              [violationId, offenderId, fineAmount, 'Unpaid', 0],
              (fineErr, fineRes) => {
                if (fineErr) return res.json({ success: false, message: 'Error creating fine.' });
                res.json({ success: true, regNum });
              }
            );
          }
        );
      }
    }
  });
});

module.exports = router;
