import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Events from '../components/Events';
import Speakers from '../components/Speakers';
import Media from '../components/Media';
import Donate from '../components/Donate';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import FloatDonate from '../components/FloatDonate';

export default function Home() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.scrollTo) {
      const el = document.getElementById(state.scrollTo);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      navigate('/', { replace: true, state: {} });
    }
  }, []);

  return (
    <>
      <Navbar />
      <FloatDonate />
      <main>
        <Hero />
        <About />
        <Events />
        <Speakers />
        <Media />
        <Donate />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
