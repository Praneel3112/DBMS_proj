const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const app = express();
const db = require('./config/db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'traffic-fine-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// Serve login.html as homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Protect index.html and officer.html
app.get(['/index.html', '/officer.html'], (req, res, next) => {
  if (req.session && req.session.loggedIn) {
    return res.sendFile(path.join(__dirname, 'public', req.path));
  } else {
    return res.redirect('/');
  }
});

app.use(express.static(path.join(__dirname, 'public')));

// Routes
const finesRoute = require('./routes/fines');
const violationEntryRoute = require('./routes/violation-entry');
const addFineRoute = require('./routes/add-fine');
const addOffenderRoute = require('./routes/add-offender');
const officerLoginRoute = require('./routes/officer-login');
const updateOffenderRoute = require('./routes/update-offender');

app.use('/api/fines', finesRoute);
app.use('/api/violation-entry', violationEntryRoute);
app.use('/api/add-fine', addFineRoute);
app.use('/api/add-offender', addOffenderRoute);
app.use('/api/officer-login', officerLoginRoute);
app.use('/api/update-offender', updateOffenderRoute);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚦 Server running on http://localhost:${PORT}`);
});
