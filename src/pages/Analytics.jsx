import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import ReactECharts from 'echarts-for-react';
import { useAI } from '../contexts/AIContext';

const { FiBarChart3, FiTrendingUp, FiMessageSquare, FiClock, FiUsers, FiCpu, FiImage } = FiIcons;

const Analytics = () => {
  const { aiConfig } = useAI();
  const isPollinationsActive = aiConfig.provider === 'pollinations';

  // Configuração do gráfico de mensagens por hora
  const messagesChartOption = {
    title: {
      text: isPollinationsActive ? 'Atividade por Hora' : 'Mensagens por Hora',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['00h', '04h', '08h', '12h', '16h', '20h']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Mensagens Recebidas',
        type: 'line',
        data: [12, 8, 25, 45, 38, 22],
        smooth: true,
        itemStyle: { color: '#25D366' }
      },
      {
        name: isPollinationsActive ? 'Imagens Geradas' : 'Respostas IA',
        type: 'line',
        data: isPollinationsActive ? [8, 4, 15, 28, 22, 14] : [10, 6, 20, 38, 32, 18],
        smooth: true,
        itemStyle: { color: isPollinationsActive ? '#EC4899' : '#8B5CF6' }
      }
    ],
    legend: {
      data: ['Mensagens Recebidas', isPollinationsActive ? 'Imagens Geradas' : 'Respostas IA'],
      bottom: 0
    }
  };

  // Configuração do gráfico de tipos de resposta
  const responseTypesOption = {
    title: {
      text: isPollinationsActive ? 'Tipos de Conteúdo' : 'Tipos de Resposta',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: 'Tipos',
        type: 'pie',
        radius: '60%',
        data: isPollinationsActive ? [
          { value: 45, name: 'Imagens Geradas' },
          { value: 35, name: 'Mensagens de Texto' },
          { value: 15, name: 'Comandos de Sistema' },
          { value: 5, name: 'Erros' }
        ] : [
          { value: 65, name: 'IA Automática' },
          { value: 25, name: 'Manual' },
          { value: 10, name: 'Sem Resposta' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

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
      title: isPollinationsActive ? 'Imagens Geradas' : 'Respostas da IA',
      value: isPollinationsActive ? '342' : '892',
      change: isPollinationsActive ? '+45%' : '+31%',
      icon: isPollinationsActive ? FiImage : FiCpu,
      color: isPollinationsActive ? 'text-pink-600' : 'text-purple-600',
      bg: isPollinationsActive ? 'bg-pink-100' : 'bg-purple-100'
    },
    {
      title: 'Tempo Médio de Resposta',
      value: isPollinationsActive ? '8.5s' : '2.3s',
      change: isPollinationsActive ? '+5%' : '-12%',
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
  ];

  const topQuestions = isPollinationsActive ? [
    { question: 'Gere uma imagem de paisagem', count: 67 },
    { question: 'Crie um retrato artístico', count: 54 },
    { question: 'Desenhe um animal fofo', count: 43 },
    { question: 'Faça uma logo moderna', count: 38 },
    { question: 'Crie uma ilustração fantasy', count: 29 }
  ] : [
    { question: 'Como rastrear meu pedido?', count: 45 },
    { question: 'Qual o prazo de entrega?', count: 38 },
    { question: 'Como fazer um pedido?', count: 32 },
    { question: 'Formas de pagamento?', count: 28 },
    { question: 'Como cancelar pedido?', count: 22 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          {isPollinationsActive && (
            <div className="flex items-center space-x-2 bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
              <SafeIcon icon={FiImage} />
              <span>Pollinations Ativo</span>
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
      {isPollinationsActive && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg p-6 text-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        {/* Messages Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <ReactECharts option={messagesChartOption} style={{ height: '300px' }} />
        </motion.div>

        {/* Response Types Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <ReactECharts option={responseTypesOption} style={{ height: '300px' }} />
        </motion.div>
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
              isPollinationsActive ? 'bg-pink-100' : 'bg-blue-100'
            }`}>
              <SafeIcon 
                icon={isPollinationsActive ? FiImage : FiBarChart3} 
                className={`text-xl ${isPollinationsActive ? 'text-pink-600' : 'text-blue-600'}`} 
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {isPollinationsActive ? 'Prompts Mais Populares' : 'Perguntas Mais Frequentes'}
              </h3>
              <p className="text-sm text-gray-500">Baseado nas últimas interações</p>
            </div>
          </div>

          <div className="space-y-3">
            {topQuestions.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <span className={`flex items-center justify-center w-6 h-6 text-white text-xs font-medium rounded-full ${
                    isPollinationsActive ? 'bg-pink-500' : 'bg-gray-500'
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
                Performance {isPollinationsActive ? 'do Pollinations' : 'da IA'}
              </h3>
              <p className="text-sm text-gray-500">Métricas de eficiência</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Taxa de Sucesso</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: isPollinationsActive ? '98%' : '94%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{isPollinationsActive ? '98%' : '94%'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Satisfação do Cliente</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: isPollinationsActive ? '92%' : '88%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{isPollinationsActive ? '92%' : '88%'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {isPollinationsActive ? 'Qualidade das Imagens' : 'Precisão das Respostas'}
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${isPollinationsActive ? 'bg-pink-500' : 'bg-purple-500'}`} style={{ width: isPollinationsActive ? '96%' : '92%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{isPollinationsActive ? '96%' : '92%'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Economia de Tempo</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: isPollinationsActive ? '85%' : '76%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{isPollinationsActive ? '85%' : '76%'}</span>
              </div>
            </div>
          </div>

          {isPollinationsActive && (
            <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
              <h4 className="font-medium text-pink-900 mb-2">Configurações Ativas:</h4>
              <div className="text-sm text-pink-800 space-y-1">
                <div>Modelo: {aiConfig.model}</div>
                <div>Dimensões: {aiConfig.pollinations?.imageWidth}x{aiConfig.pollinations?.imageHeight}</div>
                <div>Estilo: {aiConfig.pollinations?.imageStyle}</div>
                <div>Prefixo: {aiConfig.pollinations?.imagePromptPrefix}</div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;