//Import every modules we need

//Web framework for APIs
import express from 'express';

//MYSQL for Node.js
import mysql from 'mysql';

//Cors for cors origin resources
import cors from 'cors';

//Middleware for parsing request bodies
import bodyParser from 'body-parser';

//Module for sen emails
import nodemailer from 'nodemailer';

import { exec } from 'child_process';

import dotenv from 'dotenv';
dotenv.config({ path: 'emailSend.env' });

const app = express();

//Port number of the server
const port = 3001;

//JSON data prase
app.use(bodyParser.json());

//Enable all cors
app.use(cors());

//MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'uni project'
});

//Handle errors in database connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

//Setup nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `stech3552@gmail.com`,
    pass: 'gqsz unyy tbxz zdbx'
  }
});

//Function to send login notification email

//Load environment variables to send emails
// require('dotenv').config({ path: 'emailSend.env' }); 

//Sending details of the email
const sendLoginNotification = (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Login Notification',
    text: 'You have logged into the system.',
    html: '<b>You have logged into the system.</b>'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Login notification email sent successfully:', info.response);
    }
  });
};

//Endpoint to fetch(retriev data) all users
app.get('/register', (req, res) => {

  //Select all users from the table
  const query = 'SELECT * FROM register';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);

      //Server error
      res.status(500).json({ message: 'Error fetching users' });
    } else {
      res.json(results);
    }
  });
});

//Endpoint to register a new user
app.post('/register', (req, res) => {

  //get user details from the form body
  const { name, nic, email, username, password } = req.body;

  //Check if username or email already exists
  const checkQuery = 'SELECT * FROM register WHERE username = ? OR email = ?';
  db.query(checkQuery, [username, email], (err, results) => {
    if (err) {
      console.error('Error checking for existing user:', err);
      res.status(500).json({ message: 'Error checking for existing user' });
    } else if (results.length > 0) {
      console.warn('Username or email exists');

      //Conflicting error
      res.status(409).json({ message: 'Username or email already exists' });
    } else {
      //Insert new user into the database
      const query = 'INSERT INTO register (name, nic, email, username, password) VALUES (?, ?, ?, ?, ?)';

      db.query(query, [name, nic, email, username, password], (err, result) => {
        if (err) {
          console.error('Error registering user:', err);
          res.status(500).json({ message: 'Error registering user' });
        } else {
          console.log('User registered successfully:', result);
          res.status(201).json({ message: 'User registered successfully' });
        }
      });
    }
  });
});

//Endpoint to fetch a specific user by username
app.get('/register/:username', (req, res) => {
  const { username } = req.params;
  const query = 'SELECT * FROM register WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      res.status(500).json({ message: 'Error fetching user' });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json(results[0]);
    }
  });
});

//Endpoint to update user details (only username, password, and email can be updated)
app.put('/register/:username', (req, res) => {
  const { username, password, email } = req.body;

  const query = 'UPDATE register SET password = ?, email = ? WHERE username = ?';
  db.query(query, [password, email, username], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ message: 'Error updating user' });
    } else if (result.affectedRows > 0) {
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
});

// Endpoint to login a user
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM register WHERE username = ? AND password = ?';

  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error logging in user:', err);
      res.status(500).json({ message: 'Error logging in user' });
    } else if (results.length > 0) {
      console.log('Login successful:', results);
      
      //Send confirmation email
      sendLoginNotification(results[0].email);

      res.json({
        status: 'success',
        message: 'Login successful',
        username: results[0].username
      });
    } else {
      console.warn('Invalid username or password');

      //Authentication error
      res.status(401).json({ status: 'error', message: 'Invalid username or password' });
    }
  });
});

// Endpoint to handle vehicle entry
app.post('/entry', (req, res) => {
  const { vehicleNumber, contactNumber } = req.body;
  const inCharge = req.headers.username;

  // Check if the vehicle number already exists and has no exit time recorded
  db.query('SELECT * FROM vehicle WHERE vehicle_number = ?', [vehicleNumber], (err, results) => {
    if (err) {
      console.error('Error checking vehicle number:', err);
      return res.status(500).json({ message: 'Error checking vehicle number' });
    }

    // If the vehicle already exists and hasn't exited, return an error message
    if (results.length > 0 && !results[0].exit_time) {
      return res.status(400).json({ message: 'Vehicle number already exists' });
    }

    // Insert a new entry into the 'vehicle' table with current date and time
    const query = 'INSERT INTO vehicle (vehicle_number, contact_number, entry_time, entry_by) VALUES (?, ?, NOW(), ?)';
    db.query(query, [vehicleNumber, contactNumber, inCharge], (err, result) => {
      if (err) {
        console.error('Error during entry:', err);
        res.status(500).json({ message: 'Error during entry' });
      } else {
        console.log('Vehicle entry recorded successfully:', result);
        res.status(201).json({ message: 'Vehicle entry recorded successfully' });
      }
    });
  });
});

// Endpoint to handle vehicle exit
app.post('/exit', (req, res) => {
  const { vehicleNumber } = req.body;
  const exitBy = req.headers.username;

  // Check if the vehicle exists and has not exited yet
  db.query('SELECT * FROM vehicle WHERE vehicle_number = ? AND exit_time IS NULL', [vehicleNumber], (err, results) => {
    if (err) {
      console.error('Error checking vehicle number for exit:', err);
      return res.status(500).json({ message: 'Error checking vehicle number for exit' });
    }

    // If the vehicle is not found or already exited, return an error message
    if (results.length === 0) {

      //Not found error
      return res.status(404).json({ message: 'Vehicle not found or already exited' });
    }

    // Update the 'vehicle' table with the exit time and user who performed the exit
    const query = 'UPDATE vehicle SET exit_time = NOW(), exit_by = ? WHERE vehicle_number = ? AND exit_time IS NULL';
    db.query(query, [exitBy, vehicleNumber], (err, result) => {
      if (err) {
        console.error('Error during exit:', err);
        res.status(500).json({ message: 'Error during exit' });
      } else if (result.affectedRows > 0) {
        console.log('Vehicle exit recorded successfully:', result);
        res.status(200).json({ message: 'Vehicle exit recorded successfully' });
      } else {
        res.status(404).json({ message: 'Vehicle not found or already exited' });
      }
    });
  });
});

// Endpoint to fetch all vehicles
app.get('/vehicles', (req, res) => {
  const query = 'SELECT vehicle_number, contact_number, entry_time, exit_time, entry_by, exit_by FROM vehicle';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching vehicle data:', err);
      res.status(500).json({ message: 'Error fetching vehicle data' });
    } else {
      res.json(results);
    }
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


// =============================================================================================
// Endpoint to detecting number plate

app.post('/capture-vehicle-number', (req, res) => {
  // Path to the Python script
  const { script } = req.body;

  // Execute the Python script
  exec(`python ${script}`, (error, stdout, stderr) => {
      if (error) {
          console.error(`Error executing Python script: ${error.message}`);
          return res.status(500).json({ message: 'Error executing OCR script' });
      }
      if (stderr) {
          console.error(`Error in OCR script: ${stderr}`);
          return res.status(500).json({ message: 'Error in OCR script' });
      }
      
      // Assuming the script prints the recognized vehicle number to stdout
      const vehicleNumber = stdout.trim();
      res.json({ vehicleNumber });
  });
});