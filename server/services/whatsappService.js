import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';
import { supabase } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

export class WhatsAppService {
  constructor(io) {
    this.io = io;
    this.client = null;
    this.isReady = false;
    this.qrCode = null;
    this.connectedNumber = null;
  }

  async initialize() {
    try {
      this.client = new Client({
        authStrategy: new LocalAuth({
          clientId: 'whatsapp-ai-bot'
        }),
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
          ]
        }
      });

      this.setupEventHandlers();
      await this.client.initialize();
      
      logger.info('WhatsApp client initialized');
    } catch (error) {
      logger.error('Failed to initialize WhatsApp client:', error);
      throw error;
    }
  }

  setupEventHandlers() {
    this.client.on('qr', (qr) => {
      this.qrCode = qr;
      qrcode.generate(qr, { small: true });
      
      this.io.emit('whatsapp:qr', { qr });
      logger.info('QR Code generated');
    });

    this.client.on('ready', async () => {
      this.isReady = true;
      const info = this.client.info;
      this.connectedNumber = info.wid.user;
      
      this.io.emit('whatsapp:ready', {
        number: this.connectedNumber,
        name: info.pushname
      });
      
      logger.info(`WhatsApp ready! Connected as: ${this.connectedNumber}`);
      
      // Save connection to database
      await this.saveConnectionStatus(true);
    });

    this.client.on('authenticated', () => {
      this.io.emit('whatsapp:authenticated');
      logger.info('WhatsApp authenticated');
    });

    this.client.on('auth_failure', () => {
      this.io.emit('whatsapp:auth_failure');
      logger.error('WhatsApp authentication failed');
    });

    this.client.on('disconnected', async (reason) => {
      this.isReady = false;
      this.connectedNumber = null;
      
      this.io.emit('whatsapp:disconnected', { reason });
      logger.info(`WhatsApp disconnected: ${reason}`);
      
      await this.saveConnectionStatus(false);
    });

    this.client.on('message', async (message) => {
      await this.handleIncomingMessage(message);
    });

    this.client.on('message_create', async (message) => {
      if (message.fromMe) {
        await this.handleOutgoingMessage(message);
      }
    });
  }

  async handleIncomingMessage(message) {
    try {
      const contact = await message.getContact();
      const chat = await message.getChat();
      
      const messageData = {
        id: message.id._serialized,
        from: contact.number,
        fromName: contact.name || contact.pushname || contact.number,
        to: this.connectedNumber,
        body: message.body,
        type: message.type,
        timestamp: new Date(message.timestamp * 1000),
        isGroup: chat.isGroup,
        groupName: chat.isGroup ? chat.name : null,
        hasMedia: message.hasMedia,
        direction: 'incoming'
      };

      // Save to database
      await this.saveMessage(messageData);
      
      // Emit to frontend
      this.io.emit('whatsapp:message', messageData);
      
      // Check for AI auto-reply
      await this.checkAutoReply(message, messageData);
      
      logger.info(`New message from ${contact.number}: ${message.body}`);
    } catch (error) {
      logger.error('Error handling incoming message:', error);
    }
  }

  async handleOutgoingMessage(message) {
    try {
      const contact = await message.getContact();
      const chat = await message.getChat();
      
      const messageData = {
        id: message.id._serialized,
        from: this.connectedNumber,
        fromName: 'You',
        to: contact.number,
        body: message.body,
        type: message.type,
        timestamp: new Date(message.timestamp * 1000),
        isGroup: chat.isGroup,
        groupName: chat.isGroup ? chat.name : null,
        hasMedia: message.hasMedia,
        direction: 'outgoing'
      };

      await this.saveMessage(messageData);
      this.io.emit('whatsapp:message', messageData);
      
    } catch (error) {
      logger.error('Error handling outgoing message:', error);
    }
  }

  async checkAutoReply(message, messageData) {
    try {
      // Get AI settings for the user
      const { data: settings } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', 'default') // For now, use default settings
        .single();

      if (settings?.ai_auto_reply && settings?.ai_enabled) {
        // Import AI service here to avoid circular dependency
        const { AIService } = await import('./aiService.js');
        const aiService = new AIService();
        
        const aiResponse = await aiService.generateResponse(
          message.body,
          {
            provider: settings.ai_provider,
            model: settings.ai_model,
            context: messageData
          }
        );

        if (aiResponse) {
          // Add delay to make it seem more natural
          setTimeout(async () => {
            await this.sendMessage(messageData.from, aiResponse.content);
            
            // Log AI interaction
            await this.saveAIInteraction({
              messageId: messageData.id,
              prompt: message.body,
              response: aiResponse.content,
              provider: settings.ai_provider,
              model: settings.ai_model,
              metadata: aiResponse.metadata
            });
          }, settings.ai_response_delay || 2000);
        }
      }
    } catch (error) {
      logger.error('Error in auto-reply:', error);
    }
  }

  async sendMessage(to, message, options = {}) {
    try {
      if (!this.isReady) {
        throw new Error('WhatsApp client not ready');
      }

      const chatId = to.includes('@') ? to : `${to}@c.us`;
      const sentMessage = await this.client.sendMessage(chatId, message, options);
      
      logger.info(`Message sent to ${to}: ${message}`);
      return sentMessage;
    } catch (error) {
      logger.error('Error sending message:', error);
      throw error;
    }
  }

  async sendImage(to, imagePath, caption = '') {
    try {
      if (!this.isReady) {
        throw new Error('WhatsApp client not ready');
      }

      const media = MessageMedia.fromFilePath(imagePath);
      const chatId = to.includes('@') ? to : `${to}@c.us`;
      
      const sentMessage = await this.client.sendMessage(chatId, media, { caption });
      
      logger.info(`Image sent to ${to}`);
      return sentMessage;
    } catch (error) {
      logger.error('Error sending image:', error);
      throw error;
    }
  }

  async getChats() {
    try {
      if (!this.isReady) {
        throw new Error('WhatsApp client not ready');
      }

      const chats = await this.client.getChats();
      return chats.map(chat => ({
        id: chat.id._serialized,
        name: chat.name,
        isGroup: chat.isGroup,
        unreadCount: chat.unreadCount,
        lastMessage: chat.lastMessage ? {
          body: chat.lastMessage.body,
          timestamp: new Date(chat.lastMessage.timestamp * 1000),
          fromMe: chat.lastMessage.fromMe
        } : null
      }));
    } catch (error) {
      logger.error('Error getting chats:', error);
      throw error;
    }
  }

  async saveMessage(messageData) {
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          whatsapp_id: messageData.id,
          from_number: messageData.from,
          from_name: messageData.fromName,
          to_number: messageData.to,
          body: messageData.body,
          message_type: messageData.type,
          timestamp: messageData.timestamp,
          is_group: messageData.isGroup,
          group_name: messageData.groupName,
          has_media: messageData.hasMedia,
          direction: messageData.direction
        }]);

      if (error) {
        logger.error('Error saving message:', error);
      }
    } catch (error) {
      logger.error('Error saving message:', error);
    }
  }

  async saveConnectionStatus(isConnected) {
    try {
      const { error } = await supabase
        .from('analytics')
        .insert([{
          event_type: 'connection_status',
          event_data: {
            connected: isConnected,
            number: this.connectedNumber,
            timestamp: new Date().toISOString()
          }
        }]);

      if (error) {
        logger.error('Error saving connection status:', error);
      }
    } catch (error) {
      logger.error('Error saving connection status:', error);
    }
  }

  async saveAIInteraction(data) {
    try {
      const { error } = await supabase
        .from('ai_interactions')
        .insert([{
          message_id: data.messageId,
          prompt: data.prompt,
          response: data.response,
          provider: data.provider,
          model: data.model,
          metadata: data.metadata,
          timestamp: new Date()
        }]);

      if (error) {
        logger.error('Error saving AI interaction:', error);
      }
    } catch (error) {
      logger.error('Error saving AI interaction:', error);
    }
  }

  getStatus() {
    return {
      isReady: this.isReady,
      qrCode: this.qrCode,
      connectedNumber: this.connectedNumber
    };
  }

  async destroy() {
    try {
      if (this.client) {
        await this.client.destroy();
        logger.info('WhatsApp client destroyed');
      }
    } catch (error) {
      logger.error('Error destroying WhatsApp client:', error);
    }
  }
}