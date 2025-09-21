import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { ListingsProvider } from './contexts/ListingsContext.tsx'
import { RentalsProvider } from './contexts/RentalsContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ListingsProvider>
          <RentalsProvider>
            <App />
          </RentalsProvider>
        </ListingsProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
