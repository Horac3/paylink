import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PaymentPage } from './pages/PaymentPage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pay/:slug" element={<PaymentPage />} />
        <Route path="/" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
