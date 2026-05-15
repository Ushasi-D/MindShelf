// backend/src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

//user routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

//app.use("/api/users", require("./routes/userRoutes"));

//notes api
const noteRoutes = require('./routes/noteRoutes');
app.use('/api/notes', noteRoutes);


// simple base route
app.get('/', (req, res) => res.send('MindShelf backend alive'));

// health route
const healthRoutes = require('./routes/healthRoutes');
app.use('/api/health', healthRoutes);

module.exports = app;
