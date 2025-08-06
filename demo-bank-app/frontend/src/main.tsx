import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createTheme, ThemeProvider } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#335',
    },
    secondary: {
      main: '#555',
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
  },
  shape: {
    borderRadius: 4, // Makes components flat by removing border radius
  },
  shadows: [
    "none",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 1px 2px rgba(0, 0, 0, 0.1)"
], // Adds a light shadow to all shadow levels
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme} >
      <App />
    </ThemeProvider>
  </StrictMode>,
)
