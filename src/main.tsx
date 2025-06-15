import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import ResizeApp from './resize/App'
import { Root } from './Root'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/resize" element={<ResizeApp />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
