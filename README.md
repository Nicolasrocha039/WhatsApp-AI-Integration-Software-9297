# 🚀 WhatsApp AI Integration - Automação Python

Este projeto fornece uma automação completa em Python para setup e execução do sistema WhatsApp AI Integration.

## 📋 Pré-requisitos

### 1. Python 3.7+
```bash
# Verificar versão
python --version
# ou
python3 --version
```

### 2. Node.js 18+ e npm
O script verificará automaticamente e fornecerá instruções de instalação se necessário.

## 🏃‍♂️ Execução Rápida

### Opção 1: Execução Direta
```bash
# Baixar e executar
python run_project.py
```

### Opção 2: Com Dependências Python (Opcional)
```bash
# Instalar dependências Python (se necessário)
pip install -r requirements.txt

# Executar script
python run_project.py
```

## 🎯 O que o Script Faz

### ✅ **Verificações Automáticas:**
- ✓ Verifica Node.js e npm
- ✓ Fornece instruções de instalação se necessário
- ✓ Valida ambiente de desenvolvimento

### 🏗️ **Setup Completo:**
- ✓ Cria estrutura completa do projeto
- ✓ Gera `package.json` com todas as dependências
- ✓ Configura Vite, Tailwind, ESLint
- ✓ Cria todos os arquivos React/JSX
- ✓ Instala dependências automaticamente

### 🚀 **Execução:**
- ✓ Inicia servidor de desenvolvimento (Vite)
- ✓ Abre navegador automaticamente
- ✓ Monitora processo até interrupção

## 🛠️ Recursos Implementados

### 🎨 **Frontend Moderno:**
- React 18 + Vite (desenvolvimento rápido)
- Tailwind CSS (estilização moderna)
- Framer Motion (animações suaves)
- React Router (navegação SPA)
- React Icons (ícones vetoriais)

### 🤖 **Integrações de IA:**
- **Pollinations Text API** - IA de texto gratuita
- **Pollinations Image API** - Geração de imagens
- **Suporte a múltiplos modelos:** OpenAI, Claude, Mistral

### 📱 **Páginas Funcionais:**
- 📊 **Dashboard** - Visão geral do sistema
- 🔗 **Connection** - Conexão com WhatsApp
- 🤖 **AI Config** - Configuração da IA
- 💬 **Messages** - Interface de mensagens
- 📈 **Analytics** - Métricas e relatórios
- ⚙️ **Settings** - Configurações do sistema

## 🔧 Comandos Disponíveis

Após o setup, você pode usar:

```bash
cd whatsapp-ai-integration

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Linting
npm run lint
```

## 📂 Estrutura do Projeto

```
whatsapp-ai-integration/
├── src/
│   ├── components/
│   │   └── Layout/
│   │       ├── Layout.jsx
│   │       ├── Header.jsx
│   │       └── Sidebar.jsx
│   ├── contexts/
│   │   ├── WhatsAppContext.jsx
│   │   └── AIContext.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Connection.jsx
│   │   ├── AIConfig.jsx
│   │   ├── Messages.jsx
│   │   ├── Analytics.jsx
│   │   └── Settings.jsx
│   ├── common/
│   │   └── SafeIcon.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
└── index.html
```

## 🌐 URLs de Acesso

- **Desenvolvimento:** http://localhost:3000
- **Preview:** http://localhost:4173

## 🐛 Solução de Problemas

### Erro: Node.js não encontrado
```bash
# O script fornecerá instruções específicas para seu OS
```

### Erro: Porta 3000 ocupada
```bash
# O Vite automaticamente tentará a próxima porta disponível
```

### Erro de permissões
```bash
# Linux/macOS
sudo python run_project.py

# Windows (executar como administrador)
```

## 🔄 Atualizações

Para atualizar o projeto:
```bash
# Parar o servidor (Ctrl+C)
# Executar novamente
python run_project.py
```

## 💡 Recursos Avançados

### 🎨 **Temas Personalizados:**
- Cores WhatsApp (verde, escuro, claro)
- Gradientes para Pollinations
- Animações suaves

### ⚡ **Performance:**
- Hot Module Replacement (HMR)
- Code splitting automático
- Otimizações de build

### 🔒 **Qualidade:**
- ESLint configurado
- Prettier integrado
- TypeScript ready

## 📞 Suporte

Em caso de problemas:
1. Verifique os logs no terminal
2. Confirme versões do Node.js e npm
3. Verifique conectividade de rede
4. Reinicie o script se necessário

---

**🚀 Projeto pronto para desenvolvimento!**