import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { WhatsAppProvider } from './contexts/WhatsAppContext'
import { AIProvider } from './contexts/AIContext'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import Connection from './pages/Connection'
import AIConfig from './pages/AIConfig'
import Messages from './pages/Messages'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

function App() {
  return (
    <WhatsAppProvider>
      <AIProvider>
        <Router>
          <div className="App">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  style: {
                    background: '#25D366',
                  },
                },
                error: {
                  style: {
                    background: '#ef4444',
                  },
                },
              }}
            />
            
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/connection" element={<Connection />} />
                <Route path="/ai-config" element={<AIConfig />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          </div>
        </Router>
      </AIProvider>
    </WhatsAppProvider>
  )
}

export default App