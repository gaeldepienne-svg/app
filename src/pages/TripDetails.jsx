import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { Header } from '../components/Header';
import { clsx } from 'clsx';
import { Button } from '../components/Button';

export const TripDetails = () => {
  const { id } = useParams();
  const { getTripDetails } = useTrips();
  const navigate = useNavigate();

  const { trip, transports, accommodations } = getTripDetails(id) || {};

  if (!trip) return <div className="p-10 text-center">Voyage introuvable</div>;

  const timelineItems = [
    ...transports.map(t => ({ ...t, itemType: 'transport', sortDate: t.departureDate + t.departureTime })),
    ...accommodations.map(a => ({ ...a, itemType: 'accommodation', sortDate: a.checkInDate + '00:00' }))
  ].sort((a, b) => a.sortDate.localeCompare(b.sortDate));

  const totalBudget = timelineItems.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0);

  const formatPrice = (price) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  const formatDate = (dateStr) => {
      if(!dateStr) return '';
      return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <Header
        title="Itinéraire Détaillé"
        showBack
        rightAction={
            <button
                onClick={() => navigate(`/trip/${id}/edit`)}
                className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 font-semibold text-sm"
            >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Modifier
            </button>
        }
      />

      <main className="flex-1 w-full max-w-md mx-auto px-4 pb-12">
        <section className="flex py-6 flex-col gap-1 items-start">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary mb-1 w-fit">
                {trip.status === 'upcoming' ? 'À venir' : 'Passé'}
            </span>
            <h1 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">{trip.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium">{formatDate(trip.startDate)} - {formatDate(trip.endDate)} {new Date(trip.startDate).getFullYear()}</p>
            <div className="flex items-center gap-2 mt-2 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg">
                <span className="material-symbols-outlined text-slate-400 text-sm">payments</span>
                <p className="text-slate-900 dark:text-white text-sm font-bold">{formatPrice(totalBudget)} <span className="text-slate-400 font-normal text-xs uppercase ml-1">Total Budget</span></p>
            </div>
        </section>

        <div className="relative mt-4">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight mb-6">Chronologie du voyage</h3>
            <div className="absolute left-[19px] top-12 bottom-0 w-[2px] bg-slate-200 dark:bg-slate-800"></div>

            {timelineItems.map((item, index) => (
                <div key={item.id} className="relative grid grid-cols-[40px_1fr] gap-x-4 mb-8">
                    <div className="flex flex-col items-center z-10">
                        <div className={clsx(
                            "flex size-10 items-center justify-center rounded-full text-white shadow-[0_0_15px_rgba(0,0,0,0.1)]",
                            item.itemType === 'transport' ? 'bg-primary shadow-[0_0_15px_rgba(19,127,236,0.3)]' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        )}>
                            <span className="material-symbols-outlined text-[20px]">
                                {item.itemType === 'transport' ? (item.type === 'Avion' ? 'flight_takeoff' : item.type === 'Train' ? 'train' : 'directions_bus') : 'hotel'}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-900 dark:text-white text-base font-bold">{item.itemType === 'transport' ? `${item.type} - ${item.ticketNumber || ''}` : item.name}</p>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                    {item.itemType === 'transport' ? `${item.departureCity} -> ${item.arrivalCity}` : `${item.address}`}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-primary text-sm font-bold block">{formatDate(item.itemType === 'transport' ? item.departureDate : item.checkInDate)}</span>
                                <span className="text-slate-900 dark:text-white text-xs font-bold">{formatPrice(item.price)}</span>
                            </div>
                        </div>

                        {/* Card Content based on type */}
                        {item.itemType === 'transport' ? (
                            <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-4 rounded-xl mt-1 shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-slate-900 dark:text-white">{item.departureTime}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase truncate max-w-[60px]">{item.departureCity && item.departureCity.substring(0, 3)}</p>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center px-4">
                                        <div className="w-full h-[1px] bg-slate-300 dark:bg-slate-700 relative">
                                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-slate-400">
                                                <span className="material-symbols-outlined text-xs">flight</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-slate-900 dark:text-white">{item.arrivalTime}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase truncate max-w-[60px]">{item.arrivalCity && item.arrivalCity.substring(0, 3)}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 mb-3">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Voiture</span>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{item.carriage || '-'}</span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Siège</span>
                                        <span className="text-sm font-bold text-primary">{item.seat || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative overflow-hidden bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl mt-1 shadow-sm">
                                 {/* Placeholder Image or actual if we had it */}
                                <div className="h-24 w-full bg-slate-200 dark:bg-slate-700 relative flex items-center justify-center">
                                     <span className="material-symbols-outlined text-4xl text-slate-400">image</span>
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                      <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-white/70 tracking-tight">Logement</p>
                                            <p className="text-sm font-bold text-white truncate">{item.name}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {item.platform && (
                                            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tight">
                                                <span className="material-symbols-outlined text-[14px]">language</span>
                                                {item.platform === 'booking' ? 'Booking.com' : item.platform === 'airbnb' ? 'Airbnb' : item.platform}
                                            </div>
                                        )}
                                        {item.breakfastIncluded && (
                                            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">
                                                <span className="material-symbols-outlined text-[14px]">coffee</span>
                                                Petit-déjeuner
                                            </div>
                                        )}
                                    </div>
                                     <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">Check-in</p>
                                             <p className="text-sm font-bold text-slate-900 dark:text-white">{formatDate(item.checkInDate)}</p>
                                        </div>
                                        <div className="flex flex-col gap-1 text-right">
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">Check-out</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{formatDate(item.checkOutDate)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </main>

      <div className="fixed bottom-8 right-6 z-50">
        <div className="relative group">
            <button className="bg-primary text-white shadow-xl shadow-primary/40 size-14 rounded-full flex items-center justify-center active:scale-95 transition-transform peer focus:rotate-45">
                <span className="material-symbols-outlined text-[28px]">add</span>
            </button>
             <div className="absolute bottom-16 right-0 flex flex-col gap-2 items-end opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto peer-focus:opacity-100 peer-focus:pointer-events-auto transition-all">
                <button onClick={() => navigate(`/trip/${id}/add-accommodation`)} className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
                    <span className="font-bold text-sm">Hébergement</span>
                    <span className="material-symbols-outlined">hotel</span>
                </button>
                 <button onClick={() => navigate(`/trip/${id}/add-transport`)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
                    <span className="font-bold text-sm">Transport</span>
                    <span className="material-symbols-outlined">train</span>
                </button>
             </div>
        </div>
      </div>
    </div>
  );
};
