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
function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  // Get user role from localStorage
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userRole = user?.role || "CITIZEN";
  const isAdmin = userRole === "ADMIN";

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

        {/* ===== PROTECTED ROUTES ===== */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={
            isAuthenticated && isAdmin ? (
              <AdminDashboard />
            ) : (
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
            )
          }
        />
        <Route
          path="/resources"
          element={isAuthenticated ? <Resources /> : <Navigate to="/login" />}
        />
        <Route
          path="/map"
          element={isAuthenticated ? <Map /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/resources/add"
          element={isAuthenticated ? <AddResource /> : <Navigate to="/login" />}
        />
        <Route
          path="/volunteers"
          element={isAuthenticated ? <Volunteers /> : <Navigate to="/login" />}
        />
        <Route
          path="/volunteers/add"
          element={
            isAuthenticated ? <AddVolunteer /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/volunteers/:id"
          element={
            isAuthenticated ? <ViewVolunteer /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/emergencies"
          element={isAuthenticated ? <Emergencies /> : <Navigate to="/login" />}
        />
        <Route
          path="/emergencies/report"
          element={
            isAuthenticated ? <AddEmergency /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/emergencies/:id"
          element={
            isAuthenticated ? <EmergencyDetails /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated ? <Notifications /> : <Navigate to="/login" />
          }
        />

        {/* ===== CHAT ROUTES ===== */}
        <Route
          path="/chat"
          element={isAuthenticated ? <ChatList /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat/:roomId"
          element={isAuthenticated ? <ChatWindow /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={isAuthenticated ? <Settings /> : <Navigate to="/login" />}
        />
        {/* ===== 404 REDIRECT ===== */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
