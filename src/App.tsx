import { Routes, Route, Navigate } from 'react-router-dom';
import PhoneSimulatorLayout from './layouts/PhoneSimulatorLayout';
import WhatsAppChat from './pages/WhatsAppChat';
import MatchPage from './pages/MatchPage';
import OfferPage from './pages/OfferPage';

function App() {
  return (
    <Routes>
      <Route element={<PhoneSimulatorLayout />}>
        <Route path="/triagem" element={<WhatsAppChat />} />
        <Route path="/match" element={<MatchPage />} />
        <Route path="/oferta" element={<OfferPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/triagem" replace />} />
    </Routes>
  );
}

export default App;
