import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { CreateTrip } from './pages/CreateTrip';
import { EditTripList } from './pages/EditTripList';
import { TripDetails } from './pages/TripDetails';
import { EditTripDetails } from './pages/EditTripDetails';
import { AddTransport } from './pages/AddTransport';
import { EditTransport } from './pages/EditTransport';
import { AddAccommodation } from './pages/AddAccommodation';
import { EditAccommodation } from './pages/EditAccommodation';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/edit-trips" element={<EditTripList />} />
        <Route path="/trip/:id" element={<TripDetails />} />
        <Route path="/trip/:id/edit" element={<EditTripDetails />} />
        <Route path="/trip/:id/add-transport" element={<AddTransport />} />
        <Route path="/trip/:id/add-accommodation" element={<AddAccommodation />} />
        <Route path="/trip/:id/transport/:itemId/edit" element={<EditTransport />} />
        <Route path="/trip/:id/accommodation/:itemId/edit" element={<EditAccommodation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
