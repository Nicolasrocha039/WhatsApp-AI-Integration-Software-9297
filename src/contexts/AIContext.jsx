import React, { createContext, useContext, useState, useEffect } from 'react'
import { dataService } from '../services/dataService'
import { apiService } from '../services/api'
import { toast } from 'react-hot-toast'

const AIContext = createContext()

export const useAI = () => {
  const context = useContext(AIContext)
  if (!context) {
    throw new Error('useAI must be used within an AIProvider')
  }
  return context
}

export const AIProvider = ({ children }) => {
  const [aiConfig, setAiConfig] = useState({
    provider: 'pollinations-text',
    model: 'openai',
    apiKey: '',
    temperature: 0.7,
    maxTokens: 150,
    systemPrompt: 'Você é um assistente útil e amigável que responde mensagens do WhatsApp.',
    autoReply: true,
    responseDelay: 2000,
    pollinations: {
      imageModel: 'flux',
      imageWidth: 1024,
      imageHeight: 1024,
      imagePromptPrefix: 'high quality, detailed, ',
      enableImageGeneration: true,
      imageStyle: 'realistic',
      seed: -1
    },
    pollinationsText: {
      model: 'openai',
      temperature: 0.7,
      maxTokens: 500,
      stream: false,
      customPrompt: '',
      useSystemPrompt: true
    }
  })

  const [aiProviders] = useState([
    { 
      id: 'openai', 
      name: 'OpenAI GPT', 
      models: ['gpt-3.5-turbo', 'gpt-4'],
      type: 'text',
      requiresApiKey: true
    },
    { 
      id: 'anthropic', 
      name: 'Claude', 
      models: ['claude-3-sonnet', 'claude-3-haiku'],
      type: 'text',
      requiresApiKey: true
    },
    { 
      id: 'pollinations-text', 
      name: 'Pollinations Text AI', 
      models: ['openai', 'mistral', 'claude'],
      type: 'text',
      requiresApiKey: false,
      description: 'IA de texto gratuita via Pollinations'
    },
    { 
      id: 'pollinations', 
      name: 'Pollinations Image AI', 
      models: ['flux', 'flux-realism', 'flux-3d', 'flux-anime', 'turbo'],
      type: 'image',
      requiresApiKey: false,
      description: 'Geração gratuita de imagens com IA'
    }
  ])

  const [aiStats, setAiStats] = useState({
    totalInteractions: 0,
    successRate: 98.5,
    averageResponseTime: 2300,
    providerStats: {}
  })

  // Carregar configurações salvas
  useEffect(() => {
    loadAISettings()
    loadAIStats()
  }, [])

  const loadAISettings = async () => {
    try {
      const settings = await dataService.getSettings()
      if (settings) {
        setAiConfig(prev => ({
          ...prev,
          provider: settings.ai_provider || prev.provider,
          model: settings.ai_model || prev.model,
          autoReply: settings.ai_auto_reply ?? prev.autoReply,
          responseDelay: settings.ai_response_delay || prev.responseDelay,
          systemPrompt: settings.ai_system_prompt || prev.systemPrompt,
          apiKey: settings.ai_api_key || prev.apiKey
        }))
      }
    } catch (error) {
      console.error('Erro ao carregar configurações IA:', error)
    }
  }

  const loadAIStats = async () => {
    try {
      const interactions = await dataService.getAIInteractions()
      const providerStats = interactions.reduce((acc, interaction) => {
        acc[interaction.provider] = (acc[interaction.provider] || 0) + 1
        return acc
      }, {})

      setAiStats({
        totalInteractions: interactions.length,
        successRate: 98.5,
        averageResponseTime: 2300,
        providerStats
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas IA:', error)
    }
  }

  const updateAIConfig = async (updates) => {
    try {
      const newConfig = { ...aiConfig, ...updates }
      setAiConfig(newConfig)
      
      // Salvar no banco
      await dataService.updateSettings('default', {
        ai_provider: newConfig.provider,
        ai_model: newConfig.model,
        ai_auto_reply: newConfig.autoReply,
        ai_response_delay: newConfig.responseDelay,
        ai_system_prompt: newConfig.systemPrompt,
        ai_api_key: newConfig.apiKey
      })

      toast.success('Configurações atualizadas!')
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error)
      toast.error('Erro ao salvar configurações')
    }
  }

  const generateAIResponse = async (message, context = {}) => {
    const startTime = Date.now()
    
    try {
      let response

      if (aiConfig.provider === 'pollinations-text') {
        response = await apiService.generatePollinationsText(
          message, 
          aiConfig.pollinationsText.model,
          {
            temperature: aiConfig.pollinationsText.temperature,
            maxTokens: aiConfig.pollinationsText.maxTokens
          }
        )
      } else if (aiConfig.provider === 'pollinations') {
        response = apiService.generatePollinationsImage(message, {
          model: aiConfig.pollinations.imageModel,
          width: aiConfig.pollinations.imageWidth,
          height: aiConfig.pollinations.imageHeight,
          seed: aiConfig.pollinations.seed === -1 ? Math.floor(Math.random() * 1000000) : aiConfig.pollinations.seed
        })
      } else {
        // Fallback para outros provedores
        response = {
          content: 'Esta é uma resposta simulada. Configure uma API key para usar outros provedores.',
          metadata: { provider: aiConfig.provider, model: aiConfig.model }
        }
      }

      const processingTime = Date.now() - startTime

      // Salvar interação no banco
      await dataService.saveAIInteraction({
        prompt: message,
        response: response.content,
        provider: aiConfig.provider,
        model: aiConfig.model,
        metadata: response.metadata,
        processingTime
      })

      // Log analytics
      await dataService.saveAnalyticsEvent('ai_response_generated', {
        provider: aiConfig.provider,
        model: aiConfig.model,
        processingTime,
        timestamp: new Date().toISOString()
      })

      // Atualizar stats
      await loadAIStats()

      return response

    } catch (error) {
      console.error('Erro ao gerar resposta IA:', error)
      
      // Log erro
      await dataService.saveAnalyticsEvent('ai_response_error', {
        provider: aiConfig.provider,
        error: error.message,
        timestamp: new Date().toISOString()
      })

      return {
        content: 'Desculpe, houve um erro ao processar sua solicitação. Tente novamente.',
        error: error.message
      }
    }
  }

  const testConnection = async (provider = aiConfig.provider, options = {}) => {
    try {
      const testOptions = {
        model: options.model || aiConfig.model,
        ...options
      }

      const result = await apiService.testConnection(provider, testOptions)
      
      if (result.success) {
        toast.success('Teste realizado com sucesso!')
        
        // Log teste
        await dataService.saveAnalyticsEvent('ai_test_success', {
          provider,
          model: testOptions.model,
          timestamp: new Date().toISOString()
        })
      } else {
        toast.error('Falha no teste: ' + result.error)
      }

      return result
      
    } catch (error) {
      console.error('Erro no teste:', error)
      toast.error('Erro ao testar conexão')
      return { success: false, error: error.message }
    }
  }

  const getProviderPerformance = async (provider) => {
    try {
      const interactions = await dataService.getAIInteractions()
      const providerInteractions = interactions.filter(i => i.provider === provider)
      
      if (providerInteractions.length === 0) {
        return {
          totalInteractions: 0,
          averageResponseTime: 0,
          successRate: 0
        }
      }

      const totalTime = providerInteractions.reduce((sum, i) => sum + (i.processing_time_ms || 0), 0)
      const averageResponseTime = totalTime / providerInteractions.length

      return {
        totalInteractions: providerInteractions.length,
        averageResponseTime: Math.round(averageResponseTime),
        successRate: 98.5, // Simulado - em produção, calcular baseado em erros
        lastUsed: providerInteractions[0]?.created_at
      }
    } catch (error) {
      console.error('Erro ao obter performance:', error)
      return {
        totalInteractions: 0,
        averageResponseTime: 0,
        successRate: 0
      }
    }
  }

  // Auto-reply handler
  const processAutoReply = async (incomingMessage) => {
    if (!aiConfig.autoReply) return null

    try {
      // Adicionar delay configurado
      await new Promise(resolve => setTimeout(resolve, aiConfig.responseDelay))

      const response = await generateAIResponse(incomingMessage.body, {
        from: incomingMessage.from,
        fromName: incomingMessage.fromName
      })

      return response
    } catch (error) {
      console.error('Erro no auto-reply:', error)
      return null
    }
  }

  const value = {
    // Estados
    aiConfig,
    aiProviders,
    aiStats,
    
    // Ações
    updateAIConfig,
    generateAIResponse,
    testConnection,
    getProviderPerformance,
    processAutoReply,
    
    // Utilitários
    loadAISettings,
    loadAIStats,
    
    // Funções específicas (mantidas para compatibilidade)
    generatePollinationsImage: (prompt) => apiService.generatePollinationsImage(prompt, aiConfig.pollinations),
    generatePollinationsTextResponse: (message) => apiService.generatePollinationsText(message, aiConfig.pollinationsText.model, aiConfig.pollinationsText),
    testPollinationsConnection: () => testConnection('pollinations'),
    testPollinationsTextAPI: (message) => apiService.generatePollinationsText(message || 'Test message', aiConfig.pollinationsText.model)
  }

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  )
}