export default function About() {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">Chi Siamo</h2>
        
        <div className="prose text-gray-600 space-y-4 leading-relaxed">
          <p>
            Benvenuti su <strong>SlotStore</strong>. Siamo nati con l'idea di semplificare 
            radicalmente il processo di prenotazione per servizi esclusivi.
          </p>
          <p>
            Il nostro team lavora costantemente per garantire che ogni transazione sia sicura 
            e che ogni slot prenotato sia gestito con la massima professionalità.
            Collaboriamo direttamente con i fornitori dei servizi per assicurare che 
            le disponibilità mostrate siano sempre aggiornate in tempo reale.
          </p>
          
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-6">
            <h3 className="font-bold text-blue-800 mb-2">La nostra missione</h3>
            <p className="text-blue-700 text-sm">
              Eliminare le code, le telefonate inutili e le incertezze. 
              Vogliamo che prenotare un servizio sia facile come un click.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}