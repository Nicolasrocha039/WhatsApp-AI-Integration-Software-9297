import React, { createContext, useContext, useState } from 'react';

const AIContext = createContext();

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

export const AIProvider = ({ children }) => {
  const [aiConfig, setAiConfig] = useState({
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    apiKey: '',
    temperature: 0.7,
    maxTokens: 150,
    systemPrompt: 'Você é um assistente útil e amigável que responde mensagens do WhatsApp.',
    autoReply: true,
    responseDelay: 2000,
    // Configurações específicas do Pollinations
    pollinations: {
      imageModel: 'flux',
      imageWidth: 1024,
      imageHeight: 1024,
      imagePromptPrefix: 'high quality, detailed, ',
      enableImageGeneration: true,
      imageStyle: 'realistic',
      seed: -1
    }
  });

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
      id: 'gemini', 
      name: 'Google Gemini', 
      models: ['gemini-pro', 'gemini-pro-vision'],
      type: 'text',
      requiresApiKey: true
    },
    { 
      id: 'pollinations', 
      name: 'Pollinations AI', 
      models: ['flux', 'flux-realism', 'flux-3d', 'flux-anime', 'turbo'],
      type: 'image',
      requiresApiKey: false,
      description: 'Geração gratuita de imagens com IA'
    }
  ]);

  const updateAIConfig = (updates) => {
    setAiConfig(prev => ({ ...prev, ...updates }));
  };

  const generateAIResponse = async (message, context = {}) => {
    // Simulação de resposta da IA baseada no provedor
    await new Promise(resolve => setTimeout(resolve, aiConfig.responseDelay));
    
    if (aiConfig.provider === 'pollinations') {
      return await generatePollinationsImage(message);
    }
    
    const responses = [
      'Olá! Como posso ajudá-lo hoje?',
      'Entendo sua pergunta. Deixe-me pensar na melhor resposta.',
      'Obrigado por entrar em contato! Estou aqui para ajudar.',
      'Essa é uma ótima pergunta. Vou fazer o meu melhor para responder.',
      'Posso ajudá-lo com mais informações sobre isso.'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generatePollinationsImage = async (prompt) => {
    try {
      const config = aiConfig.pollinations;
      const enhancedPrompt = config.imagePromptPrefix + prompt;
      
      // Construir URL da API Pollinations
      const baseUrl = 'https://image.pollinations.ai/prompt';
      const params = new URLSearchParams({
        model: config.imageModel,
        width: config.imageWidth,
        height: config.imageHeight,
        seed: config.seed === -1 ? Math.floor(Math.random() * 1000000) : config.seed
      });
      
      const imageUrl = `${baseUrl}/${encodeURIComponent(enhancedPrompt)}?${params}`;
      
      // Simular resposta com a imagem gerada
      return {
        type: 'image',
        content: `Imagem gerada com sucesso! 🎨\n\nPrompt: "${prompt}"\nModelo: ${config.imageModel}`,
        imageUrl: imageUrl,
        metadata: {
          model: config.imageModel,
          dimensions: `${config.imageWidth}x${config.imageHeight}`,
          prompt: enhancedPrompt
        }
      };
    } catch (error) {
      return 'Desculpe, houve um erro ao gerar a imagem. Tente novamente.';
    }
  };

  const testPollinationsConnection = async () => {
    try {
      const testPrompt = 'beautiful sunset landscape';
      const result = await generatePollinationsImage(testPrompt);
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    aiConfig,
    aiProviders,
    updateAIConfig,
    generateAIResponse,
    generatePollinationsImage,
    testPollinationsConnection
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};