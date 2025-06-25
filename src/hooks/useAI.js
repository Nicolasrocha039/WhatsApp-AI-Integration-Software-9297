import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { toast } from 'react-hot-toast';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [providers] = useState([
    {
      id: 'pollinations-text',
      name: 'Pollinations Text AI',
      type: 'text',
      models: ['openai', 'mistral', 'claude'],
      free: true,
      description: 'IA de texto gratuita via Pollinations'
    },
    {
      id: 'pollinations-image',
      name: 'Pollinations Image AI', 
      type: 'image',
      models: ['flux', 'flux-realism', 'flux-3d', 'flux-anime', 'turbo'],
      free: true,
      description: 'Geração gratuita de imagens'
    },
    {
      id: 'openai',
      name: 'OpenAI',
      type: 'text',
      models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'],
      free: false,
      description: 'Modelos GPT da OpenAI'
    },
    {
      id: 'anthropic',
      name: 'Claude (Anthropic)',
      type: 'text', 
      models: ['claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
      free: false,
      description: 'Modelos Claude da Anthropic'
    }
  ]);

  const generateResponse = async (prompt, options = {}) => {
    try {
      setLoading(true);
      const response = await api.post('/ai/generate', {
        prompt,
        ...options
      });
      
      return response.data;
    } catch (error) {
      toast.error('Erro ao gerar resposta da IA');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const testProvider = async (provider, options = {}) => {
    try {
      setLoading(true);
      const response = await api.post('/ai/test', {
        provider,
        options
      });
      
      if (response.data.success) {
        toast.success('Teste realizado com sucesso!');
      } else {
        toast.error('Falha no teste do provedor');
      }
      
      return response.data;
    } catch (error) {
      toast.error('Erro ao testar provedor');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getProviderStats = async () => {
    try {
      const response = await api.get('/ai/stats');
      return response.data;
    } catch (error) {
      console.error('Error getting AI stats:', error);
      return {};
    }
  };

  return {
    loading,
    providers,
    generateResponse,
    testProvider,
    getProviderStats
  };
}