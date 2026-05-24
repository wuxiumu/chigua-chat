import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ChatEngineApp from './ChatEngineApp.jsx'
import { AppProvider } from './components/layout/AppProvider.jsx'

const params = new URLSearchParams(window.location.search);
const Root = params.get('mode') === 'chat-engine'
  ? ChatEngineApp
  : () => (
      <AppProvider>
        <App />
      </AppProvider>
    );

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
