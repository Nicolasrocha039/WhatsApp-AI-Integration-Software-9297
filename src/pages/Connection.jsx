import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../common/SafeIcon'
import { FiSmartphone, FiWifi, FiRefreshCw, FiCheck, FiX, FiSquare } from 'react-icons/fi'
import { useWhatsApp } from '../contexts/WhatsAppContext'

const Connection = () => {
  const { 
    isConnected, 
    qrCode, 
    phoneNumber, 
    connectionStatus, 
    connectWhatsApp, 
    disconnectWhatsApp, 
    setQrCode,
    loading 
  } = useWhatsApp()
  
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    if (connectionStatus === 'connecting') {
      // Simular geração de QR Code
      setTimeout(() => {
        setQrCode('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==')
        setShowQR(true)
      }, 1000)
    }
  }, [connectionStatus, setQrCode])

  const handleConnect = async () => {
    setShowQR(false)
    await connectWhatsApp()
  }

  const handleDisconnect = () => {
    disconnectWhatsApp()
    setShowQR(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Conexão WhatsApp</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium text-gray-600">
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              isConnected ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <SafeIcon 
                icon={FiSmartphone} 
                className={`text-2xl ${isConnected ? 'text-green-600' : 'text-gray-400'}`} 
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Status da Conexão</h3>
              <p className="text-sm text-gray-500">
                {isConnected ? 'WhatsApp conectado e funcionando' : 'WhatsApp não conectado'}
              </p>
            </div>
          </div>

          {isConnected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiCheck} className="text-green-600" />
                  <span className="font-medium text-green-800">Conectado com sucesso</span>
                </div>
              </div>
              
              {phoneNumber && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Número:</span>
                  <span className="font-medium text-gray-900">{phoneNumber}</span>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-600">Status:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-blue-800">Online</span>
                </div>
              </div>

              <button
                onClick={handleDisconnect}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <SafeIcon icon={FiX} />
                <span>Desconectar</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiWifi} className="text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    {connectionStatus === 'connecting' ? 'Conectando...' : 'Pronto para conectar'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleConnect}
                disabled={connectionStatus === 'connecting' || loading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-whatsapp-green hover:bg-whatsapp-dark text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connectionStatus === 'connecting' ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <SafeIcon icon={FiRefreshCw} />
                    </motion.div>
                    <span>Conectando...</span>
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiWifi} />
                    <span>Conectar WhatsApp</span>
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>

        {/* QR Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiSquare} className="text-2xl text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">QR Code</h3>
              <p className="text-sm text-gray-500">Escaneie com seu WhatsApp</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            {showQR && connectionStatus === 'connecting' ? (
              <div className="space-y-4 text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-64 h-64 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center relative overflow-hidden"
                >
                  {/* Simulação de QR Code */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="grid grid-cols-8 gap-1 w-48 h-48">
                      {Array.from({ length: 64 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-full h-full ${
                            Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Scanning animation */}
                  <motion.div
                    className="absolute top-0 left-0 w-full h-1 bg-whatsapp-green"
                    animate={{ y: [0, 256, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">Como conectar:</p>
                  <ol className="text-xs text-gray-600 space-y-1 text-left max-w-xs mx-auto">
                    <li>1. Abra o WhatsApp no seu celular</li>
                    <li>2. Toque em Menu (⋮) ou Configurações</li>
                    <li>3. Toque em "Aparelhos conectados"</li>
                    <li>4. Toque em "Conectar um aparelho"</li>
                    <li>5. Escaneie este código QR</li>
                  </ol>
                </div>

                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  ⏱️ QR Code expira em: 20s
                </div>
              </div>
            ) : (
              <div className="w-64 h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <SafeIcon icon={FiSquare} className="text-4xl text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    {isConnected ? 'Já conectado' : 'Clique em conectar para gerar o QR'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-blue-50 rounded-lg p-6 border border-blue-200"
      >
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Instruções de Conexão</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Requisitos:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• WhatsApp instalado no celular</li>
              <li>• Conexão com internet ativa</li>
              <li>• Câmera para escanear QR Code</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Segurança:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Conexão criptografada end-to-end</li>
              <li>• Dados não são armazenados</li>
              <li>• Você pode desconectar a qualquer momento</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Status:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Conexão: {isConnected ? 'Ativa' : 'Inativa'}</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Sistema: Online</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Servidor: Operacional</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Real-time connection stats */}
        {isConnected && (
          <div className="mt-6 p-4 bg-white rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-3">Estatísticas da Conexão</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">98.5%</div>
                <div className="text-gray-500">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">45ms</div>
                <div className="text-gray-500">Latência</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">1,247</div>
                <div className="text-gray-500">Mensagens</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600">156</div>
                <div className="text-gray-500">Contatos</div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Connection