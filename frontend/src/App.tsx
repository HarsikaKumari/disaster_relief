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
import { Map } from './pages/Map';
import { Dashboard } from './pages/Dashboard';
import { Resources } from './pages/Resources';
import { Profile } from './pages/Profile';

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
          path='*'
          element={<Navigate to='/' />}
        />
      </Routes>
    </Router>
  );
}

export default App;
