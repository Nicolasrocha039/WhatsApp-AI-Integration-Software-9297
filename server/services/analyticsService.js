import cron from 'node-cron';
import { supabase } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

export class AnalyticsService {
  constructor() {
    this.metrics = new Map();
    this.realTimeStats = {
      messagesLast24h: 0,
      aiResponsesLast24h: 0,
      activeChatsLast24h: 0,
      averageResponseTime: 0
    };
  }

  async initialize() {
    // Schedule analytics updates every hour
    cron.schedule('0 * * * *', async () => {
      await this.updateHourlyMetrics();
    });

    // Schedule daily reports
    cron.schedule('0 0 * * *', async () => {
      await this.generateDailyReport();
    });

    // Update real-time stats every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      await this.updateRealTimeStats();
    });

    await this.updateRealTimeStats();
    logger.info('Analytics service initialized');
  }

  async updateRealTimeStats() {
    try {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // Messages last 24h
      const { count: messagesCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .gte('timestamp', yesterday.toISOString());

      // AI responses last 24h
      const { count: aiCount } = await supabase
        .from('ai_interactions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', yesterday.toISOString());

      // Active chats last 24h
      const { data: uniqueChats } = await supabase
        .from('messages')
        .select('from_number')
        .gte('timestamp', yesterday.toISOString())
        .neq('direction', 'outgoing');

      const activeChatsCount = new Set(uniqueChats?.map(m => m.from_number) || []).size;

      // Average response time (placeholder calculation)
      const averageResponseTime = await this.calculateAverageResponseTime();

      this.realTimeStats = {
        messagesLast24h: messagesCount || 0,
        aiResponsesLast24h: aiCount || 0,
        activeChatsLast24h: activeChatsCount,
        averageResponseTime: averageResponseTime
      };

      // Save to analytics table
      await supabase
        .from('analytics')
        .insert([{
          event_type: 'real_time_stats',
          event_data: this.realTimeStats,
          timestamp: new Date()
        }]);

    } catch (error) {
      logger.error('Error updating real-time stats:', error);
    }
  }

  async calculateAverageResponseTime() {
    try {
      // This is a simplified calculation
      // In a real implementation, you'd track request/response pairs
      const { data: aiInteractions } = await supabase
        .from('ai_interactions')
        .select('created_at, metadata')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .limit(100);

      if (!aiInteractions?.length) return 0;

      // Simulate response times based on provider
      const responseTimes = aiInteractions.map(interaction => {
        const provider = interaction.metadata?.provider || 'unknown';
        switch (provider) {
          case 'pollinations-text': return 1800; // 1.8s
          case 'pollinations-image': return 8500; // 8.5s
          case 'openai': return 2300; // 2.3s
          default: return 3000; // 3s
        }
      });

      return Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length);
    } catch (error) {
      logger.error('Error calculating average response time:', error);
      return 0;
    }
  }

  async updateHourlyMetrics() {
    try {
      const now = new Date();
      const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      // Get hourly message count
      const { count: messageCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .gte('timestamp', hourAgo.toISOString())
        .lt('timestamp', now.toISOString());

      // Get hourly AI interaction count
      const { count: aiCount } = await supabase
        .from('ai_interactions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', hourAgo.toISOString())
        .lt('created_at', now.toISOString());

      const metrics = {
        hour: now.getHours(),
        date: now.toISOString().split('T')[0],
        messages: messageCount || 0,
        ai_interactions: aiCount || 0,
        timestamp: now
      };

      await supabase
        .from('analytics')
        .insert([{
          event_type: 'hourly_metrics',
          event_data: metrics
        }]);

      logger.info(`Hourly metrics updated: ${JSON.stringify(metrics)}`);
    } catch (error) {
      logger.error('Error updating hourly metrics:', error);
    }
  }

  async generateDailyReport() {
    try {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

      // Get daily statistics
      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .gte('timestamp', yesterday.toISOString())
        .lt('timestamp', today.toISOString());

      const { data: aiInteractions } = await supabase
        .from('ai_interactions')
        .select('*')
        .gte('created_at', yesterday.toISOString())
        .lt('created_at', today.toISOString());

      const report = {
        date: yesterday.toISOString().split('T')[0],
        total_messages: messages?.length || 0,
        incoming_messages: messages?.filter(m => m.direction === 'incoming').length || 0,
        outgoing_messages: messages?.filter(m => m.direction === 'outgoing').length || 0,
        ai_responses: aiInteractions?.length || 0,
        unique_contacts: new Set(messages?.map(m => m.from_number) || []).size,
        most_active_hour: this.getMostActiveHour(messages || []),
        ai_providers_used: this.getProviderStats(aiInteractions || []),
        generated_at: today
      };

      await supabase
        .from('analytics')
        .insert([{
          event_type: 'daily_report',
          event_data: report
        }]);

      logger.info(`Daily report generated for ${report.date}`);
      return report;
    } catch (error) {
      logger.error('Error generating daily report:', error);
      throw error;
    }
  }

  getMostActiveHour(messages) {
    const hourCounts = {};
    messages.forEach(message => {
      const hour = new Date(message.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    return Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 0;
  }

  getProviderStats(aiInteractions) {
    const providerCounts = {};
    aiInteractions.forEach(interaction => {
      const provider = interaction.provider || 'unknown';
      providerCounts[provider] = (providerCounts[provider] || 0) + 1;
    });
    return providerCounts;
  }

  async getMessagesOverTime(timeRange = '7d') {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '24h':
          startDate.setHours(startDate.getHours() - 24);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        default:
          startDate.setDate(startDate.getDate() - 7);
      }

      const { data } = await supabase
        .from('messages')
        .select('timestamp, direction')
        .gte('timestamp', startDate.toISOString())
        .order('timestamp');

      // Group by hour or day depending on range
      const groupBy = timeRange === '24h' ? 'hour' : 'day';
      const grouped = this.groupMessagesByTime(data || [], groupBy);

      return grouped;
    } catch (error) {
      logger.error('Error getting messages over time:', error);
      return [];
    }
  }

  groupMessagesByTime(messages, groupBy) {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp);
      let key;
      
      if (groupBy === 'hour') {
        key = `${date.toISOString().split('T')[0]} ${date.getHours()}:00`;
      } else {
        key = date.toISOString().split('T')[0];
      }
      
      if (!groups[key]) {
        groups[key] = { incoming: 0, outgoing: 0, total: 0 };
      }
      
      groups[key][message.direction]++;
      groups[key].total++;
    });

    return Object.entries(groups).map(([time, counts]) => ({
      time,
      ...counts
    }));
  }

  async getTopContacts(limit = 10) {
    try {
      const { data } = await supabase
        .from('messages')
        .select('from_number, from_name')
        .neq('direction', 'outgoing')
        .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const contactCounts = {};
      data?.forEach(message => {
        const key = message.from_number;
        if (!contactCounts[key]) {
          contactCounts[key] = {
            number: message.from_number,
            name: message.from_name,
            count: 0
          };
        }
        contactCounts[key].count++;
      });

      return Object.values(contactCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    } catch (error) {
      logger.error('Error getting top contacts:', error);
      return [];
    }
  }

  getRealTimeStats() {
    return this.realTimeStats;
  }

  async getAIPerformanceMetrics() {
    try {
      const { data } = await supabase
        .from('ai_interactions')
        .select('provider, model, created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const metrics = {
        total_interactions: data?.length || 0,
        by_provider: {},
        by_model: {},
        success_rate: 98.5, // Placeholder
        average_response_time: this.realTimeStats.averageResponseTime
      };

      data?.forEach(interaction => {
        metrics.by_provider[interaction.provider] = 
          (metrics.by_provider[interaction.provider] || 0) + 1;
        
        metrics.by_model[interaction.model] = 
          (metrics.by_model[interaction.model] || 0) + 1;
      });

      return metrics;
    } catch (error) {
      logger.error('Error getting AI performance metrics:', error);
      return null;
    }
  }
}