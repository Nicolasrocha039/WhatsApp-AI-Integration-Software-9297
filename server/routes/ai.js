import express from 'express';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Generate AI response
router.post('/generate', async (req, res) => {
  try {
    const { prompt, provider, model, options = {} } = req.body;
    const aiService = req.app.locals.aiService;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Missing required field: prompt' });
    }

    const response = await aiService.generateResponse(prompt, {
      provider,
      model,
      ...options
    });

    res.json(response);
  } catch (error) {
    logger.error('Error generating AI response:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test AI provider connection
router.post('/test', async (req, res) => {
  try {
    const { provider, options = {} } = req.body;
    const aiService = req.app.locals.aiService;
    
    if (!provider) {
      return res.status(400).json({ error: 'Missing required field: provider' });
    }

    const result = await aiService.testConnection(provider, options);
    res.json(result);
  } catch (error) {
    logger.error('Error testing AI provider:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get AI provider statistics
router.get('/stats', async (req, res) => {
  try {
    const aiService = req.app.locals.aiService;
    const stats = await aiService.getProviderStats();
    res.json(stats);
  } catch (error) {
    logger.error('Error getting AI stats:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;