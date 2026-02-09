import { createContext, useContext, useEffect, useState } from 'react';

const TripContext = createContext();

export const useTrips = () => useContext(TripContext);

const LOCAL_STORAGE_KEY = 'mes_voyages_data';

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [transports, setTransports] = useState([]);
  const [accommodations, setAccommodations] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setTrips(parsed.trips || []);
        setTransports(parsed.transports || []);
        setAccommodations(parsed.accommodations || []);
      } catch (e) {
        console.error("Failed to parse local storage data", e);
      }
    } else {
      // Mock data for initial testing
      const initialTrips = [
        { id: '1', name: 'Séjour à Mykonos', destination: 'Mykonos, Grèce', startDate: '2024-06-12', endDate: '2024-06-18', status: 'upcoming' },
        { id: '2', name: 'Escapade à Paris', destination: 'Paris, France', startDate: '2024-07-05', endDate: '2024-07-10', status: 'upcoming' },
        { id: '3', name: 'Week-end à Rome', destination: 'Rome, Italie', startDate: '2024-08-22', endDate: '2024-08-25', status: 'planning' }
      ];
      setTrips(initialTrips);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ trips, transports, accommodations }));
  }, [trips, transports, accommodations]);

  const addTrip = (trip) => {
    const newTrip = { ...trip, id: Date.now().toString(), status: 'upcoming' };
    setTrips(prev => [...prev, newTrip]);
  };

  const updateTrip = (updatedTrip) => {
    setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t));
  };

  const deleteTrip = (id) => {
    setTrips(prev => prev.filter(t => t.id !== id));
    setTransports(prev => prev.filter(t => t.tripId !== id));
    setAccommodations(prev => prev.filter(a => a.tripId !== id));
  };

  const addTransport = (transport) => {
    setTransports(prev => [...prev, { ...transport, id: Date.now().toString() }]);
  };

  const updateTransport = (updatedTransport) => {
    setTransports(prev => prev.map(t => t.id === updatedTransport.id ? updatedTransport : t));
  };

  const deleteTransport = (id) => {
    setTransports(prev => prev.filter(t => t.id !== id));
  };

  const addAccommodation = (accommodation) => {
    setAccommodations(prev => [...prev, { ...accommodation, id: Date.now().toString() }]);
  };

  const updateAccommodation = (updatedAccommodation) => {
    setAccommodations(prev => prev.map(a => a.id === updatedAccommodation.id ? updatedAccommodation : a));
  };

  const deleteAccommodation = (id) => {
    setAccommodations(prev => prev.filter(a => a.id !== id));
  };

  const getTripDetails = (tripId) => {
    const trip = trips.find(t => t.id === tripId);
    const tripTransports = transports.filter(t => t.tripId === tripId);
    const tripAccommodations = accommodations.filter(a => a.tripId === tripId);
    return { trip, transports: tripTransports, accommodations: tripAccommodations };
  };

  return (
    <TripContext.Provider value={{
      trips,
      addTrip,
      updateTrip,
      deleteTrip,
      transports,
      addTransport,
      updateTransport,
      deleteTransport,
      accommodations,
      addAccommodation,
      updateAccommodation,
      deleteAccommodation,
      getTripDetails
    }}>
      {children}
    </TripContext.Provider>
  );
};
