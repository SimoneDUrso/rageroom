import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Booking from '../pages/Booking';
import { ShoppingBag, Menu } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-primary-light selection:text-primary">
        
        {/* NAVBAR */}
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-primary text-white p-2 rounded-lg group-hover:bg-primary-dark transition-colors duration-200">
                  <ShoppingBag size={20} />
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">SlotStore</span>
              </Link>

              {/* Links Desktop */}
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Home</Link>
                <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Chi Siamo</Link>
                <Link to="/prenota" className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-full shadow-lg hover:bg-primary-dark transition-all transform hover:-translate-y-0.5">
                  Prenota Ora
                </Link>
              </div>

              {/* Mobile Menu Icon */}
              <div className="md:hidden text-gray-500">
                <Menu />
              </div>
            </div>
          </div>
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