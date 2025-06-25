import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../common/SafeIcon'
import { FiMessageSquare, FiSend, FiSearch, FiFilter, FiImage, FiZap, FiCpu } from 'react-icons/fi'
import { useWhatsApp } from '../contexts/WhatsAppContext'
import { useAI } from '../contexts/AIContext'
import { toast } from 'react-hot-toast'

const Messages = () => {
  const { 
    messages, 
    conversations, 
    sendMessage, 
    isConnected, 
    phoneNumber,
    loading 
  } = useWhatsApp()
  
  const { aiConfig, processAutoReply } = useAI()
  
  const [selectedChat, setSelectedChat] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sending, setSending] = useState(false)

  // Selecionar primeira conversa automaticamente
  useEffect(() => {
    if (conversations.length > 0 && !selectedChat) {
      setSelectedChat(conversations[0])
    }
  }, [conversations, selectedChat])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedChat || !isConnected) {
      if (!isConnected) {
        toast.error('WhatsApp não está conectado')
      }
      return
    }

    setSending(true)
    try {
      await sendMessage(selectedChat.contact_number, newMessage, {
        contactName: selectedChat.contact_name,
        type: 'text'
      })
      
      setNewMessage('')
      
      // Simular resposta automática se ativada
      if (aiConfig.autoReply) {
        setTimeout(async () => {
          const mockIncomingMessage = {
            body: `Resposta automática para: "${newMessage}"`,
            from: selectedChat.contact_number,
            fromName: selectedChat.contact_name
          }
          
          const aiResponse = await processAutoReply(mockIncomingMessage)
          if (aiResponse) {
            await sendMessage(selectedChat.contact_number, aiResponse.content, {
              contactName: 'WhatsApp AI',
              type: 'text'
            })
          }
        }, aiConfig.responseDelay)
      }
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      toast.error('Erro ao enviar mensagem')
    } finally {
      setSending(false)
    }
  }

  const filteredConversations = conversations.filter(conversation =>
    (conversation.contact_name || conversation.contact_number)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  const getMessagesForChat = (contactNumber) => {
    return messages.filter(message => 
      message.from_number === contactNumber || 
      message.to_number === contactNumber
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  }

  const formatTime = (dateString) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem'
    } else {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      }).format(date)
    }
  }

  const chatMessages = selectedChat ? getMessagesForChat(selectedChat.contact_number) : []

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-gray-900">Mensagens</h1>
          {!isConnected && (
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
              WhatsApp Desconectado
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
            />
          </div>
          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
            <SafeIcon icon={FiFilter} className="text-xl" />
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Chat List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">
              Conversas ({filteredConversations.length})
            </h3>
          </div>
          
          <div className="overflow-y-auto max-h-96">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Carregando conversas...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  onClick={() => setSelectedChat(conversation)}
                  className={`p-4 cursor-pointer border-b border-gray-100 transition-colors ${
                    selectedChat?.id === conversation.id ? 'bg-whatsapp-green/10 border-whatsapp-green/20' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-whatsapp-green rounded-full flex items-center justify-center text-white font-semibold">
                      {(conversation.contact_name || conversation.contact_number).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 truncate">
                          {conversation.contact_name || conversation.contact_number}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {conversation.last_message_at ? formatDate(conversation.last_message_at) : ''}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.contact_number}
                      </p>
                    </div>
                    {conversation.unread_count > 0 && (
                      <div className="w-5 h-5 bg-whatsapp-green text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unread_count}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Chat Window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col"
        >
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-whatsapp-green rounded-full flex items-center justify-center text-white font-semibold">
                      {(selectedChat.contact_name || selectedChat.contact_number).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedChat.contact_name || selectedChat.contact_number}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {isConnected ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  
                  {aiConfig.autoReply && (
                    <div className={`flex items-center space-x-2 text-sm px-3 py-1 rounded-full ${
                      aiConfig.provider === 'pollinations' 
                        ? 'text-pink-600 bg-pink-50' 
                        : aiConfig.provider === 'pollinations-text'
                        ? 'text-cyan-600 bg-cyan-50'
                        : 'text-purple-600 bg-purple-50'
                    }`}>
                      <SafeIcon icon={
                        aiConfig.provider === 'pollinations' ? FiImage : 
                        aiConfig.provider === 'pollinations-text' ? FiZap : FiCpu
                      } className="text-xs" />
                      <span>Auto-resposta ativa</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-0">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <SafeIcon icon={FiMessageSquare} className="text-4xl mx-auto mb-2" />
                    <p>Nenhuma mensagem ainda</p>
                    <p className="text-sm">Envie uma mensagem para iniciar a conversa</p>
                  </div>
                ) : (
                  chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.direction === 'incoming' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.direction === 'incoming'
                          ? 'bg-gray-100 text-gray-900'
                          : message.from_name?.includes('AI') || message.from_name?.includes('WhatsApp AI')
                          ? aiConfig.provider === 'pollinations' 
                            ? 'bg-pink-100 text-pink-900'
                            : aiConfig.provider === 'pollinations-text'
                            ? 'bg-cyan-100 text-cyan-900'
                            : 'bg-purple-100 text-purple-900'
                          : 'bg-whatsapp-green text-white'
                      }`}>
                        {(message.from_name?.includes('AI') || message.from_name?.includes('WhatsApp AI')) && (
                          <div className="flex items-center space-x-1 mb-1">
                            <SafeIcon 
                              icon={
                                aiConfig.provider === 'pollinations' ? FiImage : 
                                aiConfig.provider === 'pollinations-text' ? FiZap : FiCpu
                              } 
                              className="text-xs" 
                            />
                            <span className="text-xs font-medium">
                              {aiConfig.provider === 'pollinations' ? 'Pollinations Image' : 
                               aiConfig.provider === 'pollinations-text' ? 'Pollinations Text' : 'IA Assistant'}
                            </span>
                          </div>
                        )}
                        
                        <p className="text-sm whitespace-pre-line">{message.body}</p>
                        <p className={`text-xs mt-1 ${
                          message.direction === 'incoming' ? 'text-gray-500' : 
                          message.from_name?.includes('AI') ? 
                            aiConfig.provider === 'pollinations' ? 'text-pink-600' :
                            aiConfig.provider === 'pollinations-text' ? 'text-cyan-600' : 'text-purple-600'
                          : 'text-white/70'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={
                      !isConnected ? "WhatsApp não conectado..." :
                      aiConfig.provider === 'pollinations' 
                        ? "Digite sua mensagem ou descrição para gerar imagem..."
                        : aiConfig.provider === 'pollinations-text'
                        ? "Digite sua mensagem para a IA de texto..."
                        : "Digite sua mensagem..."
                    }
                    disabled={!isConnected}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || !isConnected || sending}
                    className="p-2 bg-whatsapp-green hover:bg-whatsapp-dark text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SafeIcon icon={FiSend} className="text-xl" />
                  </button>
                </div>
                
                {aiConfig.autoReply && isConnected && (
                  <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                    <SafeIcon icon={
                      aiConfig.provider === 'pollinations' ? FiImage : 
                      aiConfig.provider === 'pollinations-text' ? FiZap : FiCpu
                    } />
                    <span>
                      Auto-resposta ativa via {aiConfig.provider} • Delay: {aiConfig.responseDelay}ms
                    </span>
                  </p>
                )}
                
                {!isConnected && (
                  <p className="text-xs text-red-500 mt-2">
                    Conecte o WhatsApp para enviar mensagens
                  </p>
                )}
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <SafeIcon icon={FiMessageSquare} className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecione uma conversa
                </h3>
                <p className="text-gray-500">
                  Escolha uma conversa da lista para visualizar as mensagens
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Messages