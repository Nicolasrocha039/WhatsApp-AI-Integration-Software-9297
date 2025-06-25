// API Service para integração com backend
class APIService {
  constructor() {
    this.baseURL = 'https://api.pollinations.ai'
    this.textURL = 'https://text.pollinations.ai'
  }

  async generatePollinationsText(prompt, model = 'openai', options = {}) {
    try {
      const response = await fetch(`${this.textURL}/${model}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          model: model,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 500
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        content: data.choices?.[0]?.message?.content || data.content || 'Resposta não disponível',
        metadata: {
          model,
          provider: 'pollinations-text',
          timestamp: new Date().toISOString()
        }
      }
    } catch (error) {
      console.error('Erro na API Pollinations Text:', error)
      return {
        content: 'Desculpe, houve um erro ao processar sua solicitação.',
        error: error.message
      }
    }
  }

  generatePollinationsImage(prompt, options = {}) {
    const {
      model = 'flux',
      width = 1024,
      height = 1024,
      seed = Math.floor(Math.random() * 1000000),
      style = ''
    } = options

    const enhancedPrompt = style ? `${style}, ${prompt}` : prompt
    const params = new URLSearchParams({
      model,
      width: width.toString(),
      height: height.toString(),
      seed: seed.toString()
    })

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?${params}`
    
    return {
      content: `🎨 Imagem gerada com sucesso!\n\nPrompt: "${prompt}"\nModelo: ${model}`,
      imageUrl,
      metadata: {
        model,
        dimensions: `${width}x${height}`,
        seed,
        provider: 'pollinations',
        timestamp: new Date().toISOString()
      }
    }
  }

  async testConnection(provider, options = {}) {
    try {
      if (provider === 'pollinations-text') {
        const result = await this.generatePollinationsText('Hello, this is a test', options.model)
        return { success: true, result }
      } else if (provider === 'pollinations') {
        const result = this.generatePollinationsImage('test image', options)
        return { success: true, result }
      }
      return { success: false, error: 'Provider not supported' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

export const apiService = new APIService()
export default apiService