import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'

const theme = createTheme({
  palette: { primary: { main: '#285448' }, success: { main: '#35674d' }, warning: { main: '#98601e' }, background: { default: '#faf9f6' }, text: { primary: '#263e35', secondary: '#69736b' } },
  typography: { fontFamily: "'Segoe UI', system-ui, sans-serif", button: { textTransform: 'none', fontWeight: 600 } },
  shape: { borderRadius: 8 },
  components: { MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { gap: 10 } } }, MuiLinearProgress: { styleOverrides: { root: { height: 8, borderRadius: 8 } } } },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter><App /></BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
