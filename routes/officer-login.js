const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Officer login route
router.post('/', (req, res) => {
  const { badgeNumber } = req.body;
  if (!badgeNumber) {
    return res.json({ success: false, message: 'Badge number is required.' });
  }
  db.query(
    'SELECT * FROM Traffic_Officers WHERE Badge_Number = ?',
    [badgeNumber],
    (err, results) => {
      if (err) return res.json({ success: false, message: 'Database error.' });
      if (results.length === 0) {
        return res.json({ success: false, message: 'Invalid badge number.' });
      }
      // Set session variable for login
      req.session.loggedIn = true;
      req.session.badgeNumber = badgeNumber;
      res.json({ success: true });
    }
  );
});

module.exports = router;
