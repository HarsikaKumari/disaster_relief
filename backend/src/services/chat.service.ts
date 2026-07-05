import prisma from '../config/prisma';
import { ChatMessageType } from '@prisma/client';

interface CreateChatRoomInput {
  name?: string;
  isGroup?: boolean;
  emergencyId?: string;
  createdById: string;
  memberIds: string[];
}

interface SendMessageInput {
  roomId: string;
  senderId: string;
  content: string;
  type?: ChatMessageType;
  mediaUrl?: string;
}

export class ChatService {
  // ========== CREATE CHAT ROOM ==========
  async createChatRoom(data: CreateChatRoomInput) {
    const room = await prisma.chatRoom.create({
      data: {
        name: data.name,
        isGroup: data.isGroup || false,
        emergencyId: data.emergencyId,
        createdById: data.createdById,
        members: {
          create: data.memberIds.map((userId) => ({
            userId,
            isActive: true,
          })),
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
              },
            },
          },
        },
        emergency: {
          select: {
            id: true,
            title: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return room;
  }

  // ========== GET USER CHAT ROOMS ==========
  async getUserChatRooms(userId: string) {
    const rooms = await prisma.chatRoom.findMany({
      where: {
        members: {
          some: {
            userId,
            isActive: true,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        emergency: {
          select: {
            id: true,
            title: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return rooms.map((room) => {
      const member = room.members.find((m) => m.userId === userId);
      return {
        ...room,
        lastMessage: room.messages[0] || null,
        unreadCount: member?.lastReadAt 
          ? room.messages.filter((m) => m.createdAt > member.lastReadAt).length
          : 0,
      };
    });
  }

  // ========== GET CHAT ROOM DETAILS ==========
  async getChatRoom(roomId: string, userId: string) {
    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 50,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
        },
        emergency: {
          select: {
            id: true,
            title: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!room) throw new Error('Chat room not found');

    await prisma.chatMember.update({
      where: {
        roomId_userId: {
          roomId,
          userId,
        },
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    return room;
  }

  // ========== SEND MESSAGE ==========
  // ========== SEND MESSAGE ==========
async sendMessage(data: SendMessageInput) {
  // ✅ Ensure type is properly set
  const messageType = data.type || 'TEXT';
  
  const message = await prisma.chatMessage.create({
    data: {
      roomId: data.roomId,
      senderId: data.senderId,
      content: data.content,
      type: messageType,
      mediaUrl: data.mediaUrl,
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
    where: { id: data.roomId },
    data: {
      lastMessage: data.content,
      lastMessageAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return message;
}

  // ========== GET MESSAGES ==========
  async getMessages(
    roomId: string,
    userId: string,
    cursor?: string,
    limit: number = 20
  ) {
    const messages = await prisma.chatMessage.findMany({
      where: {
        roomId,
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
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      ...(cursor && {
        cursor: {
          id: cursor,
        },
        skip: 1,
      }),
    });

    await prisma.chatMember.update({
      where: {
        roomId_userId: {
          roomId,
          userId,
        },
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    return messages.reverse();
  }

  // ========== MARK MESSAGES AS READ ==========
  async markAsRead(roomId: string, userId: string) {
    return prisma.chatMember.update({
      where: {
        roomId_userId: {
          roomId,
          userId,
        },
      },
      data: {
        lastReadAt: new Date(),
      },
    });
  }

  // ========== ADD MEMBER TO ROOM ==========
  async addMember(roomId: string, userId: string) {
    return prisma.chatMember.create({
      data: {
        roomId,
        userId,
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });
  }

  // ========== REMOVE MEMBER ==========
  async removeMember(roomId: string, userId: string) {
    return prisma.chatMember.update({
      where: {
        roomId_userId: {
          roomId,
          userId,
        },
      },
      data: {
        isActive: false,
      },
    });
  }

  // ========== CREATE EMERGENCY CHAT ROOM ==========
  async createEmergencyChatRoom(emergencyId: string, createdBy: string) {
    const existingRoom = await prisma.chatRoom.findFirst({
      where: {
        emergencyId,
        isGroup: true,
      },
      include: {
        members: true,
      },
    });

    if (existingRoom) {
      const isMember = existingRoom.members.some((m) => m.userId === createdBy);
      if (!isMember) {
        await prisma.chatMember.create({
          data: {
            roomId: existingRoom.id,
            userId: createdBy,
            isActive: true,
          },
        });
      }
      return existingRoom;
    }

    const emergency = await prisma.emergency.findUnique({
      where: { id: emergencyId },
      include: {
        reportedBy: true,
        assignedTo: true,
      },
    });

    if (!emergency) throw new Error('Emergency not found');

    const memberIds: string[] = [];

    if (emergency.reportedBy) {
      memberIds.push(emergency.reportedBy.id);
    }

    if (emergency.assignedTo) {
      memberIds.push(emergency.assignedTo.id);
    }

    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN', isActive: true },
      select: { id: true },
    });
    admins.forEach((a) => memberIds.push(a.id));

    if (!memberIds.includes(createdBy)) {
      memberIds.push(createdBy);
    }

    const uniqueMemberIds = [...new Set(memberIds)];

    return this.createChatRoom({
      name: `Emergency: ${emergency.title}`,
      isGroup: true,
      emergencyId,
      createdById: createdBy,
      memberIds: uniqueMemberIds,
    });
  }

  // ========== GET UNREAD COUNT ==========
  async getUnreadCount(userId: string) {
    const members = await prisma.chatMember.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        room: {
          include: {
            messages: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
    });

    let totalUnread = 0;
    for (const member of members) {
      const unread = member.room.messages.filter(
        (m) => m.createdAt > member.lastReadAt && m.senderId !== userId
      ).length;
      totalUnread += unread;
    }

    return totalUnread;
  }

  // ========== ADD REACTION ==========
async addReaction(messageId: string, userId: string, emoji: string) {
  // Check if message exists
  const message = await prisma.chatMessage.findUnique({
    where: { id: messageId },
  });
  if (!message) throw new Error('Message not found');

  // Check if user already reacted
  const existing = await prisma.messageReaction.findUnique({
    where: {
      messageId_userId: {
        messageId,
        userId,
      },
    },
  });

  if (existing) {
    if (existing.emoji === emoji) {
      // Remove reaction if same emoji
      await prisma.messageReaction.delete({
        where: {
          messageId_userId: {
            messageId,
            userId,
          },
        },
      });
    } else {
      // Update emoji
      await prisma.messageReaction.update({
        where: {
          messageId_userId: {
            messageId,
            userId,
          },
        },
        data: { emoji },
      });
    }
  } else {
    // Add new reaction
    await prisma.messageReaction.create({
      data: {
        messageId,
        userId,
        emoji,
      },
    });
  }

  // Return updated reactions with user info
  return prisma.messageReaction.findMany({
    where: { messageId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

// ========== GET REACTIONS ==========
async getReactions(messageId: string) {
  return prisma.messageReaction.findMany({
    where: { messageId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}
}

export default new ChatService();