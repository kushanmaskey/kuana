import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Privacy from './pages/Privacy';
import Venue from './pages/Venue';

// Prevent browser from restoring scroll position on hard refresh
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/venue/:slug" element={<Venue />} />
      </Routes>
    </BrowserRouter>
  );
}
