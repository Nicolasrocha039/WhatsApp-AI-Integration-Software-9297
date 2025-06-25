import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useAI } from '../contexts/AIContext';

const { FiCpu, FiSettings, FiSave, FiEye, FiEyeOff, FiHelpCircle, FiImage, FiPlay } = FiIcons;

const AIConfig = () => {
  const { aiConfig, aiProviders, updateAIConfig, testPollinationsConnection } = useAI();
  const [showApiKey, setShowApiKey] = useState(false);
  const [tempConfig, setTempConfig] = useState(aiConfig);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const handleInputChange = (field, value, section = null) => {
    if (section) {
      setTempConfig(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setTempConfig(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = () => {
    updateAIConfig(tempConfig);
    alert('Configurações salvas com sucesso!');
  };

  const handleTest = async () => {
    if (tempConfig.provider === 'pollinations') {
      setTesting(true);
      try {
        const result = await testPollinationsConnection();
        setTestResult(result);
      } catch (error) {
        setTestResult({ success: false, error: error.message });
      }
      setTesting(false);
    } else {
      alert('Teste disponível apenas para Pollinations por enquanto.');
    }
  };

  const selectedProvider = aiProviders.find(p => p.id === tempConfig.provider);
  const isPollinationsSelected = tempConfig.provider === 'pollinations';

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
              <SafeIcon icon={isPollinationsSelected ? FiImage : FiCpu} className="text-purple-600 text-xl" />
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
                    {provider.name} {provider.type === 'image' && '🎨'} {!provider.requiresApiKey && '(Gratuito)'}
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
                value={tempConfig.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
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
                    <SafeIcon icon={FiCpu} className="text-xs" />
                    <span>Texto</span>
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Modelo:</span>
              <span className="text-sm font-medium">{tempConfig.model}</span>
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

      {/* Pollinations Specific Settings */}
      {isPollinationsSelected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg shadow-sm p-6 border border-pink-200"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiImage} className="text-pink-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Configurações Pollinations</h3>
              <p className="text-sm text-gray-500">Ajustes específicos para geração de imagens</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensões da Imagem
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={tempConfig.pollinations.imageWidth}
                    onChange={(e) => handleInputChange('imageWidth', parseInt(e.target.value), 'pollinations')}
                    placeholder="Largura"
                    min="256"
                    max="2048"
                    step="64"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={tempConfig.pollinations.imageHeight}
                    onChange={(e) => handleInputChange('imageHeight', parseInt(e.target.value), 'pollinations')}
                    placeholder="Altura"
                    min="256"
                    max="2048"
                    step="64"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estilo da Imagem
                </label>
                <select
                  value={tempConfig.pollinations.imageStyle}
                  onChange={(e) => handleInputChange('imageStyle', e.target.value, 'pollinations')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
                >
                  <option value="realistic">Realista</option>
                  <option value="artistic">Artístico</option>
                  <option value="anime">Anime</option>
                  <option value="3d">3D</option>
                  <option value="abstract">Abstrato</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seed (Semente)
                </label>
                <input
                  type="number"
                  value={tempConfig.pollinations.seed}
                  onChange={(e) => handleInputChange('seed', parseInt(e.target.value), 'pollinations')}
                  placeholder="-1 para aleatório"
                  min="-1"
                  max="999999"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Use -1 para seed aleatória</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prefixo do Prompt
                </label>
                <input
                  type="text"
                  value={tempConfig.pollinations.imagePromptPrefix}
                  onChange={(e) => handleInputChange('imagePromptPrefix', e.target.value, 'pollinations')}
                  placeholder="high quality, detailed, "
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Texto adicionado no início de todos os prompts</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                <div>
                  <label className="font-medium text-gray-900">Geração de Imagens</label>
                  <p className="text-sm text-gray-500">Ativar geração automática de imagens</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempConfig.pollinations.enableImageGeneration}
                    onChange={(e) => handleInputChange('enableImageGeneration', e.target.checked, 'pollinations')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-whatsapp-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-whatsapp-green"></div>
                </label>
              </div>

              {testResult && (
                <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <h4 className={`font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    {testResult.success ? 'Teste bem-sucedido!' : 'Erro no teste'}
                  </h4>
                  {testResult.success && testResult.result?.imageUrl && (
                    <div className="mt-2">
                      <p className="text-sm text-green-700">Imagem gerada com sucesso!</p>
                      <img 
                        src={testResult.result.imageUrl} 
                        alt="Teste Pollinations"
                        className="mt-2 max-w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  {!testResult.success && (
                    <p className="text-sm text-red-700 mt-1">{testResult.error}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Advanced Settings */}
      {!isPollinationsSelected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiSettings} className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Configurações Avançadas</h3>
              <p className="text-sm text-gray-500">Ajuste o comportamento da IA</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperatura ({tempConfig.temperature})
                  <span className="ml-1 text-gray-400">
                    <SafeIcon icon={FiHelpCircle} className="inline text-xs" />
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={tempConfig.temperature}
                  onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Mais preciso</span>
                  <span>Mais criativo</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de Tokens
                </label>
                <input
                  type="number"
                  value={tempConfig.maxTokens}
                  onChange={(e) => handleInputChange('maxTokens', parseInt(e.target.value))}
                  min="50"
                  max="4000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delay de Resposta (ms)
                </label>
                <input
                  type="number"
                  value={tempConfig.responseDelay}
                  onChange={(e) => handleInputChange('responseDelay', parseInt(e.target.value))}
                  min="1000"
                  max="10000"
                  step="500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prompt do Sistema
                </label>
                <textarea
                  value={tempConfig.systemPrompt}
                  onChange={(e) => handleInputChange('systemPrompt', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent resize-none"
                  placeholder="Defina como a IA deve se comportar..."
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="font-medium text-gray-900">Auto-resposta</label>
                  <p className="text-sm text-gray-500">Responder automaticamente às mensagens</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempConfig.autoReply}
                    onChange={(e) => handleInputChange('autoReply', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-whatsapp-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-whatsapp-green"></div>
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      )}

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
            placeholder={isPollinationsSelected ? "Digite uma descrição para gerar imagem..." : "Digite uma mensagem de teste..."}
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
                <span>Testar {isPollinationsSelected ? 'Imagem' : 'IA'}</span>
              </>
            )}
          </button>
        </div>
        
        {isPollinationsSelected && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Dicas para Pollinations:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use descrições detalhadas em inglês para melhores resultados</li>
              <li>• Experimente diferentes modelos: flux (padrão), flux-realism, flux-anime</li>
              <li>• Ajuste as dimensões conforme necessário (recomendado: 1024x1024)</li>
              <li>• O serviço é gratuito e não requer chave de API</li>
            </ul>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AIConfig;