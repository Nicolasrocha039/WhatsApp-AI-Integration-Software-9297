import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSettings, FiBell, FiShield, FiUser, FiDownload, FiTrash2, FiSave } = FiIcons;

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      newMessages: true,
      aiResponses: true,
      systemAlerts: false,
      emailNotifications: true
    },
    privacy: {
      saveConversations: true,
      logAIInteractions: true,
      shareAnalytics: false
    },
    general: {
      language: 'pt',
      timezone: 'America/Sao_Paulo',
      theme: 'light'
    }
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSave = () => {
    // Simular salvamento
    alert('Configurações salvas com sucesso!');
  };

  const handleExportData = () => {
    // Simular export
    alert('Dados exportados com sucesso!');
  };

  const handleDeleteData = () => {
    if (confirm('Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.')) {
      alert('Dados apagados com sucesso!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-4 py-2 bg-whatsapp-green hover:bg-whatsapp-dark text-white rounded-lg transition-colors"
        >
          <SafeIcon icon={FiSave} />
          <span>Salvar Alterações</span>
        </button>
      </div>

      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <SafeIcon icon={FiSettings} className="text-blue-600 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Configurações Gerais</h3>
            <p className="text-sm text-gray-500">Preferências básicas do sistema</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idioma
            </label>
            <select
              value={settings.general.language}
              onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
            >
              <option value="pt">Português</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuso Horário
            </label>
            <select
              value={settings.general.timezone}
              onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
            >
              <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
              <option value="America/New_York">New York (GMT-5)</option>
              <option value="Europe/London">London (GMT+0)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema
            </label>
            <select
              value={settings.general.theme}
              onChange={(e) => handleSettingChange('general', 'theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
            >
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
              <option value="auto">Automático</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <SafeIcon icon={FiBell} className="text-yellow-600 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
            <p className="text-sm text-gray-500">Configure quando receber alertas</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="font-medium text-gray-900">Novas Mensagens</label>
              <p className="text-sm text-gray-500">Notificar quando receber mensagens</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.newMessages}
                onChange={(e) => handleSettingChange('notifications', 'newMessages', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-whatsapp-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-whatsapp-green"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="font-medium text-gray-900">Respostas da IA</label>
              <p className="text-sm text-gray-500">Notificar sobre respostas automáticas</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.aiResponses}
                onChange={(e) => handleSettingChange('notifications', 'aiResponses', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-whatsapp-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-whatsapp-green"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="font-medium text-gray-900">Alertas do Sistema</label>
              <p className="text-sm text-gray-500">Notificar sobre problemas técnicos</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.systemAlerts}
                onChange={(e) => handleSettingChange('notifications', 'systemAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-whatsapp-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-whatsapp-green"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="font-medium text-gray-900">Notificações por Email</label>
              <p className="text-sm text-gray-500">Receber resumos por email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.emailNotifications}
                onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-whatsapp-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-whatsapp-green"></div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Privacy & Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <SafeIcon icon={FiShield} className="text-red-600 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Privacidade e Segurança</h3>
            <p className="text-sm text-gray-500">Controle seus dados e privacidade</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="font-medium text-gray-900">Salvar Conversas</label>
              <p className="text-sm text-gray-500">Manter histórico de mensagens</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.saveConversations}
                onChange={(e) => handleSettingChange('privacy', 'saveConversations', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-whatsapp-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-whatsapp-green"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="font-medium text-gray-900">Log de Interações da IA</label>
              <p className="text-sm text-gray-500">Registrar atividades da IA para melhorias</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.logAIInteractions}
                onChange={(e) => handleSettingChange('privacy', 'logAIInteractions', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-whatsapp-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-whatsapp-green"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="font-medium text-gray-900">Compartilhar Analytics</label>
              <p className="text-sm text-gray-500">Permitir análise anônima de dados</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.shareAnalytics}
                onChange={(e) => handleSettingChange('privacy', 'shareAnalytics', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-whatsapp-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-whatsapp-green"></div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <SafeIcon icon={FiUser} className="text-purple-600 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Gerenciamento de Dados</h3>
            <p className="text-sm text-gray-500">Controle seus dados pessoais</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleExportData}
            className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiDownload} className="text-blue-600 text-xl" />
            <div className="text-left">
              <span className="font-medium text-blue-600 block">Exportar Dados</span>
              <span className="text-sm text-blue-500">Baixar todas as suas informações</span>
            </div>
          </button>

          <button
            onClick={handleDeleteData}
            className="flex items-center space-x-3 p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiTrash2} className="text-red-600 text-xl" />
            <div className="text-left">
              <span className="font-medium text-red-600 block">Apagar Dados</span>
              <span className="text-sm text-red-500">Remover permanentemente seus dados</span>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Account Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-whatsapp-green/10 to-whatsapp-dark/10 rounded-lg p-6 border border-whatsapp-green/20"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Conta</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Versão do Software:</span>
            <span className="ml-2 font-medium">v1.0.0</span>
          </div>
          <div>
            <span className="text-gray-600">Última Atualização:</span>
            <span className="ml-2 font-medium">15/01/2024</span>
          </div>
          <div>
            <span className="text-gray-600">Plano:</span>
            <span className="ml-2 font-medium">Premium</span>
          </div>
          <div>
            <span className="text-gray-600">Suporte:</span>
            <span className="ml-2 font-medium">24/7</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;