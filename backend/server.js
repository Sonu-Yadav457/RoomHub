import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Initialize dotenv configuration to read our environment variables
dotenv.config();

const app = express();

// MIDDLEWARES
app.use(cors()); // Permits our React frontend on port 5173 to execute requests securely
app.use(express.json()); // Parses incoming HTTP bodies containing JSON content smoothly

// BASIC TEST ROUTE
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to JAC Delhi Empty Rooms Hub API Gateway!' });
});

// INITIALIZE LISTENING PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB(); // Establish database connection before accepting any requests
  console.log(`🛰️  Backend Engine cruising smoothly on port ${PORT} in development mode`);
});