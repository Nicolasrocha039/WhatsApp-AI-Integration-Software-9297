import React, { createContext, useContext, useState, useEffect } from 'react'
import { dataService } from '../services/dataService'
import { apiService } from '../services/api'
import { toast } from 'react-hot-toast'

const WhatsAppContext = createContext()

export const useWhatsApp = () => {
  const context = useContext(WhatsAppContext)
  if (!context) {
    throw new Error('useWhatsApp must be used within a WhatsAppProvider')
  }
  return context
}

export const WhatsAppProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [qrCode, setQrCode] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [messages, setMessages] = useState([])
  const [conversations, setConversations] = useState([])
  const [realTimeStats, setRealTimeStats] = useState({})
  const [loading, setLoading] = useState(false)

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData()
    // Simular conexão ativa para demo
    setTimeout(() => {
      setIsConnected(true)
      setConnectionStatus('connected')
      setPhoneNumber('+55 11 99999-9999')
    }, 2000)
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [messagesData, conversationsData, statsData] = await Promise.all([
        dataService.getMessages(),
        dataService.getConversations(),
        dataService.getRealTimeStats()
      ])
      
      setMessages(messagesData)
      setConversations(conversationsData)
      setRealTimeStats(statsData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados iniciais')
    } finally {
      setLoading(false)
    }
  }

  const connectWhatsApp = async () => {
    setConnectionStatus('connecting')
    setLoading(true)
    
    try {
      // Simular processo de conexão
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Gerar QR Code simulado
      setQrCode('qr_code_data_here')
      
      // Simular escaneamento e conexão
      setTimeout(() => {
        setIsConnected(true)
        setConnectionStatus('connected')
        setPhoneNumber('+55 11 99999-9999')
        setQrCode('')
        toast.success('WhatsApp conectado com sucesso!')
        
        // Log evento
        dataService.saveAnalyticsEvent('whatsapp_connected', {
          timestamp: new Date().toISOString(),
          phone: '+55 11 99999-9999'
        })
      }, 5000)
      
    } catch (error) {
      setConnectionStatus('error')
      toast.error('Erro ao conectar WhatsApp')
    } finally {
      setLoading(false)
    }
  }

  const disconnectWhatsApp = async () => {
    try {
      setIsConnected(false)
      setConnectionStatus('disconnected')
      setPhoneNumber('')
      setQrCode('')
      toast.success('WhatsApp desconectado')
      
      // Log evento
      await dataService.saveAnalyticsEvent('whatsapp_disconnected', {
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      toast.error('Erro ao desconectar')
    }
  }

  const sendMessage = async (to, messageText, options = {}) => {
    try {
      const messageData = {
        id: `msg_${Date.now()}`,
        from: phoneNumber,
        fromName: 'Você',
        to: to,
        body: messageText,
        direction: 'outgoing',
        timestamp: new Date().toISOString(),
        type: options.type || 'text',
        hasMedia: options.hasMedia || false
      }

      // Salvar no banco de dados
      const savedMessage = await dataService.saveMessage(messageData)
      
      // Atualizar estado local
      setMessages(prev => [messageData, ...prev])
      
      // Atualizar conversa
      await dataService.updateConversation(to, {
        contact_name: options.contactName || to,
        last_message_at: messageData.timestamp,
        unread_count: 0
      })

      // Log evento
      await dataService.saveAnalyticsEvent('message_sent', {
        to: to,
        type: messageData.type,
        timestamp: messageData.timestamp
      })

      toast.success('Mensagem enviada!')
      return savedMessage || messageData
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      toast.error('Erro ao enviar mensagem')
      throw error
    }
  }

  const receiveMessage = async (messageData) => {
    try {
      // Salvar mensagem recebida
      const savedMessage = await dataService.saveMessage({
        ...messageData,
        direction: 'incoming'
      })

      // Atualizar estado
      setMessages(prev => [messageData, ...prev])
      
      // Atualizar conversa
      await dataService.updateConversation(messageData.from, {
        contact_name: messageData.fromName,
        last_message_at: messageData.timestamp,
        unread_count: 1
      })

      // Log evento
      await dataService.saveAnalyticsEvent('message_received', {
        from: messageData.from,
        type: messageData.type,
        timestamp: messageData.timestamp
      })

      // Notificação
      if (messageData.fromName) {
        toast(`Nova mensagem de ${messageData.fromName}`)
      }

      return savedMessage || messageData
      
    } catch (error) {
      console.error('Erro ao processar mensagem recebida:', error)
    }
  }

  const refreshData = async () => {
    await loadInitialData()
  }

  // Simular recebimento de mensagens periodicamente
  useEffect(() => {
    if (!isConnected) return

    const interval = setInterval(async () => {
      // Simular mensagem recebida ocasionalmente
      if (Math.random() > 0.95) {
        const mockMessage = {
          id: `msg_${Date.now()}`,
          from: '+5511777777777',
          fromName: 'Cliente Demo',
          to: phoneNumber,
          body: 'Hello! Esta é uma mensagem de demonstração.',
          timestamp: new Date().toISOString(),
          type: 'text'
        }
        await receiveMessage(mockMessage)
      }
    }, 10000) // A cada 10 segundos

    return () => clearInterval(interval)
  }, [isConnected, phoneNumber])

  const value = {
    // Estados
    isConnected,
    qrCode,
    phoneNumber,
    connectionStatus,
    messages,
    conversations,
    realTimeStats,
    loading,
    
    // Ações
    connectWhatsApp,
    disconnectWhatsApp,
    sendMessage,
    receiveMessage,
    refreshData,
    setQrCode,
    
    // Utilitários
    loadInitialData
  }

  return (
    <WhatsAppContext.Provider value={value}>
      {children}
    </WhatsAppContext.Provider>
  )
}