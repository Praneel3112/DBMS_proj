const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Helper: Insert vehicle if not exists
function ensureVehicle(regNum, cb) {
  const normalizedReg = regNum.trim().toUpperCase();
  db.query('SELECT * FROM Vehicles WHERE TRIM(UPPER(Registration_Number)) = ?', [normalizedReg], (err, res) => {
    if (err) return cb(err);
    if (res.length > 0) return cb(null, res[0]);
    // Insert with default values
    db.query(
      'INSERT INTO Offenders (Name, License_Number, Address, Contact_Number) VALUES (?, ?, ?, ?)',
      [
        'Default User',
        'LIC' + Math.floor(Math.random() * 1000000),
        'Unknown Address',
        '0000000000'
      ],
      (offErr, offRes) => {
        if (offErr) return cb(offErr);
        const offenderId = offRes.insertId;
        db.query(
          'INSERT INTO Vehicles (Registration_Number, Owner_Name, Vehicle_type, Model, Color, Offender_ID) VALUES (?, ?, ?, ?, ?, ?)',
          [normalizedReg, 'Default User', 'Unknown', 'Unknown', 'Unknown', offenderId],
          (vehErr, vehRes) => {
            if (vehErr) return cb(vehErr);
            db.query('SELECT * FROM Vehicles WHERE Vehicle_ID = ?', [vehRes.insertId], (err2, res2) => {
              if (err2) return cb(err2);
              cb(null, res2[0]);
            });
          }
        );
      }
    );
  });
}

router.post('/', (req, res) => {
  const { regNum, fineAmount } = req.body;
  if (!regNum || !fineAmount) {
    return res.json({ success: false, message: 'Registration number and fine amount required.' });
  }
  ensureVehicle(regNum, (vehErr, vehicle) => {
    if (vehErr) return res.json({ success: false, message: 'Error ensuring vehicle.' });
    // Insert violation
    db.query(
      'INSERT INTO Violations (Offender_ID, Vehicle_ID, Violation_Type, Violation_Date, Location, Penalty_Amount, Officer_ID) VALUES (?, ?, ?, CURDATE(), ?, ?, ?)',
      [vehicle.Offender_ID, vehicle.Vehicle_ID, 'Manual Entry', 'Unknown', fineAmount, 1],
      (vioErr, vioRes) => {
        if (vioErr) return res.json({ success: false, message: 'Error adding violation.' });
        // Insert fine
        db.query(
          'INSERT INTO Fines (Violation_ID, Offender_ID, Amount, Due_Date, Payment_Status, Late_Fee) VALUES (?, ?, ?, DATE_ADD(CURDATE(), INTERVAL 15 DAY), ?, ?)',
          [vioRes.insertId, vehicle.Offender_ID, fineAmount, 'Unpaid', 0],
          (fineErr, fineRes) => {
            if (fineErr) return res.json({ success: false, message: 'Error adding fine.' });
            // Calculate total unpaid fines for this vehicle
            db.query(
              `SELECT SUM(Amount) AS totalUnpaid
               FROM Fines f
               JOIN Violations v ON f.Violation_ID = v.Violation_ID
               WHERE v.Vehicle_ID = ? AND f.Payment_Status = 'Unpaid'`,
              [vehicle.Vehicle_ID],
              (sumErr, sumRes) => {
                if (sumErr) return res.json({ success: true, message: 'Fine added, but could not calculate total unpaid.', totalUnpaid: null });
                const totalUnpaid = sumRes[0].totalUnpaid || 0;
                res.json({ success: true, totalUnpaid });
              }
            );
          }
        );
      }
    );
  });
});

module.exports = router;
