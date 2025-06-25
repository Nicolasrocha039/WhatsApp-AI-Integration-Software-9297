import React from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../common/SafeIcon'
import { FiBarChart3, FiTrendingUp, FiMessageSquare, FiClock, FiUsers, FiCpu, FiImage, FiZap } from 'react-icons/fi'
import { useAI } from '../contexts/AIContext'

const Analytics = () => {
  const { aiConfig } = useAI()
  const isPollinationsImageActive = aiConfig.provider === 'pollinations'
  const isPollinationsTextActive = aiConfig.provider === 'pollinations-text'
  const isPollinationsProvider = isPollinationsImageActive || isPollinationsTextActive

  const stats = [
    {
      title: 'Total de Mensagens',
      value: '1,247',
      change: '+23%',
      icon: FiMessageSquare,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: isPollinationsImageActive ? 'Imagens Geradas' : 
             isPollinationsTextActive ? 'Respostas Text AI' : 'Respostas da IA',
      value: isPollinationsImageActive ? '342' : 
             isPollinationsTextActive ? '1,156' : '892',
      change: isPollinationsImageActive ? '+45%' : 
              isPollinationsTextActive ? '+67%' : '+31%',
      icon: isPollinationsImageActive ? FiImage : 
            isPollinationsTextActive ? FiZap : FiCpu,
      color: isPollinationsImageActive ? 'text-pink-600' : 
             isPollinationsTextActive ? 'text-cyan-600' : 'text-purple-600',
      bg: isPollinationsImageActive ? 'bg-pink-100' : 
          isPollinationsTextActive ? 'bg-cyan-100' : 'bg-purple-100'
    },
    {
      title: 'Tempo Médio de Resposta',
      value: isPollinationsImageActive ? '8.5s' : 
             isPollinationsTextActive ? '1.8s' : '2.3s',
      change: isPollinationsImageActive ? '+5%' : 
              isPollinationsTextActive ? '-25%' : '-12%',
      icon: FiClock,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Usuários Únicos',
      value: '156',
      change: '+18%',
      icon: FiUsers,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ]

  const topQuestions = isPollinationsImageActive ? [
    { question: 'Gere uma imagem de paisagem', count: 67 },
    { question: 'Crie um retrato artístico', count: 54 },
    { question: 'Desenhe um animal fofo', count: 43 },
    { question: 'Faça uma logo moderna', count: 38 },
    { question: 'Crie uma ilustração fantasy', count: 29 }
  ] : isPollinationsTextActive ? [
    { question: 'Como posso ajudá-lo?', count: 89 },
    { question: 'Explique este conceito', count: 67 },
    { question: 'Qual a diferença entre...', count: 54 },
    { question: 'Como resolver este problema', count: 43 },
    { question: 'Dê-me sugestões sobre', count: 38 }
  ] : [
    { question: 'Como rastrear meu pedido?', count: 45 },
    { question: 'Qual o prazo de entrega?', count: 38 },
    { question: 'Como fazer um pedido?', count: 32 },
    { question: 'Formas de pagamento?', count: 28 },
    { question: 'Como cancelar pedido?', count: 22 }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          {isPollinationsImageActive && (
            <div className="flex items-center space-x-2 bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
              <SafeIcon icon={FiImage} />
              <span>Pollinations Image Ativo</span>
            </div>
          )}
          {isPollinationsTextActive && (
            <div className="flex items-center space-x-2 bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">
              <SafeIcon icon={FiZap} />
              <span>Pollinations Text Ativo</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent">
            <option>Últimos 7 dias</option>
            <option>Últimos 30 dias</option>
            <option>Últimos 90 dias</option>
          </select>
        </div>
      </div>

      {/* Pollinations Performance Banner */}
      {isPollinationsProvider && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg p-6 text-white ${
            isPollinationsImageActive 
              ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500'
              : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {isPollinationsImageActive ? (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold">342</div>
                  <div className="text-sm opacity-90">Imagens Geradas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">8.5s</div>
                  <div className="text-sm opacity-90">Tempo Médio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">98.2%</div>
                  <div className="text-sm opacity-90">Taxa de Sucesso</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">1024x1024</div>
                  <div className="text-sm opacity-90">Resolução Padrão</div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold">1,156</div>
                  <div className="text-sm opacity-90">Respostas Geradas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">1.8s</div>
                  <div className="text-sm opacity-90">Tempo Médio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">99.1%</div>
                  <div className="text-sm opacity-90">Taxa de Sucesso</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{aiConfig.pollinationsText?.model?.toUpperCase()}</div>
                  <div className="text-sm opacity-90">Modelo Ativo</div>
                </div>
              </>
            )}
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
                <p className={`text-sm mt-1 ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} vs período anterior
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <SafeIcon icon={stat.icon} className={`text-xl ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Questions/Prompts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isPollinationsImageActive ? 'bg-pink-100' : 
              isPollinationsTextActive ? 'bg-cyan-100' : 'bg-blue-100'
            }`}>
              <SafeIcon 
                icon={
                  isPollinationsImageActive ? FiImage : 
                  isPollinationsTextActive ? FiZap : FiBarChart3
                } 
                className={`text-xl ${
                  isPollinationsImageActive ? 'text-pink-600' : 
                  isPollinationsTextActive ? 'text-cyan-600' : 'text-blue-600'
                }`} 
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {isPollinationsImageActive ? 'Prompts Mais Populares' : 
                 isPollinationsTextActive ? 'Perguntas Mais Frequentes' : 'Perguntas Mais Frequentes'}
              </h3>
              <p className="text-sm text-gray-500">Baseado nas últimas interações</p>
            </div>
          </div>

          <div className="space-y-3">
            {topQuestions.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <span className={`flex items-center justify-center w-6 h-6 text-white text-xs font-medium rounded-full ${
                    isPollinationsImageActive ? 'bg-pink-500' : 
                    isPollinationsTextActive ? 'bg-cyan-500' : 'bg-gray-500'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{item.question}</span>
                </div>
                <span className="text-sm text-gray-500">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiTrendingUp} className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Performance {isPollinationsImageActive ? 'do Pollinations Image' : 
                          isPollinationsTextActive ? 'do Pollinations Text' : 'da IA'}
              </h3>
              <p className="text-sm text-gray-500">Métricas de eficiência</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Taxa de Sucesso</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ 
                    width: isPollinationsImageActive ? '98%' : 
                           isPollinationsTextActive ? '99%' : '94%' 
                  }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {isPollinationsImageActive ? '98%' : 
                   isPollinationsTextActive ? '99%' : '94%'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Satisfação do Cliente</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ 
                    width: isPollinationsImageActive ? '92%' : 
                           isPollinationsTextActive ? '95%' : '88%' 
                  }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {isPollinationsImageActive ? '92%' : 
                   isPollinationsTextActive ? '95%' : '88%'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {isPollinationsImageActive ? 'Qualidade das Imagens' : 
                 isPollinationsTextActive ? 'Precisão das Respostas' : 'Precisão das Respostas'}
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${
                    isPollinationsImageActive ? 'bg-pink-500' : 
                    isPollinationsTextActive ? 'bg-cyan-500' : 'bg-purple-500'
                  }`} style={{ 
                    width: isPollinationsImageActive ? '96%' : 
                           isPollinationsTextActive ? '97%' : '92%' 
                  }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {isPollinationsImageActive ? '96%' : 
                   isPollinationsTextActive ? '97%' : '92%'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Economia de Tempo</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ 
                    width: isPollinationsImageActive ? '85%' : 
                           isPollinationsTextActive ? '92%' : '76%' 
                  }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {isPollinationsImageActive ? '85%' : 
                   isPollinationsTextActive ? '92%' : '76%'}
                </span>
              </div>
            </div>
          </div>

          {isPollinationsProvider && (
            <div className={`mt-6 p-4 rounded-lg border ${
              isPollinationsImageActive ? 'bg-pink-50 border-pink-200' : 'bg-cyan-50 border-cyan-200'
            }`}>
              <h4 className={`font-medium mb-2 ${
                isPollinationsImageActive ? 'text-pink-900' : 'text-cyan-900'
              }`}>Configurações Ativas:</h4>
              <div className={`text-sm space-y-1 ${
                isPollinationsImageActive ? 'text-pink-800' : 'text-cyan-800'
              }`}>
                {isPollinationsImageActive ? (
                  <>
                    <div>Modelo: {aiConfig.model}</div>
                    <div>Dimensões: {aiConfig.pollinations?.imageWidth}x{aiConfig.pollinations?.imageHeight}</div>
                    <div>Estilo: {aiConfig.pollinations?.imageStyle}</div>
                    <div>Prefixo: {aiConfig.pollinations?.imagePromptPrefix}</div>
                  </>
                ) : (
                  <>
                    <div>Modelo: {aiConfig.pollinationsText?.model}</div>
                    <div>Tokens: {aiConfig.pollinationsText?.maxTokens}</div>
                    <div>Temperatura: {aiConfig.pollinationsText?.temperature}</div>
                    <div>Sistema: {aiConfig.pollinationsText?.useSystemPrompt ? 'Ativo' : 'Inativo'}</div>
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Analytics