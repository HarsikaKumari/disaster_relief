import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middlewares/auth.middleware';
import { v2 as cloudinaryV2 } from 'cloudinary';
import prisma from '../config/prisma';
import axios from 'axios';
import emergencyService from '../services/emergency.service'; // ✅ IMPORT ADDED

const router = Router();

// Cloudinary Config
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Setup
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// ========== UPLOAD FILE ==========
// @ts-ignore
router.post('/file', authenticate, upload.single('file'), async (req: any, res) => {
  try {
    console.log('📤 Upload request received');

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    console.log('📎 File received:', req.file.originalname);

    // Upload to Cloudinary
    const result: any = await new Promise((resolve, reject) => {
      const stream = cloudinaryV2.uploader.upload_stream(
        {
          folder: 'disaster-relief/chat',
          resource_type: 'auto',
          public_id: `file_${Date.now()}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    console.log('☁️ Cloudinary upload success:', result.secure_url);

    const isImage = req.file.mimetype.startsWith('image/');

    // ✅ FIX: Use 'FILE' type for documents, 'IMAGE' for images
    const messageType = isImage ? 'IMAGE' : 'FILE';

    // Save message to database
    const message = await prisma.chatMessage.create({
      data: {
        roomId: req.body.roomId,
        senderId: req.user.id,
        content: req.body.caption || (isImage ? '📎 Image' : '📎 File'),
        type: messageType,
        mediaUrl: result.secure_url,
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

    console.log('💾 Message saved to DB:', message.id, 'Type:', message.type);

    // Update room's last message
    await prisma.chatRoom.update({
      where: { id: req.body.roomId },
      data: {
        lastMessage: req.body.caption || (isImage ? '📎 Image' : '📎 File'),
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Emit via socket to all users in room
    const io = req.app.get('io');
    if (io) {
      console.log('📨 Emitting new-message to room:', req.body.roomId);
      io.to(req.body.roomId).emit('new-message', message);
    } else {
      console.error('❌ Socket.io instance not found!');
    }

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error: any) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload file',
    });
  }
});

// ========== DOWNLOAD FILE ==========
// @ts-ignore
router.get('/download/:fileId', authenticate, async (req: any, res) => {
  try {
    const { fileId } = req.params;

    const message = await prisma.chatMessage.findUnique({
      where: { id: fileId },
    });

    if (!message || !message.mediaUrl) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    const response = await axios.get(message.mediaUrl, {
      responseType: 'stream',
    });

    const fileName = message.mediaUrl.split('/').pop() || 'file';

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    // @ts-ignore
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');

    response.data.pipe(res);
  } catch (error: any) {
    console.error('❌ Download error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download file',
    });
  }
});

// ============================================
// ✅ NEW: UPLOAD EMERGENCY IMAGES
// ============================================
// @ts-ignore
router.post('/emergency/:emergencyId', authenticate, upload.array('images', 5), async (req: any, res) => {
  try {
    const { emergencyId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    const imageUrls: string[] = [];

    for (const file of req.files) {
      const result: any = await new Promise((resolve, reject) => {
        const stream = cloudinaryV2.uploader.upload_stream(
          {
            folder: 'disaster-relief/emergencies',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });
      imageUrls.push(result.secure_url);
    }

    // Add images to emergency
    const emergency = await emergencyService.addEmergencyImages(emergencyId, imageUrls);

    res.status(200).json({
      success: true,
      data: {
        images: imageUrls,
        emergency,
      },
    });
  } catch (error: any) {
    console.error('❌ Emergency image upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload emergency images',
    });
  }
});

export default router;