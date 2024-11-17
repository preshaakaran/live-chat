import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import {store} from './Features/store'


import ChatProvider from './context/chatProvider.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={store}>

   

    <ChatProvider>
    <App />
    </ChatProvider>

    </Provider>
    
    </BrowserRouter>
    
  </StrictMode>,
)
