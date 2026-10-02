import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ShopContextProvider from './context/ShopContext.jsx'
import UIContextProvider from './context/UIContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ShopContextProvider>
      <UIContextProvider>
        {/* "user": every framer animation honours prefers-reduced-motion */}
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </UIContextProvider>
    </ShopContextProvider>
  </BrowserRouter>,
)
