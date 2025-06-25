import express from 'express';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get real-time statistics
router.get('/realtime', (req, res) => {
  try {
    const analyticsService = req.app.locals.analyticsService;
    const stats = analyticsService.getRealTimeStats();
    res.json(stats);
  } catch (error) {
    logger.error('Error getting real-time stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get messages over time
router.get('/messages-over-time', async (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;
    const analyticsService = req.app.locals.analyticsService;
    
    const data = await analyticsService.getMessagesOverTime(timeRange);
    res.json(data);
  } catch (error) {
    logger.error('Error getting messages over time:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get top contacts
router.get('/top-contacts', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const analyticsService = req.app.locals.analyticsService;
    
    const contacts = await analyticsService.getTopContacts(parseInt(limit));
    res.json(contacts);
  } catch (error) {
    logger.error('Error getting top contacts:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate daily report
router.post('/daily-report', async (req, res) => {
  try {
    const analyticsService = req.app.locals.analyticsService;
    const report = await analyticsService.generateDailyReport();
    res.json(report);
  } catch (error) {
    logger.error('Error generating daily report:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get AI performance metrics
router.get('/ai-performance', async (req, res) => {
  try {
    const analyticsService = req.app.locals.analyticsService;
    const metrics = await analyticsService.getAIPerformanceMetrics();
    res.json(metrics);
  } catch (error) {
    logger.error('Error getting AI performance:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;