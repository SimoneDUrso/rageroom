import { useState, type FormEvent, type ChangeEvent } from 'react';
import { CreditCard, Calendar, Clock, AlertCircle, ShieldCheck, User, Mail, Phone, Users } from 'lucide-react';

// Interfaccia per i dati della Carta
interface PaymentData {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardHolder: string;
}

// Interfaccia per i dati del Cliente
interface CustomerData {
  fullName: string;
  email: string;
  phone: string;
  peopleCount: number;
}

export default function Booking() {
  const [date, setDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // Stati per i dati
  const [paymentData, setPaymentData] = useState<PaymentData>({ cardNumber: '', expiry: '', cvv: '', cardHolder: '' });
  const [customerData, setCustomerData] = useState<CustomerData>({ fullName: '', email: '', phone: '', peopleCount: 1 });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableSlots = [
    "09:00 - 09:30", "09:30 - 10:00", 
    "16:00 - 16:30", "16:30 - 17:00", 
    "17:00 - 17:30"
  ];

  // --- ALGORITMO DI LUHN ---
  const isValidLuhn = (val: string) => {
    let number = val.replace(/\D/g, '');
    if (number.length < 13 || number.length > 19) return false;
    let sum = 0;
    let shouldDouble = false;
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

  // --- HANDLERS PAGAMENTO ---
  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.slice(0, 16);
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setPaymentData({ ...paymentData, cardNumber: formattedValue });
    setError(null);
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
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setPaymentData({ ...paymentData, cardHolder: value });
  };

  // --- HANDLERS CLIENTE ---
  const handleCustomerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  // --- VALIDAZIONE ---
  const validateForm = (): boolean => {
    
    // 1. Validazione Dati Cliente
    if (!customerData.fullName.trim()) {
      setError("Inserisci il Nome e Cognome del cliente.");
      return false;
    }
    
    // Regex email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerData.email)) {
      setError("Inserisci un indirizzo email valido per la fattura.");
      return false;
    }
    
    if (customerData.phone.length < 6) {
      setError("Inserisci un numero di telefono valido.");
      return false;
    }

    if (customerData.peopleCount < 1 || customerData.peopleCount > 10) {
      setError("Il numero di persone deve essere tra 1 e 10.");
      return false;
    }

    // 2. Validazione Pagamento (NUMERO CARTA)
    const cleanCardNumber = paymentData.cardNumber.replace(/\s/g, '');

    // CHECK A: Non deve essere vuota o troppo corta
    if (cleanCardNumber.length < 13) {
      setError("Il numero della carta è incompleto.");
      return false;
    }

    // CHECK B: Controllo Prefissi Reali (Visa, MC, Amex, Discover, ecc.)
    // Questo blocca "0000...", "1111..." e carte inventate che non iniziano con i numeri giusti.
    // Accetta: Visa (4), Mastercard (5), Amex (3), Discover (6)
    const cardIssuerRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$/;
    
    if (!cardIssuerRegex.test(cleanCardNumber)) {
      setError("Circuito carta non riconosciuto (accettiamo solo Visa, Mastercard, Amex).");
      return false;
    }

    // CHECK C: Algoritmo di Luhn (Matematico)
    if (!isValidLuhn(cleanCardNumber)) {
      setError("Il numero della carta non è valido (errore di digitazione).");
      return false;
    }

    // 3. Validazione Date e Scadenza
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    if (!date || selectedDate < today) {
      setError("Non puoi prenotare una data nel passato.");
      return false;
    }

    if (paymentData.expiry.length !== 5) {
      setError("Inserisci la scadenza completa (MM/YY).");
      return false;
    }

    const monthPart = paymentData.expiry.substring(0, 2);
    const yearPart = paymentData.expiry.substring(3, 5);
    const month = parseInt(monthPart, 10);
    const year = parseInt('20' + yearPart, 10);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (isNaN(month) || month < 1 || month > 12) {
      setError("Mese scadenza non valido (01-12).");
      return false;
    }
    if (isNaN(year) || year < currentYear || (year === currentYear && month < currentMonth)) {
      setError("La carta inserita è scaduta.");
      return false;
    }
    if (paymentData.cvv.length < 3) {
      setError("Il CVV deve avere 3 cifre.");
      return false;
    }
    
    return true;
  };

  const handlePayment = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

    const payload = {
      booking: {
        date: date,
        slot: selectedSlot,
        people: customerData.peopleCount
      },
      customer: {
        name: customerData.fullName,
        email: customerData.email,
        phone: customerData.phone
      },
      payment: {
        amount: 50.00,
        currency: 'EUR',
        cardHolder: paymentData.cardHolder,
        maskedCard: "**** **** **** " + paymentData.cardNumber.slice(-4) 
      }
    };

    console.log(`🚀 INVIO A ${apiUrl}/api/prenotazione:`, payload);

    setTimeout(() => {
      alert(`Prenotazione confermata per ${customerData.peopleCount} persone! Fattura inviata a: ${customerData.email}`);
      setLoading(false);
      
      setSelectedSlot(null);
      setDate('');
      setPaymentData({ cardNumber: '', expiry: '', cvv: '', cardHolder: '' });
      setCustomerData({ fullName: '', email: '', phone: '', peopleCount: 1 });
      setError(null);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto mb-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark p-8 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Prenota il tuo Slot</h2>
            <p className="text-blue-100 text-sm">Completa i dati per ricevere la conferma</p>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5 transform -skew-y-12 translate-y-10"></div>
        </div>

        <div className="p-8 space-y-8">
          
          {/* 1. DATA */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
              <Calendar size={18} className="text-primary"/> 1. Seleziona Data
            </label>
            <input 
              type="date" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
              onChange={(e) => setDate(e.target.value)}
              value={date}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* 2. ORARIO */}
          {date && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                <Clock size={18} className="text-primary"/> 2. Seleziona Orario
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3 px-2 rounded-xl text-sm font-medium border transition-all duration-200 shadow-sm ${
                      selectedSlot === slot 
                        ? 'bg-primary border-primary text-white shadow-lg ring-2 ring-primary/50' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-primary/50 hover:text-primary hover:bg-primary-light'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FORM PRINCIPALE */}
          {selectedSlot && (
            <form onSubmit={handlePayment} className="animate-in fade-in slide-in-from-top-4 duration-500 pt-6 border-t border-dashed border-gray-200">
              
              {/* ERRORI GLOBALI */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-start gap-3 border border-red-200 animate-pulse">
                  <AlertCircle className="shrink-0 mt-0.5" size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* --- SEZIONE 3: DATI CLIENTE --- */}
              <div className="mb-8">
                 <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <User className="text-primary"/> 3. Dati Prenotazione
                </h3>
                
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                  {/* Nome e Persone */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Nome e Cognome</label>
                      <div className="relative">
                        <input
                          type="text" name="fullName" placeholder="Es. Giuseppe Verdi" required
                          className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition bg-white"
                          value={customerData.fullName} onChange={handleCustomerChange}
                        />
                        <User className="absolute left-3 top-3.5 text-gray-400" size={18}/>
                      </div>
                    </div>
                    
                    {/* INPUT PERSONE AGGIORNATO */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                        Numero Persone <span className="text-primary font-normal">(Max 10)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number" 
                          name="peopleCount" 
                          min="1" 
                          max="10" 
                          required
                          className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition bg-white"
                          value={customerData.peopleCount} onChange={handleCustomerChange}
                        />
                        <Users className="absolute left-3 top-3.5 text-gray-400" size={18}/>
                      </div>
                    </div>
                  </div>

                  {/* Email e Telefono */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email (per Fattura)</label>
                      <div className="relative">
                        <input
                          type="email" name="email" placeholder="esempio@email.com" required
                          className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition bg-white"
                          value={customerData.email} onChange={handleCustomerChange}
                        />
                        <Mail className="absolute left-3 top-3.5 text-gray-400" size={18}/>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Telefono</label>
                      <div className="relative">
                        <input
                          type="tel" name="phone" placeholder="+39 333 ..." required
                          className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition bg-white"
                          value={customerData.phone} onChange={handleCustomerChange}
                        />
                        <Phone className="absolute left-3 top-3.5 text-gray-400" size={18}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- SEZIONE 4: DATI PAGAMENTO --- */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <CreditCard className="text-primary"/> 4. Pagamento
                  </h3>
                  <div className="text-right">
                    <span className="block text-2xl font-bold text-gray-900">€50.00</span>
                    <span className="text-xs text-gray-400">IVA Inclusa</span>
                  </div>
                </div>
                
                <div className="space-y-5 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  
                  {/* Intestatario Carta */}
                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Intestatario Carta</label>
                      <input
                      type="text" placeholder="Es. MARIO ROSSI" required
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition bg-white"
                      value={paymentData.cardHolder} onChange={handleCardHolderChange}
                      />
                  </div>
                  
                  {/* Numero Carta */}
                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Numero Carta</label>
                      <div className="relative">
                        <input
                          type="text" placeholder="0000 0000 0000 0000" required maxLength={19}
                          className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition bg-white"
                          value={paymentData.cardNumber} onChange={handleCardNumberChange}
                        />
                        <CreditCard className="absolute left-3 top-3.5 text-gray-400" size={18}/>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Scadenza</label>
                      <input
                          type="text" placeholder="MM/YY" required maxLength={5}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition bg-white text-center"
                          value={paymentData.expiry} onChange={handleExpiryChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">CVV</label>
                      <input
                          type="password" placeholder="123" required maxLength={3}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition bg-white text-center"
                          value={paymentData.cvv} onChange={handleCvvChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Note e Bottone */}
              <div className="mt-6 flex items-start gap-3 text-xs text-gray-500 bg-yellow-50 p-4 rounded-xl text-yellow-800 border border-yellow-100">
                 <ShieldCheck className="shrink-0" size={20}/>
                 <div>
                   <p className="font-bold mb-1">Conferma Prenotazione</p>
                   <p>Cliccando confermi i dati. La ricevuta verrà inviata automaticamente all'indirizzo <b>{customerData.email || "email indicato"}</b>.</p>
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full mt-6 py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all transform active:scale-[0.98] ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed opacity-75' 
                    : 'bg-success hover:bg-success-dark shadow-green-200 hover:shadow-xl'
                }`}
              >
                {loading ? 'Invio Ordine...' : `Paga €50.00 e Prenota`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}