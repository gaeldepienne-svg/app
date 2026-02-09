import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { Header } from '../components/Header';
import { Input, Select } from '../components/Input';
import { Button } from '../components/Button';

export const EditAccommodation = () => {
  const { id, itemId } = useParams();
  const { getTripDetails, updateAccommodation } = useTrips();
  const navigate = useNavigate();

  const { accommodations } = getTripDetails(id) || {};
  const accommodation = accommodations?.find(a => a.id === itemId);

  if (!accommodation) return <div>Hébergement introuvable</div>;

  const platformRef = useRef();
  const nameRef = useRef();
  const addressRef = useRef();
  const checkInDateRef = useRef();
  const checkOutDateRef = useRef();
  const cancellationDateRef = useRef();
  const bookingLinkRef = useRef();
  const priceRef = useRef();

  const [breakfast, setBreakfast] = useState(accommodation.breakfastIncluded);
  const [cancellable, setCancellable] = useState(accommodation.cancellable);
  const [paymentStatus, setPaymentStatus] = useState(accommodation.paymentStatus);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedAccommodation = {
      ...accommodation,
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
    await updateAccommodation(updatedAccommodation);
    navigate(`/trip/${id}/edit`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Modifier l'Hébergement" showBack rightAction={<div className="size-10"></div>} />

      <main className="flex-1 overflow-y-auto pb-44 p-4">
        <div className="relative group mb-6">
            <div className="h-48 w-full rounded-2xl overflow-hidden relative shadow-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                 <span className="material-symbols-outlined text-6xl text-slate-400">image</span>
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <button className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white text-sm font-semibold flex items-center gap-2" type="button">
                        <span className="material-symbols-outlined text-lg">photo_camera</span>
                        Modifier l'image
                    </button>
                 </div>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <Input ref={nameRef} defaultValue={accommodation.name} label="Nom de l'hébergement" />

            <div className="grid grid-cols-2 gap-4">
                <Input ref={checkInDateRef} defaultValue={accommodation.checkInDate} label="Arrivée" type="date" />
                <Input ref={checkOutDateRef} defaultValue={accommodation.checkOutDate} label="Départ" type="date" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input ref={priceRef} defaultValue={accommodation.price} label="Prix total" type="number" step="0.01" suffix="€" />
                <Input ref={platformRef} defaultValue={accommodation.platform} label="Plateforme" placeholder="Ex: Booking.com..." />
            </div>

             <div className="bg-white dark:bg-slate-800/30 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <span className="material-symbols-outlined">restaurant</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Petit-déjeuner inclus</p>
                            <p className="text-xs text-slate-500">Inclus dans la réservation</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={breakfast} onChange={(e) => setBreakfast(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                 <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <span className="material-symbols-outlined">event_available</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Annulable gratuitement</p>
                                <p className="text-xs text-slate-500">Remboursement total possible</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={cancellable} onChange={(e) => setCancellable(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                    </div>
                     {cancellable && (
                        <div className="pl-13 ml-13">
                             <Input ref={cancellationDateRef} defaultValue={accommodation.cancellationDate} label="Date limite d'annulation" type="date" className="bg-slate-50 dark:bg-slate-900/50" />
                        </div>
                     )}
                 </div>
            </div>

            <Input ref={bookingLinkRef} defaultValue={accommodation.bookingLink} label="Lien de la réservation" icon="link" type="url" />
             <Input ref={addressRef} defaultValue={accommodation.address} label="Adresse" icon="location_on" />
        </form>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-20">
        <Button onClick={handleSubmit} className="w-full h-14" size="lg">
            Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
};
