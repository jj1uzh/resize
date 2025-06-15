import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import ResizeApp from './resize/ResizeApp'
import { Root } from './Root'
import { Base64App } from './base64/Base64App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/resize" element={<ResizeApp />} />
        <Route path="/base64" element={<Base64App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
