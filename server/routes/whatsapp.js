import express from 'express';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get WhatsApp status
router.get('/status', (req, res) => {
  try {
    const whatsappService = req.app.locals.whatsappService;
    const status = whatsappService.getStatus();
    res.json(status);
  } catch (error) {
    logger.error('Error getting WhatsApp status:', error);
    res.status(500).json({ error: 'Failed to get status' });
  }
});

// Send message
router.post('/send-message', async (req, res) => {
  try {
    const { to, message, options = {} } = req.body;
    const whatsappService = req.app.locals.whatsappService;
    
    if (!to || !message) {
      return res.status(400).json({ error: 'Missing required fields: to, message' });
    }

    const result = await whatsappService.sendMessage(to, message, options);
    res.json({ success: true, messageId: result.id._serialized });
  } catch (error) {
    logger.error('Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send image
router.post('/send-image', async (req, res) => {
  try {
    const { to, imagePath, caption = '' } = req.body;
    const whatsappService = req.app.locals.whatsappService;
    
    if (!to || !imagePath) {
      return res.status(400).json({ error: 'Missing required fields: to, imagePath' });
    }

    const result = await whatsappService.sendImage(to, imagePath, caption);
    res.json({ success: true, messageId: result.id._serialized });
  } catch (error) {
    logger.error('Error sending image:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get chats
router.get('/chats', async (req, res) => {
  try {
    const whatsappService = req.app.locals.whatsappService;
    const chats = await whatsappService.getChats();
    res.json(chats);
  } catch (error) {
    logger.error('Error getting chats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Disconnect WhatsApp
router.post('/disconnect', async (req, res) => {
  try {
    const whatsappService = req.app.locals.whatsappService;
    await whatsappService.destroy();
    res.json({ success: true });
  } catch (error) {
    logger.error('Error disconnecting WhatsApp:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;