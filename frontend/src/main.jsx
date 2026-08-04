import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/main.css'

// Root render for the React app
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
