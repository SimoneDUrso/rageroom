import { Link } from 'react-router-dom';
import { CalendarCheck, ShieldCheck, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="text-center mt-12 mb-16 max-w-3xl">
        <span className="bg-primary-light text-primary-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
          Nuove Disponibilità
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Prenota il tuo spazio <br/>
          {/* Gradiente usando le variabili del brand */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
            in pochi secondi.
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Gestione professionale degli appuntamenti. Scegli l'orario, paga in sicurezza e ricevi conferma immediata.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/prenota" className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-all shadow-primary/30 hover:shadow-xl">
            Inizia a Prenotare
          </Link>
          <Link to="/about" className="px-8 py-4 bg-white text-gray-700 font-bold border border-gray-200 rounded-xl hover:bg-gray-50 transition hover:text-primary hover:border-primary/30">
            Scopri di più
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 w-full mt-8">
        {[
          // Icona 1: Usa Primary
          { 
            icon: <Clock className="w-8 h-8 text-primary" />, 
            title: "Risparmia Tempo", 
            desc: "Sistema di booking istantaneo senza attese telefoniche." 
          },
          // Icona 2: Usa Success (per la sicurezza/pagamento)
          { 
            icon: <ShieldCheck className="w-8 h-8 text-success" />, 
            title: "Pagamenti Sicuri", 
            desc: "Transazioni protette e crittografate end-to-end." 
          },
          // Icona 3: Usa Primary Dark (per variazione)
          { 
            icon: <CalendarCheck className="w-8 h-8 text-primary-dark" />, 
            title: "Flessibilità", 
            desc: "Visualizza gli slot disponibili in tempo reale." 
          }
        ].map((feature, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition hover:border-primary/20 group">
            <div className="mb-4 bg-gray-50 group-hover:bg-primary-light transition-colors w-14 h-14 flex items-center justify-center rounded-lg">
              {feature.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
            <p className="text-gray-500">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}