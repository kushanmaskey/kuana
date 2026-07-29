import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Privacy from './pages/Privacy';
import Venue from './pages/Venue';

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
