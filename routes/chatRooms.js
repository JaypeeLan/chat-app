const express = require('express');
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

const router = express.Router();

const roomSelect = 'name description isPrivate createdBy participants createdAt';

async function populateRoom(roomDoc) {
  if (!roomDoc) return null;
  return ChatRoom.findById(roomDoc._id)
    .populate('createdBy', 'username')
    .populate('participants', 'username');
}

// @desc    List public chat rooms
// @route   GET /api/rooms
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const rooms = await ChatRoom.find({
      $or: [
        { isPrivate: false },
        { participants: userId },
        { createdBy: userId }
      ]
    })
      .select(roomSelect)
      .populate('createdBy', 'username')
      .populate('participants', 'username');

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Create a chat room
// @route   POST /api/rooms
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;
    const room = await ChatRoom.create({
      name,
      description: description || '',
      isPrivate: Boolean(isPrivate),
      createdBy: req.user.id,
      participants: [req.user.id]
    });

    const populated = await populateRoom(room);

    res.status(201).json({
      success: true,
      data: populated
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Join a chat room (persisted membership)
// @route   POST /api/rooms/:id/join
// @access  Private
router.post('/:id/join', protect, async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    if (room.isPrivate) {
      const uid = String(req.user.id);
      const isCreator = String(room.createdBy) === uid;
      const isParticipant = room.participants.some((p) => String(p) === uid);
      if (!isCreator && !isParticipant) {
        return res.status(403).json({ success: false, message: 'Cannot join this room' });
      }
    }

    await ChatRoom.findByIdAndUpdate(req.params.id, {
      $addToSet: { participants: req.user.id }
    });

    const populated = await populateRoom(await ChatRoom.findById(req.params.id));

    res.status(200).json({
      success: true,
      data: populated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Leave a chat room (persisted membership)
// @route   POST /api/rooms/:id/leave
// @access  Private
router.post('/:id/leave', protect, async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    await ChatRoom.findByIdAndUpdate(req.params.id, {
      $pull: { participants: req.user.id }
    });

    const populated = await populateRoom(await ChatRoom.findById(req.params.id));

    res.status(200).json({
      success: true,
      data: populated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Get messages for a room
// @route   GET /api/rooms/:id/messages
// @access  Private
router.get('/:id/messages', protect, async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.id })
      .populate('sender', 'username')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Post a message to a room
// @route   POST /api/rooms/:id/messages
// @access  Private
router.post('/:id/messages', protect, async (req, res) => {
  try {
    const message = await Message.create({
      room: req.params.id,
      sender: req.user.id,
      content: req.body.content
    });

    const populatedMessage = await Message.findById(message._id).populate('sender', 'username');

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
