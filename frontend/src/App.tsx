import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Toaster } from 'sonner';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { About } from './pages/About';
import{Contact} from './pages/Contact';
import { Map } from './pages/Map';
import { Dashboard } from './pages/Dashboard';
import { Resources } from './pages/Resources';
import { Profile } from './pages/Profile';
import { AddResource } from './pages/AddResource';
import { ReportEmergency } from './pages/Emergencies';
import { EmergencyDetails } from './pages/ViewEmergencies';
import { Notifications } from './pages/Notifications';
import { Volunteers } from './pages/Volunteers';
import { AddVolunteer } from './pages/AddVolunteers';
import { ViewVolunteer } from './pages/ViewVolunteer';
function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Toaster
        position='top-right'
        richColors
      />
      <Routes>
        {/* Public Routes */}
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/about'
          element={<About />}
        />
        <Route
          path='/contact'
          element={<Contact />}
        />
        <Route
          path='/login'
          element={<Login />}
        />
        <Route
          path='/register'
          element={<Register />}
        />

        {/* Protected Routes */}
        <Route
          path='/dashboard'
          element={isAuthenticated ? <Dashboard /> : <Navigate to='/login' />}
        />
        <Route
          path='/resources'
          element={isAuthenticated ? <Resources /> : <Navigate to='/login' />}
        />
        <Route
          path='/map'
          element={isAuthenticated ? <Map /> : <Navigate to='/login' />}
        />
        <Route
          path='/profile'
          element={isAuthenticated ? <Profile /> : <Navigate to='/login' />}
        />
        <Route
          path='/resources/add'
          element={isAuthenticated ? <AddResource /> : <Navigate to='/login' />}
        />
        <Route
          path='/volunteers/add'
          element={
            isAuthenticated ? <AddVolunteer /> : <Navigate to='/login' />
          }
        />
        <Route
          path='/volunteers/:id'
          element={
            isAuthenticated ? <ViewVolunteer /> : <Navigate to='/login' />
          }
        />
        <Route
          path='/emergencies'
          element={
            isAuthenticated ? <ReportEmergency /> : <Navigate to='/login' />
          }
        />
        <Route
          path='/emergencies/:id'
          element={
            isAuthenticated ? <EmergencyDetails /> : <Navigate to='/login' />
          }
        />
        <Route
          path='/notifications'
          element={
            isAuthenticated ? <Notifications /> : <Navigate to='/login' />
          }
        />
        <Route
          path='/volunteers'
          element={isAuthenticated ? <Volunteers /> : <Navigate to='/login' />}
        />
        {/* Redirect unknown routes to home */}
        <Route
          path='*'
          element={<Navigate to='/' />}
        />
      </Routes>
    </Router>
  );
}

export default App;
