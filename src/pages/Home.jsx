import { useState } from 'react';
import { useTrips } from '../context/TripContext';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

export const Home = () => {
  const { trips } = useTrips();
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const upcomingTrips = trips.filter(trip => trip.endDate >= today || !trip.endDate).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  const pastTrips = trips.filter(trip => trip.endDate < today).sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  const displayTrips = activeTab === 'upcoming' ? upcomingTrips : pastTrips;

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
      // Simple hash function to keep color consistent per ID
      const index = String(id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length;
      return gradients[index];
  };

    const getBgColor = (id) => {
      const bgs = [
          'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
          'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
          'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400',
          'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      ];
      const index = String(id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % bgs.length;
      return bgs[index];
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <Header
        title="Mes Voyages"
        rightAction={
            <div className="flex gap-3">
                 <button onClick={() => navigate('/edit-trips')} className="flex items-center justify-center rounded-full h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 active:scale-95 transition-transform">
                    <span className="material-symbols-outlined text-xl">edit_square</span>
                </button>
                <button className="flex items-center justify-center rounded-full h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 active:scale-95 transition-transform">
                    <span className="material-symbols-outlined">account_circle</span>
                </button>
            </div>
        }
      />

      <div className="sticky top-14 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-slate-200 dark:border-white/10 px-4 pt-2">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={clsx(
              "flex flex-col items-center justify-center pb-3 pt-2 border-b-[3px] transition-colors flex-1",
              activeTab === 'upcoming' ? "border-primary text-primary" : "border-transparent text-slate-500 dark:text-slate-400"
            )}
          >
            <p className="text-sm font-bold tracking-wide">À VENIR</p>
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={clsx(
              "flex flex-col items-center justify-center pb-3 pt-2 border-b-[3px] transition-colors flex-1",
              activeTab === 'past' ? "border-primary text-primary" : "border-transparent text-slate-500 dark:text-slate-400"
            )}
          >
            <p className="text-sm font-bold tracking-wide">PASSÉS</p>
          </button>
        </div>
      </div>

      <main className="p-5 flex flex-col gap-6 flex-1">
        {displayTrips.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-50">travel_explore</span>
                <p>Aucun voyage trouvé</p>
            </div>
        ) : (
             displayTrips.map(trip => (
                <Card key={trip.id} onClick={() => navigate(`/trip/${trip.id}`)} className="group">
                    <div className={clsx("absolute left-0 top-0 bottom-0 w-2 opacity-90", getGradient(trip.id))}></div>
                    <div className="flex justify-between items-start mb-4 pl-2">
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-3">
                                <div className={clsx("size-10 rounded-xl flex items-center justify-center shadow-sm", getBgColor(trip.id))}>
                                    <span className="material-symbols-outlined text-2xl font-bold">flight_takeoff</span>
                                </div>
                                <div>
                                    <h2 className="text-slate-900 dark:text-white font-bold text-lg leading-tight">{trip.name}</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">{formatRange(trip.startDate, trip.endDate)}</p>
                                </div>
                            </div>
                        </div>
                        <span className="text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest border-2 bg-green-50 text-green-700 border-green-500/20 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30 shadow-sm">
                            {trip.status === 'planning' ? 'À planifier' : 'Confirmé'}
                        </span>
                    </div>
                    <div className="ml-12 pl-2">
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-4 shadow-inner">
                            <div className={clsx("h-full rounded-full w-[0%]", getGradient(trip.id).replace('bg-gradient-to-b', 'bg-gradient-to-r'))}></div>
                        </div>
                         <div className="flex justify-between items-center mt-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">En attente</span>
                        </div>
                    </div>
                </Card>
            ))
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 p-8 flex justify-center pointer-events-none">
        <button
            onClick={() => navigate('/create-trip')}
            className="pointer-events-auto flex items-center justify-center bg-primary text-white h-16 w-16 rounded-full shadow-2xl shadow-primary/40 active:scale-90 transition-all hover:bg-primary/90"
        >
            <span className="material-symbols-outlined text-4xl font-medium">add</span>
        </button>
      </div>
    </div>
  );
};
