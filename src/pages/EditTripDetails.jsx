import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { Header } from '../components/Header';
import { clsx } from 'clsx';
import { Button } from '../components/Button';

export const EditTripDetails = () => {
  const { id } = useParams();
  const { getTripDetails, deleteTransport, deleteAccommodation } = useTrips();
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

  const handleEdit = (item) => {
      if (item.itemType === 'transport') {
          navigate(`/trip/${id}/transport/${item.id}/edit`);
      } else {
          navigate(`/trip/${id}/accommodation/${item.id}/edit`);
      }
  };

  const handleDelete = (item) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
        if (item.itemType === 'transport') {
            deleteTransport(item.id);
        } else {
            deleteAccommodation(item.id);
        }
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <Header
        title="Mode Édition"
        showBack
        rightAction={
            <button
                onClick={() => navigate(`/trip/${id}`)}
                className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 font-bold text-sm"
            >
                Terminer
            </button>
        }
      />

      <main className="flex-1 w-full max-w-md mx-auto px-4 pb-12">
        <section className="flex py-6 flex-col gap-1 items-start">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary mb-1 w-fit">
                Modification en cours
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
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(item)} className="text-primary bg-primary/10 p-1.5 rounded-lg active:scale-90 transition-transform">
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                </button>
                                <button onClick={() => handleDelete(item)} className="text-red-500 bg-red-500/10 p-1.5 rounded-lg active:scale-90 transition-transform">
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>
                        </div>

                        {/* Card Content based on type - Opacity reduced for edit mode visual cue */}
                        <div className="opacity-60 pointer-events-none">
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
                            </div>
                        ) : (
                            <div className="relative overflow-hidden bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl mt-1 shadow-sm">
                                <div className="h-24 w-full bg-slate-200 dark:bg-slate-700 relative flex items-center justify-center">
                                     <span className="material-symbols-outlined text-4xl text-slate-400">image</span>
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                </div>
                                <div className="p-4">
                                     {item.platform && (
                                            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tight w-fit">
                                                <span className="material-symbols-outlined text-[14px]">language</span>
                                                {item.platform === 'booking' ? 'Booking.com' : item.platform === 'airbnb' ? 'Airbnb' : item.platform}
                                            </div>
                                        )}
                                </div>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </main>
    </div>
  );
};
