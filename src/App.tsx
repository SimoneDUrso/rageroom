import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Booking from './pages/Booking';
import { ShoppingBag, Menu, X } from 'lucide-react'; // Ho aggiunto l'icona X

function App() {
  // Stato per gestire l'apertura/chiusura del menu mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Funzione per chiudere il menu quando si clicca su un link
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-primary-light selection:text-primary">
        
        {/* NAVBAR */}
        <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
                <div className="bg-primary text-white p-2 rounded-lg group-hover:bg-primary-dark transition-colors duration-200">
                  <ShoppingBag size={20} />
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">SlotStore</span>
              </Link>

              {/* MENU DESKTOP (Visibile solo su schermi medi 'md' in su) */}
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Home</Link>
                <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Chi Siamo</Link>
                <Link to="/prenota" className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-full shadow-lg hover:bg-primary-dark transition-all transform hover:-translate-y-0.5">
                  Prenota Ora
                </Link>
              </div>

              {/* BOTTONE MENU MOBILE (Visibile solo su schermi piccoli) */}
              <div className="md:hidden flex items-center">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} // Inverte lo stato (Apre/Chiude)
                  className="text-gray-500 hover:text-primary focus:outline-none transition-colors p-2"
                >
                  {/* Se il menu è aperto mostra X, altrimenti mostra le 3 righe */}
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* MENU MOBILE A TENDINA (Visibile solo se isMenuOpen è true) */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-in fade-in slide-in-from-top-5 duration-200">
              <div className="flex flex-col p-4 space-y-4">
                <Link 
                  to="/" 
                  onClick={closeMenu} 
                  className="text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 p-3 rounded-lg transition-colors"
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  onClick={closeMenu} 
                  className="text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 p-3 rounded-lg transition-colors"
                >
                  Chi Siamo
                </Link>
                <Link 
                  to="/prenota" 
                  onClick={closeMenu} 
                  className="text-center font-bold bg-primary text-white p-3 rounded-xl hover:bg-primary-dark transition-colors shadow-md"
                >
                  Prenota Ora
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* CONTENUTO PRINCIPALE */}
        <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/prenota" element={<Booking />} />
          </Routes>
        </main>

        {/* FOOTER */}
        <footer className="bg-white border-t border-gray-200 mt-12 py-8">
          <div className="max-w-6xl mx-auto px-4 text-center text-gray-400 text-sm">
            &copy; 2026 SlotStore Inc. Tutti i diritti riservati.
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;