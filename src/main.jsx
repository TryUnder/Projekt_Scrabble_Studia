import React from 'react'
import ReactDOM from 'react-dom/client'
import { SocketProvider } from './components/SocketProvider.jsx'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  </React.StrictMode>,
)
