import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';
import emergencyRoutes from './routes/emergency.routes';
import resourceRoutes from './routes/resource.routes';
import userRoutes from './routes/user.routes';
import mapRoutes from './routes/map.routes';
dotenv.config();

const app = express();


app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/api/health', (_, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/emergencies', emergencyRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/map', mapRoutes);
app.use((_, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

app.use((err: any, _: express.Request, res: express.Response) => {
  console.error('Global Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

export default app;