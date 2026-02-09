import { useTrips } from '../context/TripContext';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

export const EditTripList = () => {
  const { trips, deleteTrip } = useTrips();
  const navigate = useNavigate();

  // Sort upcoming first
  const sortedTrips = [...trips].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const formatRange = (start, end) => {
    if (!start) return '';
    const s = new Date(start);
    const e = end ? new Date(end) : null;

    const startDay = s.getDate();
    const startMonth = s.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase();

    if (e) {
      const endDay = e.getDate();
      const endMonth = e.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase();
      if (s.getMonth() === e.getMonth()) {
          return `${startDay} - ${endDay} ${startMonth} ${s.getFullYear()}`;
      }
       return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${s.getFullYear()}`;
    }
    return `${startDay} ${startMonth} ${s.getFullYear()}`;
  };

  const getGradient = (id) => {
      const gradients = [
          'bg-gradient-to-b from-blue-400 via-cyan-400 to-blue-600',
          'bg-gradient-to-b from-indigo-400 via-purple-400 to-indigo-600',
          'bg-gradient-to-b from-amber-400 via-orange-400 to-red-500',
          'bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-600',
      ];
      const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length;
      return gradients[index];
  };

   const getBgColor = (id) => {
      const bgs = [
          'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
          'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
          'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400',
          'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      ];
      const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % bgs.length;
      return bgs[index];
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <Header
        title="Mes Voyages"
        rightAction={
             <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="px-4 h-9 bg-primary/10 text-primary rounded-full font-bold text-sm">
                Terminer
            </Button>
        }
      />

      <main className="p-5 flex flex-col gap-6 flex-1">
        <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-4 mb-2 flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-500">info</span>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300 leading-tight">
                Mode édition activé. Vous pouvez réorganiser vos voyages ou les supprimer de votre liste.
            </p>
        </div>

        {sortedTrips.map(trip => (
             <Card key={trip.id} className="flex items-center gap-4 border-2 border-dashed border-slate-300 dark:border-white/20">
                <div className={clsx("absolute left-0 top-0 bottom-0 w-1.5 opacity-90", getGradient(trip.id))}></div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={clsx("size-10 rounded-xl flex items-center justify-center shadow-sm", getBgColor(trip.id))}>
                             <span className="material-symbols-outlined text-2xl font-bold">flight_takeoff</span>
                        </div>
                        <div className="truncate">
                            <h2 className="text-slate-900 dark:text-white font-bold text-lg leading-tight truncate">{trip.name}</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-semibold uppercase tracking-wider">{formatRange(trip.startDate, trip.endDate)}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 absolute top-3 right-3">
                    <button className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full h-8 w-8 shadow-sm active:scale-90 transition-transform">
                        <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                    <button
                        onClick={async () => await deleteTrip(trip.id)}
                        className="flex items-center justify-center bg-red-100 dark:bg-red-500/20 text-red-500 rounded-full h-8 w-8 shadow-sm active:scale-90 transition-transform border border-red-200 dark:border-red-500/30">
                        <span className="material-symbols-outlined text-xl font-bold">delete</span>
                    </button>
                </div>
            </Card>
        ))}
      </main>
    </div>
  );
};
