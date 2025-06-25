import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../common/SafeIcon'
import { 
  FiCpu, 
  FiSettings, 
  FiSave, 
  FiEye, 
  FiEyeOff, 
  FiHelpCircle, 
  FiImage, 
  FiPlay, 
  FiMessageCircle, 
  FiZap 
} from 'react-icons/fi'
import { useAI } from '../contexts/AIContext'
import { toast } from 'react-hot-toast'

const AIConfig = () => {
  const { 
    aiConfig, 
    aiProviders, 
    updateAIConfig, 
    testPollinationsConnection, 
    testPollinationsTextAPI 
  } = useAI()
  
  const [showApiKey, setShowApiKey] = useState(false)
  const [tempConfig, setTempConfig] = useState(aiConfig)
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(false)
  const [testMessage, setTestMessage] = useState('')

  const handleInputChange = (field, value, section = null) => {
    if (section) {
      setTempConfig(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }))
    } else {
      setTempConfig(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSave = () => {
    updateAIConfig(tempConfig)
    toast.success('Configurações salvas com sucesso!')
  }

  const handleTest = async () => {
    setTesting(true)
    try {
      if (tempConfig.provider === 'pollinations') {
        const result = await testPollinationsConnection()
        setTestResult(result)
      } else if (tempConfig.provider === 'pollinations-text') {
        const message = testMessage || 'Olá, como você pode me ajudar hoje?'
        const result = await testPollinationsTextAPI(message)
        setTestResult(result)
      } else {
        toast.info('Teste disponível apenas para Pollinations por enquanto.')
      }
    } catch (error) {
      setTestResult({ success: false, error: error.message })
    }
    setTesting(false)
  }

  const selectedProvider = aiProviders.find(p => p.id === tempConfig.provider)
  const isPollinationsSelected = tempConfig.provider === 'pollinations'
  const isPollinationsTextSelected = tempConfig.provider === 'pollinations-text'
  const isPollinationsProvider = isPollinationsSelected || isPollinationsTextSelected

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Configuração da IA</h1>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-4 py-2 bg-whatsapp-green hover:bg-whatsapp-dark text-white rounded-lg transition-colors"
        >
          <SafeIcon icon={FiSave} />
          <span>Salvar Configurações</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Provider Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 lg:col-span-2"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <SafeIcon 
                icon={
                  isPollinationsSelected ? FiImage : 
                  isPollinationsTextSelected ? FiMessageCircle : FiCpu
                } 
                className="text-purple-600 text-xl" 
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Provedor de IA</h3>
              <p className="text-sm text-gray-500">Escolha o serviço de inteligência artificial</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provedor
              </label>
              <select
                value={tempConfig.provider}
                onChange={(e) => handleInputChange('provider', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
              >
                {aiProviders.map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name} 
                    {provider.type === 'image' && ' 🎨'} 
                    {provider.id === 'pollinations-text' && ' ⚡'}
                    {!provider.requiresApiKey && ' (Gratuito)'}
                  </option>
                ))}
              </select>
              {selectedProvider?.description && (
                <p className="text-xs text-gray-500 mt-1">{selectedProvider.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isPollinationsSelected ? 'Modelo de Imagem' : 'Modelo'}
              </label>
              <select
                value={isPollinationsTextSelected ? tempConfig.pollinationsText.model : tempConfig.model}
                onChange={(e) => {
                  if (isPollinationsTextSelected) {
                    handleInputChange('model', e.target.value, 'pollinationsText')
                  } else {
                    handleInputChange('model', e.target.value)
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
              >
                {selectedProvider?.models.map(model => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {selectedProvider?.requiresApiKey && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chave da API
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={tempConfig.apiKey}
                    onChange={(e) => handleInputChange('apiKey', e.target.value)}
                    placeholder="Cole sua chave da API aqui"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <SafeIcon icon={showApiKey ? FiEyeOff : FiEye} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status da IA</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Provedor:</span>
              <span className="text-sm font-medium">{selectedProvider?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tipo:</span>
              <span className="text-sm font-medium flex items-center space-x-1">
                {selectedProvider?.type === 'image' ? (
                  <>
                    <SafeIcon icon={FiImage} className="text-xs" />
                    <span>Imagem</span>
                  </>
                ) : (
                  <>
                    <SafeIcon icon={isPollinationsTextSelected ? FiMessageCircle : FiCpu} className="text-xs" />
                    <span>Texto</span>
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Modelo:</span>
              <span className="text-sm font-medium">
                {isPollinationsTextSelected ? tempConfig.pollinationsText.model : tempConfig.model}
              </span>
            </div>
            {selectedProvider?.requiresApiKey ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Key:</span>
                <span className={`text-sm font-medium ${tempConfig.apiKey ? 'text-green-600' : 'text-red-600'}`}>
                  {tempConfig.apiKey ? 'Configurada' : 'Não configurada'}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="text-sm font-medium text-green-600">Gratuito</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Auto-resposta:</span>
              <span className={`text-sm font-medium ${tempConfig.autoReply ? 'text-green-600' : 'text-gray-600'}`}>
                {tempConfig.autoReply ? 'Ativa' : 'Inativa'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Test Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Testar Configuração</h3>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder={
              isPollinationsSelected ? "Digite uma descrição para gerar imagem..." : 
              isPollinationsTextSelected ? "Digite uma mensagem para testar a IA de texto..." :
              "Digite uma mensagem de teste..."
            }
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
          />
          <button 
            onClick={handleTest}
            disabled={testing}
            className="flex items-center space-x-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {testing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <SafeIcon icon={FiPlay} />
                </motion.div>
                <span>Testando...</span>
              </>
            ) : (
              <>
                <SafeIcon icon={FiPlay} />
                <span>
                  Testar {isPollinationsSelected ? 'Imagem' : isPollinationsTextSelected ? 'Texto' : 'IA'}
                </span>
              </>
            )}
          </button>
        </div>
        
        {testResult && (
          <div className={`mt-4 p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h4 className={`font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
              {testResult.success ? 'Teste bem-sucedido!' : 'Erro no teste'}
            </h4>
            {testResult.success && testResult.result?.content && (
              <div className="mt-2">
                <p className="text-sm text-green-700 font-medium">Resposta gerada:</p>
                <div className="mt-1 p-3 bg-white rounded border text-sm text-gray-800">
                  {testResult.result.content}
                </div>
                {testResult.result.metadata && (
                  <div className="mt-2 text-xs text-green-600">
                    Modelo: {testResult.result.metadata.model} | 
                    Tokens: {testResult.result.metadata.tokens} | 
                    Temp: {testResult.result.metadata.temperature}
                  </div>
                )}
              </div>
            )}
            {!testResult.success && (
              <p className="text-sm text-red-700 mt-1">{testResult.error}</p>
            )}
          </div>
        )}
        
        {isPollinationsProvider && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Dicas para Pollinations:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {isPollinationsSelected ? (
                <>
                  <li>• Use descrições detalhadas em inglês para melhores resultados</li>
                  <li>• Experimente diferentes modelos: flux (padrão), flux-realism, flux-anime</li>
                  <li>• Ajuste as dimensões conforme necessário (recomendado: 1024x1024)</li>
                  <li>• O serviço é gratuito e não requer chave de API</li>
                </>
              ) : (
                <>
                  <li>• Experimente diferentes modelos: openai, mistral, claude</li>
                  <li>• Ajuste a temperatura para controlar criatividade</li>
                  <li>• Use prompts personalizados para comportamentos específicos</li>
                  <li>• Totalmente gratuito via text.pollinations.ai</li>
                </>
              )}
            </ul>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default AIConfig