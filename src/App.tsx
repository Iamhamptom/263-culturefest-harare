import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RSVP from './pages/RSVP';
import Challenge from './pages/Challenge';
import SuccessRSVP from './pages/SuccessRSVP';
import SuccessChallenge from './pages/SuccessChallenge';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white text-black selection:bg-black selection:text-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rsvp" element={<RSVP />} />
            <Route path="/challenge" element={<Challenge />} />
            <Route path="/success/rsvp" element={<SuccessRSVP />} />
            <Route path="/success/challenge" element={<SuccessChallenge />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
