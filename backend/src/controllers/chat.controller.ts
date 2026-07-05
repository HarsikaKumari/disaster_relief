import { Request, Response } from 'express';
import prisma from '../config/prisma';
import chatService from '../services/chat.service';

export class ChatController {
  // ========== GET USER CHAT ROOMS ==========
  async getRooms(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const rooms = await chatService.getUserChatRooms(userId);

      res.status(200).json({
        success: true,
        data: rooms || [],
        message: rooms?.length ? 'Chat rooms fetched' : 'No chat rooms found',
      });
    } catch (error: any) {
      console.error('Get rooms error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get chat rooms',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  }

  // ========== GET CHAT ROOM ==========
  async getRoom(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { roomId } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const room = await chatService.getChatRoom(roomId, userId);

      res.status(200).json({
        success: true,
        data: room,
      });
    } catch (error: any) {
      console.error('Get room error:', error);
      res.status(error.message === 'Chat room not found' ? 404 : 500).json({
        success: false,
        message: error.message || 'Failed to get chat room',
      });
    }
  }

  // ========== GET MESSAGES ==========
  async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { roomId } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const messages = await chatService.getMessages(roomId, userId);

      res.status(200).json({
        success: true,
        data: messages || [],
      });
    } catch (error: any) {
      console.error('Get messages error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get messages',
      });
    }
  }

  // ========== CREATE CHAT ROOM ==========
  async createRoom(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { name, isGroup, emergencyId, memberIds } = req.body;

      if (!memberIds || memberIds.length === 0) {
        res.status(400).json({
          success: false,
          message: 'At least one member is required',
        });
        return;
      }

      const room = await chatService.createChatRoom({
        name,
        isGroup,
        emergencyId,
        createdById: userId,
        memberIds: [userId, ...memberIds],
      });

      res.status(201).json({
        success: true,
        data: room,
      });
    } catch (error: any) {
      console.error('Create room error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create chat room',
      });
    }
  }

  // ========== CREATE EMERGENCY CHAT ==========
  async createEmergencyChat(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { emergencyId } = req.body;

      if (!emergencyId) {
        res.status(400).json({
          success: false,
          message: 'Emergency ID is required',
        });
        return;
      }

      const room = await chatService.createEmergencyChatRoom(emergencyId, userId);

      res.status(201).json({
        success: true,
        data: room,
      });
    } catch (error: any) {
      console.error('Create emergency chat error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create emergency chat',
      });
    }
  }

  // ========== GET UNREAD COUNT ==========
  async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const count = await chatService.getUnreadCount(userId);

      res.status(200).json({
        success: true,
        data: { unreadCount: count },
      });
    } catch (error: any) {
      console.error('Get unread count error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get unread count',
      });
    }
  }
  // ========== SEND MESSAGE (API Fallback) ==========
async sendMessage(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user?.id;
    const { roomId, content, type, mediaUrl } = req.body;

    if (!roomId || !content) {
      res.status(400).json({
        success: false,
        message: 'Room ID and content are required',
      });
      return;
    }

    const message = await prisma.chatMessage.create({
      data: {
        roomId,
        senderId: userId,
        content,
        type: type || 'TEXT',
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

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error: any) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send message',
    });
  }
}

// ========== ADD REACTION ==========
async addReaction(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user?.id;
    const { messageId } = req.params;
    const { emoji } = req.body;

    if (!emoji) {
      res.status(400).json({
        success: false,
        message: 'Emoji is required',
      });
      return;
    }

    const reactions = await chatService.addReaction(messageId, userId, emoji);

    res.status(200).json({
      success: true,
      data: reactions,
    });
  } catch (error: any) {
    console.error('Add reaction error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add reaction',
    });
  }
}

// ========== GET REACTIONS ==========
async getReactions(req: Request, res: Response): Promise<void> {
  try {
    const { messageId } = req.params;
    const reactions = await chatService.getReactions(messageId);

    res.status(200).json({
      success: true,
      data: reactions,
    });
  } catch (error: any) {
    console.error('Get reactions error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get reactions',
    });
  }
}
}

export default new ChatController();