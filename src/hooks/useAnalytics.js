import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export function useAnalytics() {
  const [realTimeStats, setRealTimeStats] = useState({
    messagesLast24h: 0,
    aiResponsesLast24h: 0,
    activeChatsLast24h: 0,
    averageResponseTime: 0
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load initial data
    fetchRealTimeStats();
    
    // Update every 30 seconds
    const interval = setInterval(fetchRealTimeStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchRealTimeStats = async () => {
    try {
      const response = await api.get('/analytics/realtime');
      setRealTimeStats(response.data);
    } catch (error) {
      console.error('Error fetching real-time stats:', error);
    }
  };

  const getMessagesOverTime = async (timeRange = '7d') => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/messages-over-time?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      console.error('Error getting messages over time:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getTopContacts = async (limit = 10) => {
    try {
      const response = await api.get(`/analytics/top-contacts?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error getting top contacts:', error);
      return [];
    }
  };

  const generateDailyReport = async () => {
    try {
      setLoading(true);
      const response = await api.post('/analytics/daily-report');
      return response.data;
    } catch (error) {
      console.error('Error generating daily report:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAIPerformanceMetrics = async () => {
    try {
      const response = await api.get('/analytics/ai-performance');
      return response.data;
    } catch (error) {
      console.error('Error getting AI performance:', error);
      return null;
    }
  };

  return {
    realTimeStats,
    loading,
    getMessagesOverTime,
    getTopContacts,
    generateDailyReport,
    getAIPerformanceMetrics,
    refreshStats: fetchRealTimeStats
  };
}