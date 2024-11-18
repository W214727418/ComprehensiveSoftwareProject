/**
 * app.js
 * DO NOT ALTER THIS CODE
 */
const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Define the port to listen on

//
//NOTE: THE DATABASE CONNECTION PORT MUST BE DIFFERENT FROM THE APP.JS PORT. DATABASE PORT 3306 IS ALREADY CORRECT
//
//***REALLY BIG FUCKING WARNING: EXPRESS-SESSION'S MEMORYSTORE WILL LEAK MEMORY UNDER MOST CONDITIONS. THE INFLIGHT MODULE ALSO LEAKS MEMORY. DO NOT USE THEM */
//

const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');


// Middleware for parsing request bodies as JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files (e.g., stylesheets)

app.set('views', path.join(__dirname, 'views'));

app.use(session({

  secret: process.env.SECRET, //hey look dumbass, heres your fucking secret option. Its right here!!!! Why wont you use your magic compiler eyes you disabled fucking computer

  resave: false,

  saveUninitialized: true

}));


// Import and use the devices route
const users = require('./routes/patients.js');
app.use(users);

// Start the server
app.listen(port, () => {
  console.log(`App started and running on port ${port}`);
});

