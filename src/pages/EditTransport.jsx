import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { clsx } from 'clsx';

export const EditTransport = () => {
  const { id, itemId } = useParams();
  const { getTripDetails, updateTransport } = useTrips();
  const navigate = useNavigate();

  const { transports } = getTripDetails(id) || {};
  const transport = transports?.find(t => t.id === itemId);

  if (!transport) return <div>Transport introuvable</div>;

  const [type, setType] = useState(transport.type);

  const departureCityRef = useRef();
  const arrivalCityRef = useRef();
  const departureDateRef = useRef();
  const departureTimeRef = useRef();
  const arrivalTimeRef = useRef();
  const carriageRef = useRef();
  const seatRef = useRef();
  const priceRef = useRef();
  const ticketNumberRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedTransport = {
      ...transport,
      type,
      departureCity: departureCityRef.current.value,
      arrivalCity: arrivalCityRef.current.value,
      departureDate: departureDateRef.current.value,
      departureTime: departureTimeRef.current.value,
      arrivalTime: arrivalTimeRef.current.value,
      carriage: carriageRef.current.value,
      seat: seatRef.current.value,
      price: priceRef.current.value,
      ticketNumber: ticketNumberRef.current.value,
    };
    await updateTransport(updatedTransport);
    navigate(`/trip/${id}/edit`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Modifier le Trajet" showBack rightAction={<div className="size-10"></div>} />

      <main className="flex-1 overflow-y-auto pb-44 p-4">
        <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-[28px]">{type === 'Train' ? 'train' : type === 'Avion' ? 'flight' : 'directions_bus'}</span>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Trajet en {type}</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{transport.departureCity} - {transport.arrivalCity}</p>
                </div>
            </div>
        </section>

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

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input ref={ticketNumberRef} defaultValue={transport.ticketNumber} label="Nom du train / N° Vol" icon="directions_transit" />

                <div className="grid grid-cols-2 gap-4">
                    <Input ref={departureCityRef} defaultValue={transport.departureCity} label="Gare Départ" icon="location_on" />
                    <Input ref={arrivalCityRef} defaultValue={transport.arrivalCity} label="Gare Arrivée" icon="location_on" />
                </div>

                 <Input ref={departureDateRef} defaultValue={transport.departureDate} label="Date de départ" type="date" icon="calendar_today" required />

                <div className="grid grid-cols-2 gap-4">
                    <Input ref={departureTimeRef} defaultValue={transport.departureTime} label="Départ" type="time" icon="schedule" />
                    <Input ref={arrivalTimeRef} defaultValue={transport.arrivalTime} label="Arrivée" type="time" icon="schedule" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input ref={carriageRef} defaultValue={transport.carriage} label="Voiture" icon="train" />
                    <Input ref={seatRef} defaultValue={transport.seat} label="Siège" icon="event_seat" />
                </div>

                <Input ref={priceRef} defaultValue={transport.price} label="Prix global" icon="payments" suffix="€" type="number" step="0.01" />
            </form>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-20">
        <Button onClick={handleSubmit} className="w-full h-14" size="lg">
            Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
};
