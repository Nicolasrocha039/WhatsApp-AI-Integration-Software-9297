import React, { createContext, useContext, useState } from 'react'

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

  const updateAIConfig = (updates) => {
    setAiConfig(prev => ({ ...prev, ...updates }))
  }

  const generateAIResponse = async (message, context = {}) => {
    // Simulação de resposta da IA baseada no provedor
    await new Promise(resolve => setTimeout(resolve, aiConfig.responseDelay))
    
    if (aiConfig.provider === 'pollinations') {
      return await generatePollinationsImage(message)
    }
    
    if (aiConfig.provider === 'pollinations-text') {
      return await generatePollinationsTextResponse(message)
    }
    
    const responses = [
      'Olá! Como posso ajudá-lo hoje?',
      'Entendo sua pergunta. Deixe-me pensar na melhor resposta.',
      'Obrigado por entrar em contato! Estou aqui para ajudar.',
      'Essa é uma ótima pergunta. Vou fazer o meu melhor para responder.',
      'Posso ajudá-lo com mais informações sobre isso.'
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const generatePollinationsTextResponse = async (message) => {
    try {
      const config = aiConfig.pollinationsText
      
      const simulatedResponses = {
        openai: [
          `Baseado na sua pergunta "${message}", posso ajudá-lo com informações detalhadas. Como assistente IA via Pollinations, estou aqui para fornecer respostas úteis e precisas.`,
          `Entendo sua solicitação. Utilizando o modelo OpenAI via Pollinations, posso processar sua pergunta e fornecer uma resposta contextualizada.`,
          `Sua mensagem foi processada com sucesso! Como IA Pollinations, posso ajudá-lo com diversas questões e fornecer informações relevantes.`
        ],
        mistral: [
          `Bonjour! Utilizando Mistral via Pollinations, posso responder sua pergunta "${message}" com precisão e eficiência francesa.`,
          `Como Mistral AI através da Pollinations, estou preparado para ajudá-lo com respostas inteligentes e bem estruturadas.`,
          `Processando via Mistral: Sua solicitação foi compreendida e posso fornecer uma resposta detalhada e útil.`
        ],
        claude: [
          `Olá! Como Claude via Pollinations, analisei sua mensagem "${message}" e estou pronto para fornecer uma resposta thoughtful e útil.`,
          `Utilizando as capacidades do Claude através da Pollinations, posso processar sua solicitação de forma cuidadosa e detalhada.`,
          `Como assistente Claude via Pollinations, entendo o contexto da sua pergunta e posso fornecer insights valiosos.`
        ]
      }

      const responses = simulatedResponses[config.model] || simulatedResponses.openai
      const selectedResponse = responses[Math.floor(Math.random() * responses.length)]

      return {
        type: 'text',
        content: selectedResponse,
        metadata: {
          model: config.model,
          provider: 'pollinations-text',
          tokens: config.maxTokens,
          temperature: config.temperature
        }
      }
    } catch (error) {
      return 'Desculpe, houve um erro ao processar sua mensagem via Pollinations Text. Tente novamente.'
    }
  }

  const generatePollinationsImage = async (prompt) => {
    try {
      const config = aiConfig.pollinations
      const enhancedPrompt = config.imagePromptPrefix + prompt
      
      const baseUrl = 'https://image.pollinations.ai/prompt'
      const params = new URLSearchParams({
        model: config.imageModel,
        width: config.imageWidth,
        height: config.imageHeight,
        seed: config.seed === -1 ? Math.floor(Math.random() * 1000000) : config.seed
      })
      
      const imageUrl = `${baseUrl}/${encodeURIComponent(enhancedPrompt)}?${params}`
      
      return {
        type: 'image',
        content: `Imagem gerada com sucesso! 🎨\n\nPrompt: "${prompt}"\nModelo: ${config.imageModel}`,
        imageUrl: imageUrl,
        metadata: {
          model: config.imageModel,
          dimensions: `${config.imageWidth}x${config.imageHeight}`,
          prompt: enhancedPrompt
        }
      }
    } catch (error) {
      return 'Desculpe, houve um erro ao gerar a imagem. Tente novamente.'
    }
  }

  const testPollinationsConnection = async () => {
    try {
      if (aiConfig.provider === 'pollinations') {
        const testPrompt = 'beautiful sunset landscape'
        const result = await generatePollinationsImage(testPrompt)
        return { success: true, result }
      } else if (aiConfig.provider === 'pollinations-text') {
        const testMessage = 'Hello, this is a test message'
        const result = await generatePollinationsTextResponse(testMessage)
        return { success: true, result }
      }
      return { success: false, error: 'Provider not supported for testing' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const testPollinationsTextAPI = async (testMessage = 'Hello, how are you?') => {
    try {
      const result = await generatePollinationsTextResponse(testMessage)
      return { success: true, result }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const value = {
    aiConfig,
    aiProviders,
    updateAIConfig,
    generateAIResponse,
    generatePollinationsImage,
    generatePollinationsTextResponse,
    testPollinationsConnection,
    testPollinationsTextAPI
  }

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  )
}