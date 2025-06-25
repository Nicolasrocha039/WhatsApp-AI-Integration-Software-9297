import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import { 
  FiHome, 
  FiSmartphone, 
  FiCpu, 
  FiMessageSquare, 
  FiBarChart3, 
  FiSettings 
} from 'react-icons/fi'

const Sidebar = () => {
  const location = useLocation()

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/' },
    { icon: FiSmartphone, label: 'Conexão', path: '/connection' },
    { icon: FiCpu, label: 'Config. IA', path: '/ai-config' },
    { icon: FiMessageSquare, label: 'Mensagens', path: '/messages' },
    { icon: FiBarChart3, label: 'Analytics', path: '/analytics' },
    { icon: FiSettings, label: 'Configurações', path: '/settings' }
  ]

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-whatsapp-green rounded-lg flex items-center justify-center">
            <SafeIcon icon={FiMessageSquare} className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">WhatsApp AI</h1>
            <p className="text-sm text-gray-500">Integração Inteligente</p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center space-x-3 px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-whatsapp-green bg-whatsapp-green/10 border-r-2 border-whatsapp-green'
                    : 'text-gray-600 hover:text-whatsapp-green hover:bg-gray-50'
                }`}
              >
                <SafeIcon icon={item.icon} className="text-xl" />
                <span>{item.label}</span>
              </motion.div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar