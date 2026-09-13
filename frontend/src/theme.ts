import { createTheme } from '@mui/material/styles'

// Общие настройки готовых компонентов Material UI для всех страниц.
const theme = createTheme({
  palette: {
    primary: { main: '#285448' },
    success: { main: '#35674d' },
    warning: { main: '#98601e' },
    background: { default: '#faf9f6', paper: '#fffefa' },
    text: { primary: '#263e35', secondary: '#5f6b62' },
    divider: '#dce1d7',
  },
  typography: {
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    fontSize: 16,
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.6 },
    button: { fontSize: '0.875rem', textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { minHeight: 44, paddingInline: 16, gap: 8 },
      },
    },
    MuiCard: {
      defaultProps: { variant: 'outlined' },
    },
    MuiCardContent: {
      styleOverrides: {
        root: { padding: 20, '&:last-child': { paddingBottom: 20 } },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontSize: '0.8125rem', fontWeight: 500 },
        sizeSmall: { height: 28 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { minHeight: 44, backgroundColor: '#fffefa' },
        input: { fontSize: '1rem' },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: { label: { fontSize: '0.875rem' } },
    },
    MuiAlert: {
      styleOverrides: { root: { fontSize: '0.875rem', lineHeight: 1.6 } },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          '@media (max-width: 600px)': { margin: 16, width: 'calc(100% - 32px)' },
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: { root: { padding: 16, gap: 8, flexWrap: 'wrap' } },
    },
  },
})

export default theme
