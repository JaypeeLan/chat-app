const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/auth');
const chatRoomRoutes = require('./routes/chatRooms');
const ChatRoom = require('./models/ChatRoom');

/** @type {Map<string, Map<string, { userId: string, username: string }>>} */
const roomPresence = new Map();

function getPresenceList(roomId) {
  const sockets = roomPresence.get(roomId);
  if (!sockets || sockets.size === 0) return [];
  const byUser = new Map();
  for (const { userId, username } of sockets.values()) {
    const key = String(userId);
    if (!byUser.has(key)) byUser.set(key, { userId: key, username });
  }
  return Array.from(byUser.values()).sort((a, b) =>
    a.username.localeCompare(b.username, undefined, { sensitivity: 'base' })
  );
}

function broadcastRoomPresence(io, roomId) {
  const users = getPresenceList(roomId);
  io.to(roomId).emit('roomPresence', { roomId, users });
}

function addSocketToPresence(roomId, socketId, userId, username) {
  if (!roomPresence.has(roomId)) roomPresence.set(roomId, new Map());
  roomPresence.get(roomId).set(socketId, {
    userId: String(userId),
    username: username || 'User'
  });
}

function removeSocketFromPresence(io, roomId, socketId) {
  const sockets = roomPresence.get(roomId);
  if (!sockets) return;
  sockets.delete(socketId);
  if (sockets.size === 0) roomPresence.delete(roomId);
  broadcastRoomPresence(io, roomId);
}

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app';

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Seed general room
const seedGeneralRoom = async () => {
  try {
    const roomExists = await ChatRoom.findOne({ name: 'General' });
    if (!roomExists) {
      const User = require('./models/User');
      let systemUser = await User.findOne({ username: 'system' });
      if (!systemUser) {
        systemUser = await User.create({
          username: 'system',
          email: 'system@chat.com',
          password: 'systempassword123' 
        });
      }
      await ChatRoom.create({
        name: 'General',
        description: 'Welcome to the general chat room!',
        createdBy: systemUser._id
      });
      console.log('Seeded General room.');
    }
  } catch (err) {
    console.error('Error seeding room:', err);
  }
};

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('New WebSocket connection:', socket.id);

  socket.on('joinRoom', ({ roomId, userId, username }) => {
    if (!roomId) return;
    const roomKey = String(roomId);
    socket.join(roomKey);
    addSocketToPresence(roomKey, socket.id, userId, username);
    broadcastRoomPresence(io, roomKey);
    console.log(`${username || userId} joined socket room: ${roomKey}`);

    socket.to(roomKey).emit('message', {
      user: 'System',
      text: `${username || 'Someone'} has joined the chat`,
      createdAt: new Date().toISOString()
    });
  });

  socket.on('leaveRoom', ({ roomId }) => {
    if (!roomId) return;
    const roomKey = String(roomId);
    socket.leave(roomKey);
    removeSocketFromPresence(io, roomKey, socket.id);
    console.log(`Socket left room: ${roomKey}`);
  });

  socket.on('chatMessage', ({ roomId, message }) => {
    if (!roomId || !message) return;
    io.to(String(roomId)).emit('message', message);
  });

  socket.on('disconnect', () => {
    for (const roomId of socket.rooms) {
      if (roomId === socket.id) continue;
      removeSocketFromPresence(io, roomId, socket.id);
    }
    console.log('User disconnected:', socket.id);
  });
});

// Basic Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', chatRoomRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    seedGeneralRoom();
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (but disconnected from MongoDB)`);
    });
  });
