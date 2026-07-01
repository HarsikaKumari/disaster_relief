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

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Toaster
        position='top-right'
        richColors
      />
      <Routes>
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/login'
          element={<Login />}
        />
        <Route
          path='/register'
          element={<Register />}
        />
        <Route
          path='/about'
          element={<About />}
        />
        <Route
          path='/map'
          element={<Map />}
        />
        <Route
          path='/dashboard'
          element={
            isAuthenticated ? <div>Dashboard</div> : <Navigate to='/login' />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
