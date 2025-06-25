import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { socketService } from '../lib/socket';
import { toast } from 'react-hot-toast';

export function useWhatsApp() {
  const [isConnected, setIsConnected] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [connectedNumber, setConnectedNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    // Get initial status
    checkStatus();

    // Setup socket listeners
    if (socketService.socket) {
      socketService.on('whatsapp:qr', ({ qr }) => {
        setQrCode(qr);
        toast.info('QR Code gerado! Escaneie com seu WhatsApp.');
      });

      socketService.on('whatsapp:ready', ({ number, name }) => {
        setIsConnected(true);
        setConnectedNumber(number);
        setQrCode(null);
        toast.success(`WhatsApp conectado! ${name} (${number})`);
      });

      socketService.on('whatsapp:authenticated', () => {
        toast.info('WhatsApp autenticado com sucesso!');
      });

      socketService.on('whatsapp:auth_failure', () => {
        toast.error('Falha na autenticação do WhatsApp');
        setIsConnected(false);
        setQrCode(null);
      });

      socketService.on('whatsapp:disconnected', ({ reason }) => {
        setIsConnected(false);
        setConnectedNumber(null);
        setQrCode(null);
        toast.error(`WhatsApp desconectado: ${reason}`);
      });

      socketService.on('whatsapp:message', (message) => {
        setMessages(prev => [message, ...prev]);
        
        if (message.direction === 'incoming') {
          toast(`Nova mensagem de ${message.fromName}: ${message.body.substring(0, 50)}...`);
        }
      });
    }

    return () => {
      if (socketService.socket) {
        socketService.off('whatsapp:qr');
        socketService.off('whatsapp:ready');
        socketService.off('whatsapp:authenticated');
        socketService.off('whatsapp:auth_failure');
        socketService.off('whatsapp:disconnected');
        socketService.off('whatsapp:message');
      }
    };
  }, []);

  const checkStatus = async () => {
    try {
      const response = await api.get('/whatsapp/status');
      const { isReady, qrCode: qr, connectedNumber: number } = response.data;
      
      setIsConnected(isReady);
      setQrCode(qr);
      setConnectedNumber(number);
    } catch (error) {
      console.error('Error checking WhatsApp status:', error);
    }
  };

  const sendMessage = async (to, message, options = {}) => {
    try {
      setLoading(true);
      const response = await api.post('/whatsapp/send-message', {
        to,
        message,
        options
      });
      
      toast.success('Mensagem enviada com sucesso!');
      return response.data;
    } catch (error) {
      toast.error('Erro ao enviar mensagem');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendImage = async (to, imagePath, caption = '') => {
    try {
      setLoading(true);
      const response = await api.post('/whatsapp/send-image', {
        to,
        imagePath,
        caption
      });
      
      toast.success('Imagem enviada com sucesso!');
      return response.data;
    } catch (error) {
      toast.error('Erro ao enviar imagem');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getChats = async () => {
    try {
      const response = await api.get('/whatsapp/chats');
      setChats(response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting chats:', error);
      return [];
    }
  };

  const disconnect = async () => {
    try {
      setLoading(true);
      await api.post('/whatsapp/disconnect');
      setIsConnected(false);
      setConnectedNumber(null);
      setQrCode(null);
      toast.success('WhatsApp desconectado');
    } catch (error) {
      toast.error('Erro ao desconectar WhatsApp');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    isConnected,
    qrCode,
    connectedNumber,
    loading,
    messages,
    chats,
    sendMessage,
    sendImage,
    getChats,
    disconnect,
    checkStatus
  };
}