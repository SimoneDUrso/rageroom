import { Link } from 'react-router-dom';
import { CalendarCheck, ShieldCheck, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="text-center mt-12 mb-16 max-w-3xl">
        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
          Nuove Disponibilità
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Prenota il tuo spazio <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            in pochi secondi.
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Gestione professionale degli appuntamenti. Scegli l'orario, paga in sicurezza e ricevi conferma immediata.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/prenota" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition hover:shadow-blue-300/50">
            Inizia a Prenotare
          </Link>
          <Link to="/about" className="px-8 py-4 bg-white text-gray-700 font-bold border border-gray-200 rounded-xl hover:bg-gray-50 transition">
            Scopri di più
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 w-full mt-8">
        {[
          { icon: <Clock className="w-8 h-8 text-blue-500" />, title: "Risparmia Tempo", desc: "Sistema di booking istantaneo senza attese." },
          { icon: <ShieldCheck className="w-8 h-8 text-green-500" />, title: "Pagamenti Sicuri", desc: "Transazioni protette e crittografate." },
          { icon: <CalendarCheck className="w-8 h-8 text-purple-500" />, title: "Flessibilità", desc: "Visualizza gli slot in tempo reale." }
        ].map((feature, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="mb-4 bg-gray-50 w-14 h-14 flex items-center justify-center rounded-lg">
              {feature.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-500">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}