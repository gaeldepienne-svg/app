import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { Header } from '../components/Header';
import { Input, Select } from '../components/Input';
import { Button } from '../components/Button';

export const AddAccommodation = () => {
  const { id } = useParams();
  const { addAccommodation } = useTrips();
  const navigate = useNavigate();

  const platformRef = useRef();
  const nameRef = useRef();
  const addressRef = useRef();
  const checkInDateRef = useRef();
  const checkOutDateRef = useRef();
  const cancellationDateRef = useRef();
  const bookingLinkRef = useRef();
  const priceRef = useRef();

  const [breakfast, setBreakfast] = useState(false);
  const [cancellable, setCancellable] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('paid');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accommodation = {
      tripId: id,
      platform: platformRef.current.value,
      name: nameRef.current.value,
      address: addressRef.current.value,
      checkInDate: checkInDateRef.current.value,
      checkOutDate: checkOutDateRef.current.value,
      cancellable,
      cancellationDate: cancellationDateRef.current?.value,
      breakfastIncluded: breakfast,
      bookingLink: bookingLinkRef.current.value,
      price: priceRef.current.value,
      paymentStatus
    };
    await addAccommodation(accommodation);
    navigate(`/trip/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Ajouter un Hébergement" showBack rightAction={<span className="material-symbols-outlined text-primary">help</span>} />

      <main className="flex-1 overflow-y-auto pb-48 p-4">
        <div className="flex mb-6">
          <div className="flex h-12 flex-1 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800/50 p-1">
            <button onClick={() => navigate(`/trip/${id}/add-transport`)} className="flex h-full grow items-center justify-center rounded-lg px-2 text-slate-500 dark:text-slate-400 text-sm font-semibold transition-all">
                Transport
            </button>
            <button className="flex h-full grow items-center justify-center rounded-lg px-2 bg-white dark:bg-background-dark shadow-sm text-primary text-sm font-semibold transition-all cursor-default">
                Hébergement
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <Select ref={platformRef} label="Plateforme de réservation" icon="apps">
                <option value="">Sélectionner une plateforme</option>
                <option value="booking">Booking.com</option>
                <option value="airbnb">Airbnb</option>
                <option value="direct">Réservation Directe</option>
                <option value="other">Autre</option>
            </Select>

            <Input ref={nameRef} label="Nom de l'établissement" icon="hotel" placeholder="Ex: Hôtel Royal, Villa..." required />
            <Input ref={addressRef} label="Ville / Adresse" icon="location_on" placeholder="Ex: 12 Rue de Rivoli, Paris" required />

            <div className="bg-slate-100/50 dark:bg-slate-800/30 p-4 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-2 gap-4">
                    <Input ref={checkInDateRef} label="Check-in" type="date" icon="calendar_today" required />
                    <Input ref={checkOutDateRef} label="Check-out" type="date" icon="calendar_today" required />
                </div>
            </div>

            <div className="flex items-center justify-between bg-slate-200/50 dark:bg-slate-800/50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400">restaurant</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">Petit-déjeuner inclus</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={breakfast} onChange={(e) => setBreakfast(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
            </div>

            <div className="bg-slate-100/50 dark:bg-slate-800/30 p-4 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400">event_busy</span>
                        <span className="text-slate-700 dark:text-slate-300 font-semibold">Annulable</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={cancellable} onChange={(e) => setCancellable(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                </div>
                {cancellable && (
                    <Input ref={cancellationDateRef} label="Date limite d'annulation" type="date" icon="event_available" />
                )}
            </div>

            <Select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} label="Statut du paiement" icon="account_balance_wallet">
                <option value="paid">Déjà payé</option>
                <option value="onsite">Paiement sur place</option>
            </Select>

            <Input ref={priceRef} label="Prix total du séjour" type="number" step="0.01" placeholder="0.00" icon="payments" suffix="€" />

            <div className="space-y-4 pt-4">
                <p className="text-slate-700 dark:text-slate-300 text-sm font-semibold px-1">Médias de réservation</p>
                <div className="grid grid-cols-1 gap-4">
                     <Input ref={bookingLinkRef} placeholder="Lien de la réservation (URL)" type="url" icon="link" />
                     <button type="button" className="flex w-full items-center justify-center gap-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-primary font-bold hover:bg-primary/5 transition-colors">
                        <span className="material-symbols-outlined">document_scanner</span>
                        <span>Scanner un document</span>
                    </button>
                </div>
            </div>
        </form>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-20">
        <Button onClick={handleSubmit} className="w-full h-14" size="lg" icon={({className}) => <span className={`material-symbols-outlined ${className}`}>add_circle</span>}>
            Ajouter au voyage
        </Button>
      </div>
    </div>
  );
};
