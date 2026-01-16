import { useState, type FormEvent, type ChangeEvent } from 'react';
import { CreditCard, Calendar, Clock, AlertCircle, ShieldCheck } from 'lucide-react';

interface PaymentData {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardHolder: string;
}

export default function Booking() {
  const [date, setDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData>({ cardNumber: '', expiry: '', cvv: '', cardHolder: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableSlots = [
    "09:00 - 09:30", "09:30 - 10:00", 
    "16:00 - 16:30", "16:30 - 17:00", 
    "17:00 - 17:30"
  ];

  // --- ALGORITMO DI LUHN (Per validare che la carta sia matematicamente reale) ---
  const isValidLuhn = (val: string) => {
    let number = val.replace(/\D/g, ''); // Rimuove spazi e simboli
    
    // Una carta valida ha tra 13 e 19 cifre
    if (number.length < 13 || number.length > 19) return false;

    let sum = 0;
    let shouldDouble = false;

    // Loop al contrario
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number.charAt(i));

      if (shouldDouble) {
        if ((digit *= 2) > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return (sum % 10) === 0;
  };

  // --- GESTIONE INPUT ---
  
  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Solo numeri
    value = value.slice(0, 16); // Max 16 cifre
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Spazio ogni 4
    setPaymentData({ ...paymentData, cardNumber: formattedValue });
    setError(null); // Rimuove errore mentre scrivi
  };

  const handleExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 3) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setPaymentData({ ...paymentData, expiry: value });
    setError(null);
  };

  const handleCvvChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setPaymentData({ ...paymentData, cvv: value });
    setError(null);
  };

  const handleCardHolderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Solo lettere
    setPaymentData({ ...paymentData, cardHolder: value });
  };

  // --- VALIDAZIONE FINALE ---
  
  const validatePayment = (): boolean => {
    // Controllo validità formale numero carta (Luhn)
    if (!isValidLuhn(paymentData.cardNumber)) {
      setError("Il numero della carta non è valido. Controlla di averlo scritto bene.");
      return false;
    }

    // Controllo Data Prenotazione (Non nel passato)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    if (selectedDate < today) {
      setError("Non puoi prenotare una data nel passato.");
      return false;
    }

    // Controllo Scadenza
    if (paymentData.expiry.length !== 5) {
      setError("Inserisci la scadenza completa (MM/YY).");
      return false;
    }

    const [monthStr, yearStr] = paymentData.expiry.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt('20' + yearStr, 10);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (month < 1 || month > 12) {
      setError("Il mese di scadenza non è valido.");
      return false;
    }

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      setError("La carta inserita è scaduta.");
      return false;
    }

    // Controllo CVV
    if (paymentData.cvv.length < 3) {
      setError("Il codice CVV deve essere di 3 cifre.");
      return false;
    }

    return true;
  };

  // --- GESTIONE INVIO ---

  const handlePayment = async (e: FormEvent) => {
    e.preventDefault();
    
    // Se la validazione fallisce, fermati
    if (!validatePayment()) return;

    setLoading(true);

    // LOG PER DEBUG (Questo è quello che invierai ai colleghi)
    console.log("✅ DATI VALIDI - INVIO AL BACKEND:", {
      bookingDate: date,
      slot: selectedSlot,
      cardHolder: paymentData.cardHolder,
      cardNumberEncrypted: "**** **** **** " + paymentData.cardNumber.slice(-4), // Simulo sicurezza
      amount: 50.00
    });

    // Simulazione chiamata Server
    setTimeout(() => {
      alert("Pagamento riuscito con successo! Slot Prenotato.");
      setLoading(false);
      // Reset Totale
      setSelectedSlot(null);
      setDate('');
      setPaymentData({ cardNumber: '', expiry: '', cvv: '', cardHolder: '' });
      setError(null);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto mb-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Prenota il tuo Slot</h2>
            <p className="text-blue-100 text-sm">Transazione sicura e crittografata</p>
          </div>
          {/* Decorazione sfondo */}
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5 transform -skew-y-12 translate-y-10"></div>
        </div>

        <div className="p-8 space-y-8">
          
          {/* 1. DATA */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
              <Calendar size={18} className="text-blue-600"/> 1. Seleziona Data
            </label>
            <input 
              type="date" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
              onChange={(e) => setDate(e.target.value)}
              value={date}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* 2. ORARIO */}
          {date && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                <Clock size={18} className="text-blue-600"/> 2. Seleziona Orario
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3 px-2 rounded-xl text-sm font-medium border transition-all duration-200 shadow-sm ${
                      selectedSlot === slot 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-blue-200 ring-2 ring-blue-300' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PAGAMENTO */}
          {selectedSlot && (
            <form onSubmit={handlePayment} className="animate-in fade-in slide-in-from-top-4 duration-500 pt-8 border-t border-dashed border-gray-200">
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <CreditCard className="text-blue-600"/> Dati Pagamento
                </h3>
                <div className="text-right">
                  <span className="block text-2xl font-bold text-gray-900">€50.00</span>
                  <span className="text-xs text-gray-400">IVA Inclusa</span>
                </div>
              </div>

              {/* Box Errori */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-start gap-3 border border-red-200 animate-pulse">
                  <AlertCircle className="shrink-0 mt-0.5" size={18} />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="space-y-5 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                
                {/* Intestatario */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Intestatario Carta</label>
                    <input
                    type="text" placeholder="Es. MARIO ROSSI" required
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                    value={paymentData.cardHolder}
                    onChange={handleCardHolderChange}
                    />
                </div>
                
                {/* Numero Carta */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Numero Carta</label>
                    <div className="relative">
                      <input
                        type="text" placeholder="0000 0000 0000 0000" required
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white pl-10"
                        value={paymentData.cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                      />
                      <CreditCard className="absolute left-3 top-3.5 text-gray-400" size={18}/>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Scadenza */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Scadenza</label>
                    <input
                        type="text" placeholder="MM/YY" required
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white text-center"
                        value={paymentData.expiry}
                        onChange={handleExpiryChange}
                        maxLength={5}
                    />
                  </div>
                  
                  {/* CVV */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">CVV</label>
                    <input
                        type="password" placeholder="123" required
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white text-center"
                        value={paymentData.cvv}
                        onChange={handleCvvChange}
                        maxLength={3}
                    />
                  </div>
                </div>
              </div>

              {/* Note e Disclaimer */}
              <div className="mt-6 flex items-start gap-3 text-xs text-gray-500 bg-yellow-50 p-4 rounded-xl text-yellow-800 border border-yellow-100">
                 <ShieldCheck className="shrink-0" size={20}/>
                 <div>
                   <p className="font-bold mb-1">Pagamento Sicuro & Policy</p>
                   <p>Procedendo confermi che i dati inseriti sono reali. La prenotazione non è rimborsabile in caso di mancata presentazione.</p>
                 </div>
              </div>

              {/* Bottone Finale */}
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full mt-6 py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all transform active:scale-[0.98] ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed opacity-75' 
                    : 'bg-green-600 hover:bg-green-700 shadow-green-200 hover:shadow-xl'
                }`}
              >
                {loading ? 'Elaborazione Pagamento...' : `Conferma e Paga €50.00`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}