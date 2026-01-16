export default function About() {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
          Chi Siamo
        </h2>
        
        <div className="prose text-gray-600 space-y-4 leading-relaxed">
          <p>
            Benvenuti su <strong className="text-primary">SlotStore</strong>. Siamo nati con l'idea di semplificare 
            radicalmente il processo di prenotazione per servizi esclusivi.
          </p>
          <p>
            Il nostro team lavora costantemente per garantire che ogni transazione sia sicura 
            e che ogni slot prenotato sia gestito con la massima professionalità.
            Collaboriamo direttamente con i fornitori dei servizi per assicurare che 
            le disponibilità mostrate siano sempre aggiornate in tempo reale.
          </p>
          
          {/* Box Missione con variabili */}
          <div className="bg-primary-light p-6 rounded-xl border border-primary/10 mt-6">
            <h3 className="font-bold text-primary-dark mb-2 text-lg">La nostra missione</h3>
            <p className="text-primary font-medium">
              Eliminare le code, le telefonate inutili e le incertezze. 
              Vogliamo che prenotare un servizio sia facile, sicuro e veloce come un click.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}