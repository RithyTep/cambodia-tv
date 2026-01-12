import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Remote from './Remote.tsx'

// Simple path-based routing
const isRemotePage = window.location.pathname === '/remote' || window.location.pathname === '/remote/';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isRemotePage ? <Remote /> : <App />}
  </StrictMode>,
)
