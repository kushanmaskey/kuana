import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Privacy from './pages/Privacy';
import MissionVision from './pages/MissionVision';
import Mission from './pages/Mission';
import Vision from './pages/Vision';
import Venue from './pages/Venue';
import Register from './pages/Register';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/mission-vision" element={<MissionVision />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/vision" element={<Vision />} />
        <Route path="/venue/:slug" element={<Venue />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
