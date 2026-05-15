// backend/src/controllers/healthController.js
const mongoose = require('mongoose');
const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];

exports.getHealth = (req, res) => {
  res.json({
    status: 'ok',
    db: states[mongoose.connection.readyState] || 'unknown',
    time: new Date().toISOString()
  });
};
