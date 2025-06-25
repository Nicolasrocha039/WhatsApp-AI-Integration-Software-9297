import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useWhatsApp } from '../contexts/WhatsAppContext';
import { useAI } from '../contexts/AIContext';

const { FiMessageSquare, FiUsers, FiCpu, FiTrendingUp, FiActivity, FiClock, FiImage, FiZap } = FiIcons;

const Dashboard = () => {
  const { isConnected, messages } = useWhatsApp();
  const { aiConfig } = useAI();

  const stats = [
    {
      title: 'Mensagens Hoje',
      value: '147',
      change: '+12%',
      icon: FiMessageSquare,
      color: 'bg-blue-500'
    },
    {
      title: 'Conversas Ativas',
      value: '23',
      change: '+5%',
      icon: FiUsers,
      color: 'bg-green-500'
    },
    {
      title: aiConfig.provider === 'pollinations' ? 'Imagens Geradas' : 
             aiConfig.provider === 'pollinations-text' ? 'Respostas IA Text' : 'Respostas IA',
      value: aiConfig.provider === 'pollinations' ? '34' : 
             aiConfig.provider === 'pollinations-text' ? '156' : '89',
      change: '+18%',
      icon: aiConfig.provider === 'pollinations' ? FiImage : 
            aiConfig.provider === 'pollinations-text' ? FiZap : FiCpu,
      color: aiConfig.provider === 'pollinations' ? 'bg-pink-500' : 
             aiConfig.provider === 'pollinations-text' ? 'bg-cyan-500' : 'bg-purple-500'
    },
    {
      title: 'Taxa de Resposta',
      value: '94%',
      change: '+2%',
      icon: FiTrendingUp,
      color: 'bg-orange-500'
    }
  ];

  const recentActivity = [
    { type: 'message', user: 'João Silva', action: 'enviou uma mensagem', time: '2 min atrás' },
    { 
      type: aiConfig.provider === 'pollinations' ? 'image' : 
            aiConfig.provider === 'pollinations-text' ? 'text-ai' : 'ai',
      user: aiConfig.provider === 'pollinations' ? 'Pollinations Image' : 
            aiConfig.provider === 'pollinations-text' ? 'Pollinations Text' : 'IA Assistant',
      action: aiConfig.provider === 'pollinations' ? 'gerou uma imagem' : 
              aiConfig.provider === 'pollinations-text' ? 'respondeu via Text API' : 'respondeu automaticamente',
      time: '5 min atrás' 
    },
    { type: 'message', user: 'Maria Santos', action: 'iniciou uma conversa', time: '10 min atrás' },
    { 
      type: aiConfig.provider === 'pollinations' ? 'image' : 
            aiConfig.provider === 'pollinations-text' ? 'text-ai' : 'ai',
      user: aiConfig.provider === 'pollinations' ? 'Pollinations Image' : 
            aiConfig.provider === 'pollinations-text' ? 'Pollinations Text' : 'IA Assistant',
      action: aiConfig.provider === 'pollinations' ? 'processou 2 solicitações de imagem' : 
              aiConfig.provider === 'pollinations-text' ? 'processou 4 mensagens de texto' : 'processou 3 mensagens',
      time: '15 min atrás' 
    }
  ];

  const getProviderStatus = () => {
    if (aiConfig.provider === 'pollinations') {
      return {
        name: 'Pollinations Image AI',
        status: 'Ativo',
        color: 'text-pink-600',
        bgColor: 'bg-pink-500'
      };
    }
    if (aiConfig.provider === 'pollinations-text') {
      return {
        name: 'Pollinations Text AI',
        status: 'Ativo',
        color: 'text-cyan-600',
        bgColor: 'bg-cyan-500'
      };
    }
    return {
      name: `IA (${aiConfig.provider})`,
      status: aiConfig.apiKey ? 'Configurado' : 'Pendente',
      color: aiConfig.apiKey ? 'text-green-600' : 'text-yellow-600',
      bgColor: aiConfig.apiKey ? 'bg-green-500' : 'bg-yellow-500'
    };
  };

  const providerInfo = getProviderStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <SafeIcon icon={FiClock} />
          <span>Última atualização: agora</span>
        </div>
      </div>

      {/* Pollinations Banner */}
      {(aiConfig.provider === 'pollinations' || aiConfig.provider === 'pollinations-text') && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg p-4 text-white ${
            aiConfig.provider === 'pollinations' 
              ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500'
              : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500'
          }`}
        >
          <div className="flex items-center space-x-3">
            <SafeIcon icon={aiConfig.provider === 'pollinations' ? FiImage : FiZap} className="text-2xl" />
            <div>
              <h3 className="font-semibold">
                {aiConfig.provider === 'pollinations' ? 'Pollinations Image AI Ativo' : 'Pollinations Text AI Ativo'}
              </h3>
              <p className="text-sm opacity-90">
                {aiConfig.provider === 'pollinations' 
                  ? 'Geração gratuita de imagens com IA está ativada. Suas mensagens serão interpretadas como prompts para criação de imagens.'
                  : 'IA de texto gratuita via Pollinations está ativa. Respostas inteligentes usando modelos OpenAI, Mistral e Claude.'
                }
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <SafeIcon icon={stat.icon} className="text-white text-xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status da Conexão</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium">WhatsApp</span>
              </div>
              <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${providerInfo.bgColor}`}></div>
                <span className="font-medium flex items-center space-x-2">
                  <span>{providerInfo.name}</span>
                  {aiConfig.provider === 'pollinations' && <SafeIcon icon={FiImage} className="text-sm text-pink-600" />}
                  {aiConfig.provider === 'pollinations-text' && <SafeIcon icon={FiZap} className="text-sm text-cyan-600" />}
                </span>
              </div>
              <span className={`text-sm font-medium ${providerInfo.color}`}>
                {providerInfo.status}
              </span>
            </div>

            {aiConfig.provider === 'pollinations' && (
              <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                <div className="flex items-center space-x-2 mb-2">
                  <SafeIcon icon={FiImage} className="text-pink-600" />
                  <span className="font-medium text-pink-800">Configurações Pollinations Image</span>
                </div>
                <div className="text-sm text-pink-700 space-y-1">
                  <div>Modelo: {aiConfig.model}</div>
                  <div>Dimensões: {aiConfig.pollinations?.imageWidth}x{aiConfig.pollinations?.imageHeight}</div>
                  <div>Geração: {aiConfig.pollinations?.enableImageGeneration ? 'Ativa' : 'Inativa'}</div>
                </div>
              </div>
            )}

            {aiConfig.provider === 'pollinations-text' && (
              <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <div className="flex items-center space-x-2 mb-2">
                  <SafeIcon icon={FiZap} className="text-cyan-600" />
                  <span className="font-medium text-cyan-800">Configurações Pollinations Text</span>
                </div>
                <div className="text-sm text-cyan-700 space-y-1">
                  <div>Modelo: {aiConfig.pollinationsText?.model}</div>
                  <div>Tokens: {aiConfig.pollinationsText?.maxTokens}</div>
                  <div>Temperatura: {aiConfig.pollinationsText?.temperature}</div>
                  <div>Sistema: {aiConfig.pollinationsText?.useSystemPrompt ? 'Ativo' : 'Inativo'}</div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'ai' ? 'bg-purple-100' : 
                  activity.type === 'image' ? 'bg-pink-100' : 
                  activity.type === 'text-ai' ? 'bg-cyan-100' : 'bg-blue-100'
                }`}>
                  <SafeIcon 
                    icon={
                      activity.type === 'ai' ? FiCpu : 
                      activity.type === 'image' ? FiImage : 
                      activity.type === 'text-ai' ? FiZap : FiMessageSquare
                    } 
                    className={`text-sm ${
                      activity.type === 'ai' ? 'text-purple-600' : 
                      activity.type === 'image' ? 'text-pink-600' : 
                      activity.type === 'text-ai' ? 'text-cyan-600' : 'text-blue-600'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-500">{activity.action}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-whatsapp-green/10 hover:bg-whatsapp-green/20 rounded-lg transition-colors">
            <SafeIcon icon={FiMessageSquare} className="text-whatsapp-green text-xl" />
            <span className="font-medium text-whatsapp-green">Enviar Mensagem</span>
          </button>
          
          <button className={`flex items-center space-x-3 p-4 rounded-lg transition-colors ${
            aiConfig.provider === 'pollinations' 
              ? 'bg-pink-50 hover:bg-pink-100' 
              : aiConfig.provider === 'pollinations-text'
              ? 'bg-cyan-50 hover:bg-cyan-100'
              : 'bg-purple-50 hover:bg-purple-100'
          }`}>
            <SafeIcon 
              icon={
                aiConfig.provider === 'pollinations' ? FiImage : 
                aiConfig.provider === 'pollinations-text' ? FiZap : FiCpu
              } 
              className={`text-xl ${
                aiConfig.provider === 'pollinations' ? 'text-pink-600' : 
                aiConfig.provider === 'pollinations-text' ? 'text-cyan-600' : 'text-purple-600'
              }`} 
            />
            <span className={`font-medium ${
              aiConfig.provider === 'pollinations' ? 'text-pink-600' : 
              aiConfig.provider === 'pollinations-text' ? 'text-cyan-600' : 'text-purple-600'
            }`}>
              {aiConfig.provider === 'pollinations' ? 'Gerar Imagem' : 
               aiConfig.provider === 'pollinations-text' ? 'Testar Text AI' : 'Configurar IA'}
            </span>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <SafeIcon icon={FiActivity} className="text-blue-600 text-xl" />
            <span className="font-medium text-blue-600">Ver Relatórios</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;