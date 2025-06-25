import React, { createContext, useContext, useState } from 'react'

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
  const [activeChats, setActiveChats] = useState([])

  const connectWhatsApp = async () => {
    setConnectionStatus('connecting')
    try {
      // Simulação de conexão
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsConnected(true)
      setConnectionStatus('connected')
      setPhoneNumber('+55 11 99999-9999')
    } catch (error) {
      setConnectionStatus('error')
    }
  }

  const disconnectWhatsApp = () => {
    setIsConnected(false)
    setConnectionStatus('disconnected')
    setPhoneNumber('')
    setQrCode('')
  }

  const sendMessage = async (to, message) => {
    const newMessage = {
      id: Date.now(),
      to,
      message,
      timestamp: new Date(),
      status: 'sent',
      type: 'outgoing'
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage
  }

  const value = {
    isConnected,
    qrCode,
    phoneNumber,
    connectionStatus,
    messages,
    activeChats,
    connectWhatsApp,
    disconnectWhatsApp,
    sendMessage,
    setQrCode
  }

  return (
    <WhatsAppContext.Provider value={value}>
      {children}
    </WhatsAppContext.Provider>
  )
}