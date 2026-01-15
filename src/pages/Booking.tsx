import { useState, type FormEvent } from 'react';
import { CreditCard, Calendar, Clock } from 'lucide-react';

interface PaymentData {
  cardNumber: string; expiry: string; cvv: string; cardHolder: string;
}

export default function Booking() {
  const [date, setDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData>({ cardNumber: '', expiry: '', cvv: '', cardHolder: '' });
  const [loading, setLoading] = useState(false);

  const availableSlots = [
    "09:00 - 09:30", "09:30 - 10:00", 
    "16:00 - 16:30", "16:30 - 17:00", 
    "17:00 - 17:30"
  ];

  const handlePayment = async (e: FormEvent) => {
    e.preventDefault();
    if (!date || !selectedSlot) return alert("Per favore seleziona data e orario!");
    
    setLoading(true);

    console.log("INVIO AL BACKEND:", { date, slot: selectedSlot, ...paymentData, amount: 50 });
    // Simulazione pagamento
    setTimeout(() => {
      alert("Pagamento riuscito con successo!");
      setLoading(false);
      setSelectedSlot(null);
      setDate('');
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header Blu */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-2">Prenota il tuo Slot</h2>
          <p className="text-blue-100 text-sm">Completa i passaggi sottostanti per confermare.</p>
        </div>

        <div className="p-8 space-y-8">
          
          {/* STEP 1: DATA */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
              <Calendar size={18} className="text-blue-600"/> 1. Seleziona Data
            </label>
            <input 
              type="date" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
              onChange={(e) => setDate(e.target.value)}
              value={date}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* STEP 2: SLOT */}
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
                        ? 'bg-blue-600 border-blue-600 text-white shadow-blue-200 ring-2 ring-blue-300 ring-offset-1' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:shadow-md'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: PAGAMENTO */}
          {selectedSlot && (
            <form onSubmit={handlePayment} className="animate-in fade-in slide-in-from-top-4 duration-500 pt-8 border-t border-dashed border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <CreditCard className="text-blue-600"/> Dati Pagamento
                </h3>
                <span className="text-2xl font-bold text-gray-900">€50.00</span>
              </div>
              
              <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
                <input
                  type="text" placeholder="Nome Intestatario" required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  onChange={e => setPaymentData({...paymentData, cardHolder: e.target.value})}
                />
                
                <input
                  type="text" placeholder="0000 0000 0000 0000" required maxLength={19}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  onChange={e => setPaymentData({...paymentData, cardNumber: e.target.value})}
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text" placeholder="MM/YY" required maxLength={5}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    onChange={e => setPaymentData({...paymentData, expiry: e.target.value})}
                  />
                  <input
                    type="text" placeholder="CVV" required maxLength={3}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    onChange={e => setPaymentData({...paymentData, cvv: e.target.value})}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 bg-yellow-50 p-3 rounded text-yellow-800 border border-yellow-100">
                 <span>⚠️</span>
                 <p>La prenotazione non è rimborsabile. Assicurati di poter essere presente.</p>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full mt-6 py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all transform active:scale-95 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 shadow-green-200 hover:shadow-xl'
                }`}
              >
                {loading ? 'Elaborazione in corso...' : 'Conferma e Paga'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}