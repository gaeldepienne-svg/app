import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { clsx } from 'clsx';

export const AddTransport = () => {
  const { id } = useParams();
  const { addTransport } = useTrips();
  const navigate = useNavigate();
  const [type, setType] = useState('Train');

  const departureCityRef = useRef();
  const arrivalCityRef = useRef();
  const departureDateRef = useRef();
  const departureTimeRef = useRef();
  const arrivalTimeRef = useRef();

  const carriageRef = useRef();
  const seatRef = useRef();
  const priceRef = useRef();
  const ticketNumberRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const transport = {
      tripId: id,
      type,
      departureCity: departureCityRef.current.value,
      arrivalCity: arrivalCityRef.current.value,
      departureDate: departureDateRef.current.value,
      departureTime: departureTimeRef.current.value,
      arrivalTime: arrivalTimeRef.current.value,
      carriage: carriageRef.current.value,
      seat: seatRef.current.value,
      price: priceRef.current.value,
      ticketNumber: ticketNumberRef.current?.value,
    };
    addTransport(transport);
    navigate(`/trip/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Détails du Transport" showBack rightAction={<span className="material-symbols-outlined text-primary">help</span>} />

      <main className="flex-1 overflow-y-auto pb-44 p-4">
        <div className="flex mb-6">
          <div className="flex h-12 flex-1 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800/50 p-1">
            <button className="flex h-full grow items-center justify-center rounded-lg px-2 bg-white dark:bg-background-dark shadow-sm text-primary text-sm font-semibold transition-all cursor-default">
                Transport
            </button>
            <button onClick={() => navigate(`/trip/${id}/add-accommodation`)} className="flex h-full grow items-center justify-center rounded-lg px-2 text-slate-500 dark:text-slate-400 text-sm font-semibold transition-all">
                Hébergement
            </button>
          </div>
        </div>

        <div className="space-y-6">
            <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 px-1">Type de transport</p>
                <div className="flex gap-3 flex-wrap">
                    {['Train', 'Avion', 'Bus'].map(t => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            className={clsx(
                                "flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl pl-3 pr-4 transition-all",
                                type === t ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-200 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                            )}
                        >
                            <span className="material-symbols-outlined text-xl">{t === 'Train' ? 'train' : t === 'Avion' ? 'flight' : 'directions_bus'}</span>
                            <p className="text-sm font-semibold leading-normal">{t}</p>
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} id="transport-form" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input ref={departureCityRef} label="Ville de départ" icon="my_location" placeholder="Ex: Lyon, France" required />
                    <Input ref={arrivalCityRef} label="Ville de destination" icon="location_on" placeholder="Ex: Paris, France" required />
                </div>

                <div className="bg-slate-100/50 dark:bg-slate-800/30 p-4 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-primary text-xl font-bold">trending_flat</span>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Aller</h3>
                    </div>
                    <Input ref={departureDateRef} label="Date de départ" type="date" icon="calendar_today" required />

                    <div className="grid grid-cols-2 gap-4">
                        <Input ref={departureTimeRef} label="Départ (Heure)" type="time" icon="schedule" required />
                        <Input ref={arrivalTimeRef} label="Arrivée (Heure)" type="time" icon="schedule_send" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input ref={carriageRef} label="Voiture / Wagon" placeholder="Ex: 12" icon="train" />
                        <Input ref={seatRef} label="Siège" placeholder="Ex: 45A" icon="airline_seat_recline_normal" />
                    </div>
                    <Input ref={ticketNumberRef} label="Numéro de billet/vol" placeholder="Ex: TGV 6622" icon="confirmation_number" />
                </div>

                <Input ref={priceRef} label="Prix global" type="number" step="0.01" placeholder="0.00" icon="payments" suffix="€" />

                <button type="button" className="flex w-full items-center justify-center gap-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-primary font-bold hover:bg-primary/5 transition-colors">
                    <span className="material-symbols-outlined">document_scanner</span>
                    <span>Scanner un billet</span>
                </button>
            </form>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-20">
        <Button onClick={handleSubmit} className="w-full h-14" size="lg" icon={({className}) => <span className={`material-symbols-outlined ${className}`}>add_circle</span>}>
            Ajouter au voyage
        </Button>
      </div>
    </div>
  );
};
