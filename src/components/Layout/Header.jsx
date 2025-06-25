import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useWhatsApp } from '../../contexts/WhatsAppContext';

const { FiBell, FiUser, FiWifi, FiWifiOff } = FiIcons;

const Header = () => {
  const { isConnected, phoneNumber } = useWhatsApp();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Painel de Controle
          </h2>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              isConnected
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            <SafeIcon icon={isConnected ? FiWifi : FiWifiOff} className="text-sm" />
            <span>{isConnected ? 'Conectado' : 'Desconectado'}</span>
          </motion.div>
        </div>

        <div className="flex items-center space-x-4">
          {isConnected && phoneNumber && (
            <div className="text-sm text-gray-600">
              {phoneNumber}
            </div>
          )}
          
          <button className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors">
            <SafeIcon icon={FiBell} className="text-xl" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
            <SafeIcon icon={FiUser} className="text-xl" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;