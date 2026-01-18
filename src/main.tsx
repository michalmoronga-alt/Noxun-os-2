import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { DataProvider } from '@/data/DataProvider'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </StrictMode>,
)
