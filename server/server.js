import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import http from 'http';  // Import HTTP module to attach socket.io
import { Server as SocketIOServer } from 'socket.io'; // Correct import for socket.io

import userRoutes from './routes/usersRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentsRoutes from './routes/commentsRoutes.js';
import denRoutes from './routes/denRoutes.js';
import votesRoute from './routes/voteRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app); // Use HTTP server to initialize socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000",  // Adjust frontend URL here
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api', denRoutes);
app.use('/api', votesRoute);

// Health Check
app.get('/api/status', (req, res) => {
  res.json({ status: "OK", uptime: process.uptime() });
});

// Socket.io Events
io.on('connection', (socket) => {
  console.log('a user connected: ', socket.id);

  // Listen for messages from clients and broadcast to all connected clients
  socket.on('message', (data) => {
    console.log('Message received:', data);
    io.emit('message', data);  // Emit to all connected clients
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log('Error connecting to MongoDB:', error.message));
