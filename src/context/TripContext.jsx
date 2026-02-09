import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const TripContext = createContext();

export const useTrips = () => useContext(TripContext);

const LOCAL_STORAGE_KEY = 'mes_voyages_data';

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [transports, setTransports] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSupabaseEnabled = !!supabase && !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Mappers
  const mapTripFromDB = (t) => ({
      id: t.id,
      name: t.name,
      destination: t.destination,
      startDate: t.start_date,
      endDate: t.end_date,
      status: t.status
  });

  const mapTripToDB = (t) => ({
      name: t.name,
      destination: t.destination,
      start_date: t.startDate,
      end_date: t.endDate,
      status: t.status || 'upcoming'
  });

  const mapTransportFromDB = (t) => ({
      id: t.id,
      tripId: t.trip_id,
      type: t.type,
      departureCity: t.departure_city,
      arrivalCity: t.arrival_city,
      departureDate: t.departure_date,
      departureTime: t.departure_time,
      arrivalTime: t.arrival_time,
      carriage: t.carriage,
      seat: t.seat,
      price: t.price,
      ticketNumber: t.ticket_number
  });

  const mapTransportToDB = (t) => ({
      trip_id: t.tripId,
      type: t.type,
      departure_city: t.departureCity,
      arrival_city: t.arrivalCity,
      departure_date: t.departureDate,
      departure_time: t.departureTime,
      arrival_time: t.arrivalTime,
      carriage: t.carriage,
      seat: t.seat,
      price: t.price,
      ticket_number: t.ticketNumber
  });

  const mapAccommodationFromDB = (a) => ({
      id: a.id,
      tripId: a.trip_id,
      platform: a.platform,
      name: a.name,
      address: a.address,
      checkInDate: a.check_in_date,
      checkOutDate: a.check_out_date,
      cancellable: a.cancellable,
      cancellationDate: a.cancellation_date,
      breakfastIncluded: a.breakfast_included,
      bookingLink: a.booking_link,
      price: a.price,
      paymentStatus: a.payment_status
  });

  const mapAccommodationToDB = (a) => ({
      trip_id: a.tripId,
      platform: a.platform,
      name: a.name,
      address: a.address,
      check_in_date: a.checkInDate,
      check_out_date: a.checkOutDate,
      cancellable: a.cancellable,
      cancellation_date: a.cancellationDate,
      breakfast_included: a.breakfastIncluded,
      booking_link: a.bookingLink,
      price: a.price,
      payment_status: a.paymentStatus
  });

  useEffect(() => {
    if (isSupabaseEnabled) {
      fetchFromSupabase();
    } else {
      fetchFromLocalStorage();
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseEnabled && !loading) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ trips, transports, accommodations }));
    }
  }, [trips, transports, accommodations, isSupabaseEnabled, loading]);

  const fetchFromLocalStorage = () => {
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
        setTrips([]);
    }
    setLoading(false);
  };

  const fetchFromSupabase = async () => {
    setLoading(true);
    try {
        const { data: tripsData, error: tripsError } = await supabase.from('trips').select('*');
        if (tripsError) throw tripsError;

        const { data: transportsData, error: transportsError } = await supabase.from('transports').select('*');
        if (transportsError) throw transportsError;

        const { data: accData, error: accError } = await supabase.from('accommodations').select('*');
        if (accError) throw accError;

        if (tripsData) setTrips(tripsData.map(mapTripFromDB));
        if (transportsData) setTransports(transportsData.map(mapTransportFromDB));
        if (accData) setAccommodations(accData.map(mapAccommodationFromDB));

    } catch (error) {
        console.error("Supabase fetch error:", error);
    } finally {
        setLoading(false);
    }
  };

  const addTrip = async (trip) => {
    if (isSupabaseEnabled) {
        const { data, error } = await supabase.from('trips').insert([mapTripToDB(trip)]).select();
        if (data && data[0]) {
            const newTrip = mapTripFromDB(data[0]);
            setTrips(prev => [...prev, newTrip]);
        }
        if (error) console.error("Error adding trip:", error);
    } else {
        const newTrip = { ...trip, id: Date.now().toString(), status: 'upcoming' };
        setTrips(prev => [...prev, newTrip]);
    }
  };

  const updateTrip = async (updatedTrip) => {
    if (isSupabaseEnabled) {
        const { error } = await supabase.from('trips').update(mapTripToDB(updatedTrip)).eq('id', updatedTrip.id);
        if (!error) {
            setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t));
        } else {
            console.error("Error updating trip:", error);
        }
    } else {
        setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t));
    }
  };

  const deleteTrip = async (id) => {
    if (isSupabaseEnabled) {
        const { error } = await supabase.from('trips').delete().eq('id', id);
        if (!error) {
             setTrips(prev => prev.filter(t => t.id !== id));
             setTransports(prev => prev.filter(t => t.tripId !== id));
             setAccommodations(prev => prev.filter(a => a.tripId !== id));
        } else {
             console.error("Error deleting trip:", error);
        }
    } else {
        setTrips(prev => prev.filter(t => t.id !== id));
        setTransports(prev => prev.filter(t => t.tripId !== id));
        setAccommodations(prev => prev.filter(a => a.tripId !== id));
    }
  };

  const addTransport = async (transport) => {
    if (isSupabaseEnabled) {
        const { data, error } = await supabase.from('transports').insert([mapTransportToDB(transport)]).select();
         if (data && data[0]) {
            setTransports(prev => [...prev, mapTransportFromDB(data[0])]);
        }
        if (error) console.error("Error adding transport:", error);
    } else {
        setTransports(prev => [...prev, { ...transport, id: Date.now().toString() }]);
    }
  };

  const updateTransport = async (updatedTransport) => {
    if (isSupabaseEnabled) {
         const { error } = await supabase.from('transports').update(mapTransportToDB(updatedTransport)).eq('id', updatedTransport.id);
         if (!error) {
            setTransports(prev => prev.map(t => t.id === updatedTransport.id ? updatedTransport : t));
         }
    } else {
        setTransports(prev => prev.map(t => t.id === updatedTransport.id ? updatedTransport : t));
    }
  };

  const deleteTransport = async (id) => {
    if (isSupabaseEnabled) {
        const { error } = await supabase.from('transports').delete().eq('id', id);
        if (!error) {
            setTransports(prev => prev.filter(t => t.id !== id));
        }
    } else {
        setTransports(prev => prev.filter(t => t.id !== id));
    }
  };

  const addAccommodation = async (accommodation) => {
    if (isSupabaseEnabled) {
        const { data, error } = await supabase.from('accommodations').insert([mapAccommodationToDB(accommodation)]).select();
        if (data && data[0]) {
            setAccommodations(prev => [...prev, mapAccommodationFromDB(data[0])]);
        }
        if (error) console.error("Error adding accommodation:", error);
    } else {
        setAccommodations(prev => [...prev, { ...accommodation, id: Date.now().toString() }]);
    }
  };

  const updateAccommodation = async (updatedAccommodation) => {
    if (isSupabaseEnabled) {
        const { error } = await supabase.from('accommodations').update(mapAccommodationToDB(updatedAccommodation)).eq('id', updatedAccommodation.id);
        if(!error) {
             setAccommodations(prev => prev.map(a => a.id === updatedAccommodation.id ? updatedAccommodation : a));
        }
    } else {
        setAccommodations(prev => prev.map(a => a.id === updatedAccommodation.id ? updatedAccommodation : a));
    }
  };

  const deleteAccommodation = async (id) => {
    if (isSupabaseEnabled) {
         const { error } = await supabase.from('accommodations').delete().eq('id', id);
         if (!error) {
            setAccommodations(prev => prev.filter(a => a.id !== id));
         }
    } else {
        setAccommodations(prev => prev.filter(a => a.id !== id));
    }
  };

  const getTripDetails = (tripId) => {
    if (!tripId) return null;
    const trip = trips.find(t => t.id.toString() === tripId.toString());
    const tripTransports = transports.filter(t => t.tripId.toString() === tripId.toString());
    const tripAccommodations = accommodations.filter(a => a.tripId.toString() === tripId.toString());
    return { trip, transports: tripTransports, accommodations: tripAccommodations };
  };

  return (
    <TripContext.Provider value={{
      trips,
      loading,
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
