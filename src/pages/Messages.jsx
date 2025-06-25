import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useWhatsApp } from '../contexts/WhatsAppContext';
import { useAI } from '../contexts/AIContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { FiMessageSquare, FiSend, FiUser, FiCpu, FiSearch, FiFilter, FiImage, FiZap } = FiIcons;

const Messages = () => {
  const { messages, sendMessage } = useWhatsApp();
  const { generateAIResponse, aiConfig } = useAI();
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data para demonstração
  const mockChats = [
    {
      id: 1,
      name: 'João Silva',
      lastMessage: 'Olá, preciso de ajuda com meu pedido',
      timestamp: new Date(),
      unread: 2,
      avatar: 'JS'
    },
    {
      id: 2,
      name: 'Maria Santos',
      lastMessage: 'Obrigada pela ajuda!',
      timestamp: new Date(Date.now() - 300000),
      unread: 0,
      avatar: 'MS'
    },
    {
      id: 3,
      name: 'Carlos Oliveira',
      lastMessage: 'Quando chegará meu produto?',
      timestamp: new Date(Date.now() - 600000),
      unread: 1,
      avatar: 'CO'
    },
    {
      id: 4,
      name: 'Ana Costa',
      lastMessage: aiConfig.provider === 'pollinations-text' ? 'Como funciona a IA de texto?' : 'Gere uma imagem de um gato fofo',
      timestamp: new Date(Date.now() - 900000),
      unread: 0,
      avatar: 'AC'
    }
  ];

  const mockMessages = [
    {
      id: 1,
      sender: 'João Silva',
      message: 'Olá, preciso de ajuda com meu pedido',
      timestamp: new Date(Date.now() - 900000),
      type: 'incoming'
    },
    {
      id: 2,
      sender: 'IA Assistant',
      message: aiConfig.provider === 'pollinations-text' 
        ? 'Olá! Como assistente IA via Pollinations Text, posso ajudá-lo com seu pedido usando modelos avançados de linguagem. Pode me fornecer o número do pedido?'
        : 'Olá! Claro, posso ajudá-lo com seu pedido. Pode me fornecer o número do pedido?',
      timestamp: new Date(Date.now() - 870000),
      type: aiConfig.provider === 'pollinations-text' ? 'text-ai' : 'ai'
    },
    {
      id: 3,
      sender: 'Ana Costa',
      message: aiConfig.provider === 'pollinations-text' 
        ? 'Como funciona a IA de texto da Pollinations? Quais modelos estão disponíveis?'
        : 'Gere uma imagem de um gato fofo brincando no jardim',
      timestamp: new Date(Date.now() - 600000),
      type: 'incoming'
    },
    {
      id: 4,
      sender: 'IA Assistant',
      message: aiConfig.provider === 'pollinations-text'
        ? 'Utilizando Pollinations Text API, temos acesso a múltiplos modelos de IA:\n\n• OpenAI: Modelo versátil e preciso\n• Mistral: IA francesa com excelente performance\n• Claude: Assistente thoughtful da Anthropic\n\nTodos gratuitos via text.pollinations.ai! 🚀'
        : aiConfig.provider === 'pollinations'
        ? 'Imagem gerada com sucesso! 🎨\n\nPrompt: "Gere uma imagem de um gato fofo brincando no jardim"\nModelo: flux'
        : 'Claro! Vou processar sua solicitação.',
      timestamp: new Date(Date.now() - 590000),
      type: aiConfig.provider === 'pollinations-text' ? 'text-ai' : aiConfig.provider === 'pollinations' ? 'ai' : 'ai',
      imageUrl: aiConfig.provider === 'pollinations' ? 'https://image.pollinations.ai/prompt/high%20quality,%20detailed,%20cute%20cat%20playing%20in%20garden?model=flux&width=1024&height=1024&seed=123456' : null,
      isImage: aiConfig.provider === 'pollinations'
    },
    {
      id: 5,
      sender: 'Ana Costa',
      message: aiConfig.provider === 'pollinations-text' ? 'Incrível! Vou testar.' : 'Perfeita! Obrigada!',
      timestamp: new Date(Date.now() - 300000),
      type: 'incoming'
    }
  ];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    await sendMessage(selectedChat.name, newMessage);
    
    // Simular resposta automática da IA se estiver ativada
    if (aiConfig.autoReply) {
      setTimeout(async () => {
        const aiResponse = await generateAIResponse(newMessage);
        // Aqui você adicionaria a resposta da IA às mensagens
        console.log('Resposta da IA:', aiResponse);
      }, aiConfig.responseDelay);
    }
    
    setNewMessage('');
  };

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mensagens</h1>
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
            <h3 className="font-semibold text-gray-900">Conversas Ativas</h3>
          </div>
          
          <div className="overflow-y-auto max-h-96">
            {filteredChats.map((chat) => (
              <motion.div
                key={chat.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 cursor-pointer border-b border-gray-100 transition-colors ${
                  selectedChat?.id === chat.id ? 'bg-whatsapp-green/10 border-whatsapp-green/20' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-whatsapp-green rounded-full flex items-center justify-center text-white font-semibold">
                    {chat.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 truncate">{chat.name}</h4>
                      <span className="text-xs text-gray-500">
                        {format(chat.timestamp, 'HH:mm', { locale: ptBR })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="w-5 h-5 bg-whatsapp-green text-white text-xs rounded-full flex items-center justify-center">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
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
                      {selectedChat.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
                      <p className="text-sm text-gray-500">Online</p>
                    </div>
                  </div>
                  {aiConfig.provider === 'pollinations' && (
                    <div className="flex items-center space-x-2 text-sm text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
                      <SafeIcon icon={FiImage} className="text-xs" />
                      <span>Geração de Imagens Ativa</span>
                    </div>
                  )}
                  {aiConfig.provider === 'pollinations-text' && (
                    <div className="flex items-center space-x-2 text-sm text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">
                      <SafeIcon icon={FiZap} className="text-xs" />
                      <span>Text AI Ativa</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-0">
                {mockMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'incoming' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'incoming'
                        ? 'bg-gray-100 text-gray-900'
                        : message.type === 'ai'
                        ? 'bg-purple-100 text-purple-900'
                        : message.type === 'text-ai'
                        ? 'bg-cyan-100 text-cyan-900'
                        : 'bg-whatsapp-green text-white'
                    }`}>
                      {(message.type === 'ai' || message.type === 'text-ai') && (
                        <div className="flex items-center space-x-1 mb-1">
                          <SafeIcon 
                            icon={
                              message.isImage ? FiImage : 
                              message.type === 'text-ai' ? FiZap : FiCpu
                            } 
                            className="text-xs" 
                          />
                          <span className="text-xs font-medium">
                            {message.isImage ? 'IA Pollinations' : 
                             message.type === 'text-ai' ? 'Pollinations Text' : 'IA'}
                          </span>
                        </div>
                      )}
                      
                      {message.isImage && message.imageUrl && (
                        <div className="mb-2">
                          <img 
                            src={message.imageUrl} 
                            alt="Imagem gerada pela IA"
                            className="max-w-full h-auto rounded-lg border"
                            loading="lazy"
                          />
                        </div>
                      )}
                      
                      <p className="text-sm whitespace-pre-line">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'incoming' ? 'text-gray-500' : 
                        message.type === 'ai' ? 'text-purple-600' : 
                        message.type === 'text-ai' ? 'text-cyan-600' : 'text-white/70'
                      }`}>
                        {format(message.timestamp, 'HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={
                      aiConfig.provider === 'pollinations' 
                        ? "Digite sua mensagem ou descrição para gerar imagem..."
                        : aiConfig.provider === 'pollinations-text'
                        ? "Digite sua mensagem para a IA de texto..."
                        : "Digite sua mensagem..."
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-2 bg-whatsapp-green hover:bg-whatsapp-dark text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SafeIcon icon={FiSend} className="text-xl" />
                  </button>
                </div>
                {aiConfig.provider === 'pollinations' && (
                  <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                    <SafeIcon icon={FiImage} />
                    <span>Mensagens serão interpretadas como prompts para geração de imagens</span>
                  </p>
                )}
                {aiConfig.provider === 'pollinations-text' && (
                  <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                    <SafeIcon icon={FiZap} />
                    <span>Respostas inteligentes via Pollinations Text API ({aiConfig.pollinationsText?.model})</span>
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
  );
};

export default Messages;