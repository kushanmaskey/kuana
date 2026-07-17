import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Events from '../components/Events';
import Speakers from '../components/Speakers';
import Media from '../components/Media';
import Donate from '../components/Donate';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
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
