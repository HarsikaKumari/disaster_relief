import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import chatService from '../services/chat.service';
import notificationService from '../services/notification.service';
import prisma from '../config/prisma';

export const setupSocket = (server: HttpServer) => {
  const io = new SocketServer(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
    },
  });

  // Store online users
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);

    // ========== JOIN ROOM ==========
    socket.on('join-room', ({ roomId, userId }) => {
      socket.join(roomId);
      onlineUsers.set(userId, { socketId: socket.id, roomId });
      
      // Notify others in room
      socket.to(roomId).emit('user-online', { userId });
      
      // Send online users list
      const roomUsers = Array.from(onlineUsers.values())
        .filter((u) => u.roomId === roomId)
        .map((u) => u.userId);
      socket.emit('online-users', roomUsers);
    });

    // ========== SEND MESSAGE ==========
    socket.on('send-message', async ({ roomId, senderId, content, type, mediaUrl }) => {
      try {
        const message = await chatService.sendMessage({
          roomId,
          senderId,
          content,
          type,
          mediaUrl,
        });

        // Broadcast to room
        io.to(roomId).emit('new-message', message);
        
        // Send notification to room members
        const room = await prisma.chatRoom.findUnique({
          where: { id: roomId },
          include: {
            members: {
              where: {
                userId: { not: senderId },
                isActive: true,
              },
            },
          },
        });

        if (room) {
          const memberIds = room.members.map((m) => m.userId);
          await notificationService.bulkCreateNotifications(memberIds, {
            type: 'MESSAGE',
            title: '💬 New Message',
            message: `New message in chat: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
            link: `/chat/${roomId}`,
            priority: 1,
          });
        }
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('message-error', { error: 'Failed to send message' });
      }
    });

    // ========== TYPING INDICATOR ==========
    socket.on('typing', ({ roomId, userId, isTyping }) => {
      socket.to(roomId).emit('user-typing', { userId, isTyping });
    });

    // ========== MARK AS READ ==========
    socket.on('mark-read', async ({ roomId, userId }) => {
      try {
        await chatService.markAsRead(roomId, userId);
        io.to(roomId).emit('messages-read', { userId });
      } catch (error) {
        console.error('Mark read error:', error);
      }
    });

    // ========== LEAVE ROOM ==========
    socket.on('leave-room', ({ roomId, userId }) => {
      socket.leave(roomId);
      onlineUsers.delete(userId);
      socket.to(roomId).emit('user-offline', { userId });
    });

    // ========== DISCONNECT ==========
    socket.on('disconnect', () => {
      for (const [userId, data] of onlineUsers) {
        if (data.socketId === socket.id) {
          onlineUsers.delete(userId);
          io.to(data.roomId).emit('user-offline', { userId });
          break;
        }
      }
      console.log('🔌 Client disconnected:', socket.id);
    });
  });

  return io;
};