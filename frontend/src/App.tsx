import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Toaster } from "sonner";
import { About } from "./pages/About";
import { AddEmergency } from "./pages/AddEmergency";
import { AddResource } from "./pages/AddResource";
import { AddVolunteer } from "./pages/AddVolunteers";
import { ChatList } from "./pages/chat/ChatList";
import { ChatWindow } from "./pages/chat/ChatWindow";
import { Contact } from "./pages/Contact";
import { Dashboard } from "./pages/Dashboard";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { Emergencies } from "./pages/Emergencies";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Map } from "./pages/Map";
import { Notifications } from "./pages/Notifications";
import { Profile } from "./pages/Profile";
import { Register } from "./pages/Register";
import { Resources } from "./pages/Resources";
import { EmergencyDetails } from "./pages/ViewEmergencies";
import { ViewVolunteer } from "./pages/ViewVolunteer";
import { Volunteers } from "./pages/Volunteers";
import { Settings } from "./pages/Settings";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ViewDeployments } from './pages/ViewDeployments';
function App() {
  // Get user role from localStorage

  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <Map />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources/add"
          element={
            <ProtectedRoute>
              <AddResource />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteers"
          element={
            <ProtectedRoute>
              <Volunteers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteers/add"
          element={
            <ProtectedRoute>
              <AddVolunteer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteers/:id"
          element={
            <ProtectedRoute>
              <ViewVolunteer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/emergencies"
          element={
            <ProtectedRoute>
              <Emergencies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/emergencies/report"
          element={
            <ProtectedRoute>
              <AddEmergency />
            </ProtectedRoute>
          }
        />
        <Route
          path="/emergencies/:id"
          element={
            <ProtectedRoute>
              <EmergencyDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:roomId"
          element={
            <ProtectedRoute>
              <ChatWindow />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources/deploy"
          element={
            <ProtectedRoute>
              <ViewDeployments />
            </ProtectedRoute>
          }
        />
         

        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Navigate to="/" />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
