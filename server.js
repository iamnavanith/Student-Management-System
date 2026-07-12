const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const db = require('./src/config/db.js');
const adminRoutes = require('./src/routes/adminRoutes');
const studentRoutes = require('./src/routes/studentRoutes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mount Central App Routers
app.use('/', adminRoutes);
app.use('/', studentRoutes);

app.get('/', (req, res) => {
    res.redirect('/login');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("===============================================");
    console.log("Server is successfully running on Port: " + PORT);
    console.log("Open your browser and visit: http://localhost:" + PORT);
    console.log("===============================================");
});