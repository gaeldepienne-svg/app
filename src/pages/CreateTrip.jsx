import { useRef } from 'react';
import { useTrips } from '../context/TripContext';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export const CreateTrip = () => {
  const { addTrip } = useTrips();
  const navigate = useNavigate();

  const nameRef = useRef();
  const destinationRef = useRef();
  const startDateRef = useRef();
  const endDateRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTrip = {
      name: nameRef.current.value,
      destination: destinationRef.current.value,
      startDate: startDateRef.current.value,
      endDate: endDateRef.current.value,
    };
    addTrip(newTrip);
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Créer un Voyage" showBack />

      <main className="p-6 max-w-md mx-auto w-full flex-1">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Input ref={nameRef} label="Nom du voyage" placeholder="ex: Vacances d'été, Roadtrip..." required />
            <Input ref={destinationRef} label="Destination" placeholder="Où allez-vous ?" icon="location_on" required />

            <div className="grid grid-cols-2 gap-4">
                <Input ref={startDateRef} label="Date de début" type="date" required />
                <Input ref={endDateRef} label="Date de fin" type="date" required />
            </div>

            <div className="mt-12 flex flex-col items-center justify-center text-slate-500/30">
                <span className="material-symbols-outlined text-8xl">explore</span>
            </div>
        </form>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 p-6 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-t border-slate-200 dark:border-white/10 flex justify-center">
        <Button onClick={handleSubmit} className="w-full max-w-sm" size="lg" icon={({className}) => <span className={`material-symbols-outlined ${className}`}>check_circle</span>}>
            CRÉER LE VOYAGE
        </Button>
      </div>
    </div>
  );
};
