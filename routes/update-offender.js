const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Update offender contact, address, and name by license number
router.put('/', (req, res) => {
  const { license, contact, address, name } = req.body;
  if (!license || (!contact && !address && !name)) {
    return res.status(400).json({ success: false, message: 'License number and at least one field to update are required.' });
  }
  let updates = [];
  let params = [];
  if (name) {
    updates.push('Name = ?');
    params.push(name);
  }
  if (contact) {
    updates.push('Contact_Number = ?');
    params.push(contact);
  }
  if (address) {
    updates.push('Address = ?');
    params.push(address);
  }
  params.push(license);
  const sql = `UPDATE Offenders SET ${updates.join(', ')} WHERE License_Number = ?`;
  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error.' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Offender not found.' });
    }
    res.json({ success: true, message: 'Details updated successfully.' });
  });
});

module.exports = router;
