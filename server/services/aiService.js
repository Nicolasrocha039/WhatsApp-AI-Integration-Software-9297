import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';
import { supabase } from '../config/supabase.js';

export class AIService {
  constructor() {
    this.pollinationsTextBaseUrl = 'https://text.pollinations.ai';
    this.pollinationsImageBaseUrl = 'https://image.pollinations.ai';
  }

  async generateResponse(prompt, options = {}) {
    try {
      const { provider = 'pollinations-text', model = 'openai', context = {} } = options;

      switch (provider) {
        case 'pollinations-text':
          return await this.generatePollinationsTextResponse(prompt, model, options);
        
        case 'pollinations-image':
          return await this.generatePollinationsImage(prompt, options);
        
        case 'openai':
          return await this.generateOpenAIResponse(prompt, options);
        
        case 'anthropic':
          return await this.generateAnthropicResponse(prompt, options);
        
        default:
          throw new Error(`Unsupported AI provider: ${provider}`);
      }
    } catch (error) {
      logger.error('Error generating AI response:', error);
      throw error;
    }
  }

  async generatePollinationsTextResponse(prompt, model = 'openai', options = {}) {
    try {
      const {
        temperature = 0.7,
        maxTokens = 500,
        systemPrompt = 'Você é um assistente útil e amigável que responde mensagens do WhatsApp.',
        customPrompt = ''
      } = options;

      // Prepare the prompt
      let fullPrompt = prompt;
      if (systemPrompt) {
        fullPrompt = `${systemPrompt}\n\nUsuário: ${prompt}\nAssistente:`;
      }
      if (customPrompt) {
        fullPrompt = `${customPrompt}\n\n${fullPrompt}`;
      }

      const payload = {
        model: model,
        messages: [
          { role: 'user', content: fullPrompt }
        ],
        temperature: temperature,
        max_tokens: maxTokens,
        stream: false
      };

      const response = await axios.post(`${this.pollinationsTextBaseUrl}/${model}`, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      const content = response.data.choices?.[0]?.message?.content || response.data.content || 'Desculpe, não consegui processar sua solicitação.';

      return {
        content: content.trim(),
        type: 'text',
        metadata: {
          provider: 'pollinations-text',
          model: model,
          tokens: maxTokens,
          temperature: temperature,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error('Error with Pollinations Text API:', error);
      
      // Fallback response
      return {
        content: 'Desculpe, houve um erro ao processar sua mensagem. Tente novamente em alguns instantes.',
        type: 'text',
        metadata: {
          provider: 'pollinations-text',
          model: model,
          error: error.message,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async generatePollinationsImage(prompt, options = {}) {
    try {
      const {
        model = 'flux',
        width = 1024,
        height = 1024,
        seed = -1,
        style = 'realistic',
        promptPrefix = 'high quality, detailed, '
      } = options;

      const enhancedPrompt = promptPrefix + prompt;
      const actualSeed = seed === -1 ? Math.floor(Math.random() * 1000000) : seed;

      const params = new URLSearchParams({
        model: model,
        width: width.toString(),
        height: height.toString(),
        seed: actualSeed.toString()
      });

      const imageUrl = `${this.pollinationsImageBaseUrl}/prompt/${encodeURIComponent(enhancedPrompt)}?${params}`;

      // Test if image URL is accessible
      try {
        await axios.head(imageUrl, { timeout: 10000 });
      } catch (error) {
        logger.warn('Image URL not immediately accessible, but providing URL anyway');
      }

      return {
        content: `🎨 Imagem gerada com sucesso!\n\nPrompt: "${prompt}"\nModelo: ${model}\nDimensões: ${width}x${height}`,
        type: 'image',
        imageUrl: imageUrl,
        metadata: {
          provider: 'pollinations-image',
          model: model,
          prompt: enhancedPrompt,
          dimensions: `${width}x${height}`,
          seed: actualSeed,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error('Error with Pollinations Image API:', error);
      
      return {
        content: 'Desculpe, houve um erro ao gerar a imagem. Tente novamente com uma descrição diferente.',
        type: 'text',
        metadata: {
          provider: 'pollinations-image',
          error: error.message,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async generateOpenAIResponse(prompt, options = {}) {
    try {
      const { apiKey, model = 'gpt-3.5-turbo', temperature = 0.7, maxTokens = 150 } = options;

      if (!apiKey) {
        throw new Error('OpenAI API key not provided');
      }

      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: model,
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: temperature,
        max_tokens: maxTokens
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      return {
        content: response.data.choices[0].message.content.trim(),
        type: 'text',
        metadata: {
          provider: 'openai',
          model: model,
          tokens: response.data.usage.total_tokens,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error('Error with OpenAI API:', error);
      throw error;
    }
  }

  async generateAnthropicResponse(prompt, options = {}) {
    try {
      const { apiKey, model = 'claude-3-sonnet-20240229', maxTokens = 150 } = options;

      if (!apiKey) {
        throw new Error('Anthropic API key not provided');
      }

      const response = await axios.post('https://api.anthropic.com/v1/messages', {
        model: model,
        max_tokens: maxTokens,
        messages: [
          { role: 'user', content: prompt }
        ]
      }, {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      return {
        content: response.data.content[0].text.trim(),
        type: 'text',
        metadata: {
          provider: 'anthropic',
          model: model,
          tokens: response.data.usage.output_tokens,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error('Error with Anthropic API:', error);
      throw error;
    }
  }

  async testConnection(provider, options = {}) {
    try {
      const testPrompt = 'Hello, this is a test message. Please respond briefly.';
      
      const response = await this.generateResponse(testPrompt, {
        provider,
        ...options
      });

      return {
        success: true,
        response: response,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async getProviderStats() {
    try {
      const { data, error } = await supabase
        .from('ai_interactions')
        .select('provider, created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const stats = data.reduce((acc, interaction) => {
        acc[interaction.provider] = (acc[interaction.provider] || 0) + 1;
        return acc;
      }, {});

      return stats;
    } catch (error) {
      logger.error('Error getting provider stats:', error);
      return {};
    }
  }
}