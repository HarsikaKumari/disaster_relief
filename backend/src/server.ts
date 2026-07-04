import http from 'http';
import app, { setIo } from './app';
import { Server as SocketServer } from 'socket.io';
import prisma from './config/prisma';

const server = http.createServer(app);

// Setup Socket.io
const io = new SocketServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
});

// ✅ Set io in app
setIo(io);

// ✅ Export io for other files
export { io };

// Store online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('🟢 Client connected:', socket.id);

  socket.on('join-room', ({ roomId, userId }) => {
    socket.join(roomId);
    onlineUsers.set(userId, { socketId: socket.id, roomId });
    console.log(`User ${userId} joined room ${roomId}`);
  });

  // ========== SEND MESSAGE ==========
socket.on('send-message', async (data) => {
  try {
    const { roomId, senderId, content, type, mediaUrl } = data;

    // ✅ Ensure type is set, default to TEXT
    const messageType = type || 'TEXT';

    const message = await prisma.chatMessage.create({
      data: {
        roomId,
        senderId,
        content,
        type: messageType,
        mediaUrl: mediaUrl || null,
        isRead: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    await prisma.chatRoom.update({
      where: { id: roomId },
      data: {
        lastMessage: content,
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      },
    });

    io.to(roomId).emit('new-message', message);
  } catch (error) {
    console.error('Send message error:', error);
    socket.emit('message-error', { error: 'Failed to send message' });
  }
});
  socket.on('typing', ({ roomId, userId, isTyping }) => {
    socket.to(roomId).emit('user-typing', { userId, isTyping });
  });

  socket.on('mark-read', async ({ roomId, userId }) => {
    try {
      await prisma.chatMessage.updateMany({
        where: {
          roomId,
          isRead: false,
          senderId: {
            not: userId,
          },
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });
      io.to(roomId).emit('messages-read', { userId });
    } catch (error) {
      console.error('Mark read error:', error);
    }
  });
// ========== MARK MESSAGES AS READ ==========
socket.on('mark-read', async ({ roomId, userId }) => {
  try {
    // ✅ Update all unread messages in this room for this user
    const updated = await prisma.chatMessage.updateMany({
      where: {
        roomId,
        isRead: false,
        senderId: {
          not: userId, // Don't mark own messages as read
        },
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    // ✅ Emit to room that messages are read
    io.to(roomId).emit('messages-read', { 
      userId, 
      roomId,
      count: updated.count,
    });
  } catch (error) {
    console.error('Mark read error:', error);
  }
});
  socket.on('disconnect', () => {
    for (const [userId, data] of onlineUsers) {
      if (data.socketId === socket.id) {
        onlineUsers.delete(userId);
        io.to(data.roomId).emit('user-offline', { userId });
        break;
      }
    }
    console.log('🔴 Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.io ready on port ${PORT}`);
});