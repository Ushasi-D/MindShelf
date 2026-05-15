// backend/src/server.js
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// connect DB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running: http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Server failed to start', err);
});
