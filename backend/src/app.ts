import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { Server as SocketServer } from 'socket.io';
import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';
import dashboardRoutes from './routes/dashboard.routes';
import emergencyRoutes from './routes/emergency.routes';
import mapRoutes from './routes/map.routes';
import notificationRoutes from './routes/notification.routes';
import resourceRoutes from './routes/resource.routes';
import uploadRoutes from './routes/upload.routes';
import userRoutes from './routes/user.routes';
import volunteerRoutes from './routes/volunteer.routes';
import adminRoutes from './routes/admin.routes';
dotenv.config();

const app = express();

// ✅ CORS
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

// ✅ Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Socket.io instance (set from server)
let io: SocketServer;

export const setIo = (socketIo: SocketServer) => {
  io = socketIo;
  app.set('io', socketIo);
};

export const getIo = () => io;

// ✅ Health Check
app.get('/api/health', (_, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/emergencies', emergencyRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
// ✅ 404 Handler
app.use((_, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});
// ✅ Global Error Handler
app.use(
  (
    err: any,
    _: express.Request,
    res: express.Response,
    __: express.NextFunction,
  ) => {
    console.error('Global Error:', err);

    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  },
);

export default app;
