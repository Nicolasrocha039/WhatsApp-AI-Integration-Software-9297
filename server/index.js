import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import whatsappRoutes from './routes/whatsapp.js';
import aiRoutes from './routes/ai.js';
import analyticsRoutes from './routes/analytics.js';
import authRoutes from './routes/auth.js';
import { initializeSupabase } from './config/supabase.js';
import { WhatsAppService } from './services/whatsappService.js';
import { AIService } from './services/aiService.js';
import { AnalyticsService } from './services/analyticsService.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize services
const whatsappService = new WhatsAppService(io);
const aiService = new AIService();
const analyticsService = new AnalyticsService();

// Make services available to routes
app.locals.whatsappService = whatsappService;
app.locals.aiService = aiService;
app.locals.analyticsService = analyticsService;
app.locals.io = io;

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  socket.on('join-room', (userId) => {
    socket.join(`user-${userId}`);
    logger.info(`User ${userId} joined room`);
  });
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Initialize Supabase and start server
async function startServer() {
  try {
    await initializeSupabase();
    await whatsappService.initialize();
    await analyticsService.initialize();
    
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`📱 WhatsApp service initialized`);
      logger.info(`🤖 AI services ready`);
      logger.info(`📊 Analytics service running`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down server...');
  await whatsappService.destroy();
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});