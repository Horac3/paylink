import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ApiProvider } from './context/ApiContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { PayerPage } from './pages/PayerPage';
import { LinksPage } from './pages/LinksPage';
import { PaymentPage } from './pages/PaymentPage';
import { RefundsPage } from './pages/RefundsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ErrorsPage } from './pages/ErrorsPage';

export default function App() {
  return (
    <ApiProvider>
      <BrowserRouter>
        <Sidebar />
        <TopBar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/payers" element={<PayerPage />} />
            <Route path="/links" element={<LinksPage />} />
            <Route path="/payments" element={<PaymentPage />} />
            <Route path="/refunds" element={<RefundsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/errors" element={<ErrorsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </ApiProvider>
  );
}
