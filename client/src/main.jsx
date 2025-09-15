import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LoginSignup from './pages/Login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoginSignup />
  </StrictMode>,
)
