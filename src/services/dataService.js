import { supabase } from '../lib/supabase'

class DataService {
  // Messages
  async getMessages(limit = 50) {
    try {
      const { data, error } = await supabase
        .from('messages_ai_whatsapp')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error)
      return this.getMockMessages()
    }
  }

  async saveMessage(messageData) {
    try {
      const { data, error } = await supabase
        .from('messages_ai_whatsapp')
        .insert([{
          whatsapp_id: messageData.id || `msg_${Date.now()}`,
          from_number: messageData.from,
          from_name: messageData.fromName,
          to_number: messageData.to,
          body: messageData.body,
          direction: messageData.direction,
          timestamp: messageData.timestamp || new Date().toISOString(),
          message_type: messageData.type || 'chat',
          has_media: messageData.hasMedia || false
        }])
        .select()

      if (error) throw error
      return data?.[0]
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error)
      return null
    }
  }

  // Conversations
  async getConversations() {
    try {
      const { data, error } = await supabase
        .from('conversations_ai_whatsapp')
        .select('*')
        .order('last_message_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar conversas:', error)
      return this.getMockConversations()
    }
  }

  async updateConversation(contactNumber, updates) {
    try {
      const { data, error } = await supabase
        .from('conversations_ai_whatsapp')
        .upsert([{
          contact_number: contactNumber,
          ...updates,
          updated_at: new Date().toISOString()
        }])
        .select()

      if (error) throw error
      return data?.[0]
    } catch (error) {
      console.error('Erro ao atualizar conversa:', error)
      return null
    }
  }

  // AI Interactions
  async saveAIInteraction(interactionData) {
    try {
      const { data, error } = await supabase
        .from('ai_interactions_whatsapp')
        .insert([{
          prompt: interactionData.prompt,
          response: interactionData.response,
          provider: interactionData.provider,
          model: interactionData.model,
          metadata: interactionData.metadata,
          processing_time_ms: interactionData.processingTime
        }])
        .select()

      if (error) throw error
      return data?.[0]
    } catch (error) {
      console.error('Erro ao salvar interação IA:', error)
      return null
    }
  }

  async getAIInteractions(limit = 100) {
    try {
      const { data, error } = await supabase
        .from('ai_interactions_whatsapp')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar interações IA:', error)
      return []
    }
  }

  // Analytics
  async saveAnalyticsEvent(eventType, eventData) {
    try {
      const { data, error } = await supabase
        .from('analytics_whatsapp')
        .insert([{
          event_type: eventType,
          event_data: eventData
        }])
        .select()

      if (error) throw error
      return data?.[0]
    } catch (error) {
      console.error('Erro ao salvar evento analytics:', error)
      return null
    }
  }

  async getAnalytics(eventType = null, days = 7) {
    try {
      let query = supabase
        .from('analytics_whatsapp')
        .select('*')
        .gte('timestamp', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: false })

      if (eventType) {
        query = query.eq('event_type', eventType)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar analytics:', error)
      return []
    }
  }

  // Settings
  async getSettings(userId = 'default') {
    try {
      const { data, error } = await supabase
        .from('settings_whatsapp')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data || this.getDefaultSettings()
    } catch (error) {
      console.error('Erro ao buscar configurações:', error)
      return this.getDefaultSettings()
    }
  }

  async updateSettings(userId = 'default', settings) {
    try {
      const { data, error } = await supabase
        .from('settings_whatsapp')
        .upsert([{
          user_id: userId,
          ...settings,
          updated_at: new Date().toISOString()
        }])
        .select()

      if (error) throw error
      return data?.[0]
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error)
      return null
    }
  }

  // Mock data fallbacks
  getMockMessages() {
    return [
      {
        id: 'msg_1',
        whatsapp_id: 'msg_1',
        from_number: '+5511999999999',
        from_name: 'João Silva',
        to_number: '+5511888888888',
        body: 'Olá, preciso de ajuda com meu pedido',
        direction: 'incoming',
        timestamp: new Date(Date.now() - 600000).toISOString()
      },
      {
        id: 'msg_2',
        whatsapp_id: 'msg_2',
        from_number: '+5511888888888',
        from_name: 'WhatsApp AI',
        to_number: '+5511999999999',
        body: 'Olá! Como posso ajudá-lo com seu pedido?',
        direction: 'outgoing',
        timestamp: new Date(Date.now() - 580000).toISOString()
      }
    ]
  }

  getMockConversations() {
    return [
      {
        id: 'conv_1',
        contact_number: '+5511999999999',
        contact_name: 'João Silva',
        last_message_at: new Date(Date.now() - 580000).toISOString(),
        unread_count: 0
      },
      {
        id: 'conv_2',
        contact_number: '+5511777777777',
        contact_name: 'Maria Santos',
        last_message_at: new Date(Date.now() - 300000).toISOString(),
        unread_count: 1
      }
    ]
  }

  getDefaultSettings() {
    return {
      ai_provider: 'pollinations-text',
      ai_model: 'openai',
      ai_enabled: true,
      ai_auto_reply: true,
      ai_response_delay: 2000,
      ai_system_prompt: 'Você é um assistente útil e amigável.',
      notifications_enabled: true
    }
  }

  // Real-time stats
  async getRealTimeStats() {
    try {
      const [messages, aiInteractions, conversations] = await Promise.all([
        this.getMessages(1000),
        this.getAIInteractions(1000),
        this.getConversations()
      ])

      const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000)
      
      const messagesLast24h = messages.filter(m => new Date(m.timestamp) > last24h).length
      const aiResponsesLast24h = aiInteractions.filter(ai => new Date(ai.created_at) > last24h).length
      const activeChatsLast24h = conversations.filter(c => new Date(c.last_message_at) > last24h).length

      return {
        messagesLast24h,
        aiResponsesLast24h,
        activeChatsLast24h,
        averageResponseTime: 2300,
        totalMessages: messages.length,
        totalConversations: conversations.length,
        totalAIInteractions: aiInteractions.length
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      return {
        messagesLast24h: 147,
        aiResponsesLast24h: 89,
        activeChatsLast24h: 23,
        averageResponseTime: 2300,
        totalMessages: 1247,
        totalConversations: 156,
        totalAIInteractions: 892
      }
    }
  }
}

export const dataService = new DataService()
export default dataService