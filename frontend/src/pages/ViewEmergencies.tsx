/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Droplet,
  Edit,
  Flame,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Send,
  Shield,
  Trash2,
  User,
  Users,
  Wind,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Navbar } from "../components/layouts/Navbar";
import { Sidebar } from "../components/layouts/sidebar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import api from "../lib/api";

// ============================================
// TYPES
// ============================================

interface Emergency {
  id: string;
  title: string;
  type:
    | "FLOOD"
    | "EARTHQUAKE"
    | "FIRE"
    | "CYCLONE"
    | "LANDSLIDE"
    | "PANDEMIC"
    | "ACCIDENT"
    | "OTHER";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status:
    | "PENDING"
    | "VERIFIED"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CANCELLED";
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  victimCount: number;
  victimName?: string;
  victimPhone?: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  reportedBy: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
}

interface TimelineItem {
  id: string;
  action: string;
  description: string;
  performedBy: {
    name: string;
  };
  createdAt: string;
}

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string;
}

// ============================================
// STATUS OPTIONS
// ============================================

const STATUS_OPTIONS = [
  {
    value: "PENDING",
    label: "⏳ Pending",
    color: "bg-warning/20 text-warning",
  },
  { value: "VERIFIED", label: "✅ Verified", color: "bg-info/20 text-info" },
  {
    value: "ASSIGNED",
    label: "📋 Assigned",
    color: "bg-primary/20 text-primary",
  },
  {
    value: "IN_PROGRESS",
    label: "🔄 In Progress",
    color: "bg-success/20 text-success",
  },
  {
    value: "RESOLVED",
    label: "✔️ Resolved",
    color: "bg-success/20 text-success",
  },
  {
    value: "CANCELLED",
    label: "❌ Cancelled",
    color: "bg-error/20 text-error",
  },
];

// ============================================
// MAIN COMPONENT
// ============================================

export const EmergencyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [emergency, setEmergency] = useState<Emergency | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [activeTab, setActiveTab] = useState<
    "details" | "timeline" | "updates"
  >("details");
  const [newStatus, setNewStatus] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  
  // ========== USER ROLE STATE ==========
  const [userRole, setUserRole] = useState<string>("");
  
  // ========== ASSIGNMENT STATE ==========
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState("");
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);

  // ========== CHAT STATE ==========
  const [joiningChat, setJoiningChat] = useState(false);

  // ========== CHECK IF USER IS ADMIN ==========
  const isAdmin = userRole === "ADMIN";

  // ========== GET USER ROLE ==========
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUserRole(user?.role || "");
      } catch (e) {
        console.error("Failed to parse user:", e);
      }
    }
  }, []);

  // ========== FETCH EMERGENCY DETAILS ==========
  const fetchEmergencyDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await api.get(`/emergencies/${id}`);
      if (response.data.success) {
        setEmergency(response.data.data);
        setNewStatus(response.data.data.status);
        setTimeline([
          {
            id: "1",
            action: "Emergency Reported",
            description: `Reported by ${response.data.data.reportedBy?.name || "Unknown"}`,
            performedBy: {
              name: response.data.data.reportedBy?.name || "System",
            },
            createdAt: response.data.data.createdAt,
          },
          {
            id: "2",
            action: "Status Updated",
            description: `Status changed to ${response.data.data.status}`,
            performedBy: { name: "System" },
            createdAt: response.data.data.updatedAt,
          },
        ]);
      } else {
        toast.error("Failed to load emergency details");
      }
    } catch (error: any) {
      console.error("Fetch emergency error:", error);
      toast.error(
        error.response?.data?.message || "Failed to load emergency details",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEmergencyDetails();
  }, [id]);

  // ========== FETCH AVAILABLE VOLUNTEERS ==========
  const fetchAvailableVolunteers = async () => {
    setLoadingVolunteers(true);
    try {
      const response = await api.get("/volunteers?availability=AVAILABLE");
      if (response.data.success) {
        setVolunteers(response.data.data);
      }
    } catch (error: any) {
      toast.error("Failed to load volunteers");
      console.error("Failed to load volunteers:", error);
    } finally {
      setLoadingVolunteers(false);
    }
  };

  // ========== ASSIGN VOLUNTEER ==========
  const handleAssignVolunteer = async () => {
    if (!selectedVolunteerId) {
      toast.error("Please select a volunteer");
      return;
    }

    setAssigning(true);
    try {
      const response = await api.post(`/emergencies/${emergency?.id}/assign`, {
        assignedToId: selectedVolunteerId,
      });

      if (response.data.success) {
        toast.success("Volunteer assigned successfully!");
        setShowAssignModal(false);
        setSelectedVolunteerId("");
        fetchEmergencyDetails();
      } else {
        toast.error(response.data.message || "Failed to assign volunteer");
      }
    } catch (error: any) {
      console.error("Assign error:", error);
      toast.error(error.response?.data?.message || "Failed to assign volunteer");
    } finally {
      setAssigning(false);
    }
  };

  // ========== UPDATE STATUS ==========
  const handleStatusUpdate = async () => {
    if (!emergency || !newStatus || newStatus === emergency.status) {
      toast.info("No change in status");
      return;
    }

    setUpdating(true);
    try {
      const response = await api.put(`/emergencies/${emergency.id}`, {
        status: newStatus,
      });

      if (response.data.success) {
        setEmergency(response.data.data);
        toast.success(`Status updated to ${newStatus.replace("_", " ")}`);
        fetchEmergencyDetails();
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error: any) {
      console.error("Status update error:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  // ========== ADD UPDATE ==========
  const handleAddUpdate = async () => {
    if (!updateMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setUpdating(true);
    try {
      toast.success("Update added successfully");
      setUpdateMessage("");
      fetchEmergencyDetails();
    } catch(error: any) {
      console.log(error)
      toast.error("Failed to add update");
    } finally {
      setUpdating(false);
    }
  };

  // ========== OPEN EMERGENCY CHAT ==========
const openEmergencyChat = async () => {
  if (!emergency) return;

  setJoiningChat(true);
  try {
    const response = await api.post('/chat/emergency-chat', {
      emergencyId: emergency.id,
    });

    if (response.data.success) {
      const roomId = response.data.data.id;
      console.log('Chat room ID:', roomId); // ✅ Debug
      navigate(`/chat/${roomId}`);
    } else {
      toast.error('Failed to open chat');
    }
  } catch (error: any) {
    console.error('Chat error:', error);
    toast.error(error.response?.data?.message || 'Failed to open chat');
  } finally {
    setJoiningChat(false);
  }
};

  // ========== HELPERS ==========
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-error text-white border-error";
      case "HIGH":
        return "bg-error/80 text-white border-error/80";
      case "MEDIUM":
        return "bg-warning text-white border-warning";
      case "LOW":
        return "bg-success text-white border-success";
      default:
        return "bg-primary text-white";
    }
  };

  const getStatusLabel = (status: string) => {
    const found = STATUS_OPTIONS.find((s) => s.value === status);
    return found?.label || status;
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "🔴 Critical";
      case "HIGH":
        return "🟠 High";
      case "MEDIUM":
        return "🟡 Medium";
      case "LOW":
        return "🟢 Low";
      default:
        return severity;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "FLOOD":
        return <Droplet className="w-5 h-5" />;
      case "EARTHQUAKE":
        return <Zap className="w-5 h-5" />;
      case "FIRE":
        return <Flame className="w-5 h-5" />;
      case "CYCLONE":
        return <Wind className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-text-secondary mt-4">
            Loading emergency details...
          </p>
        </div>
      </div>
    );
  }

  if (!emergency) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-text-tertiary/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary">
            Emergency Not Found
          </h2>
          <p className="text-text-secondary mt-2">
            The emergency you're looking for doesn't exist.
          </p>
          <Link to="/emergencies">
            <Button className="mt-4 bg-primary text-white">
              Back to Emergencies
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex">
      <Sidebar
        active="Emergencies"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 min-w-0 overflow-y-auto h-screen">
        <Navbar
          title="Emergency Details"
          subtitle={`ID: ${emergency.id}`}
          onMenuClick={() => setMobileOpen(true)}
        />

        {/* Content */}
        <div className="p-3 md:p-4 pb-8 space-y-4">
          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-lg shadow-primary/5 border border-white/30"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl ${getSeverityColor(emergency.severity)} flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/10`}
                >
                  {getTypeIcon(emergency.type)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary">
                    {emergency.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <Badge
                      className={`text-[11px] border ${getSeverityColor(emergency.severity)}`}
                    >
                      {getSeverityLabel(emergency.severity)}
                    </Badge>
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[11px]">
                      {emergency.type.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {/* ✅ Assign Button - Sirf Admin ko dikhega */}
                {isAdmin && emergency.status !== "RESOLVED" && emergency.status !== "CANCELLED" && (
                  <Button
                    onClick={() => {
                      setShowAssignModal(true);
                      fetchAvailableVolunteers();
                    }}
                    className="bg-success hover:bg-success-dark text-white rounded-xl text-sm"
                  >
                    <Users className="w-4 h-4 mr-1.5" />
                    Assign Volunteer
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="border-white/30 text-text-secondary hover:bg-white/50 rounded-xl text-sm"
                >
                  <Edit className="w-4 h-4 mr-1.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="border-error/20 text-error hover:bg-error/10 hover:border-error rounded-xl text-sm"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Status Update Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-lg shadow-primary/5 border border-white/30"
          >
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-text-primary">
                  Current Status:
                </span>
                <Badge className="text-[12px] border bg-primary/10 text-primary border-primary/20">
                  {getStatusLabel(emergency.status)}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 ml-auto">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="h-10 px-3 bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-sm text-text-primary"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={updating || newStatus === emergency.status}
                  className="bg-primary hover:bg-primary-dark text-white rounded-xl"
                >
                  {updating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Update Status
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="bg-white/50 backdrop-blur-md rounded-2xl shadow-lg shadow-primary/5 border border-white/30 overflow-hidden">
            <div className="flex border-b border-white/20">
              {["details", "timeline", "updates"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? "text-primary border-b-2 border-primary bg-primary/5"
                      : "text-text-secondary hover:text-text-primary hover:bg-sand-light/30"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-5">
              {/* Details Tab */}
              {activeTab === "details" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-1.5">
                      Description
                    </h4>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {emergency.description}
                    </p>
                  </div>

                  {/* Grid Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/20">
                    <div>
                      <p className="text-xs text-text-tertiary uppercase tracking-wider">
                        Location
                      </p>
                      <p className="text-sm text-text-primary mt-0.5 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-text-tertiary" />
                        {emergency.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-tertiary uppercase tracking-wider">
                        Victims
                      </p>
                      <p className="text-sm text-text-primary mt-0.5 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-text-tertiary" />
                        {emergency.victimCount} people affected
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-tertiary uppercase tracking-wider">
                        Reported By
                      </p>
                      <p className="text-sm text-text-primary mt-0.5 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-text-tertiary" />
                        {emergency.reportedBy?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-text-tertiary mt-0.5 flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-text-tertiary" />
                        {emergency.reportedBy?.phone || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-tertiary uppercase tracking-wider">
                        Assigned To
                      </p>
                      <p className="text-sm text-text-primary mt-0.5 flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-text-tertiary" />
                        {emergency.assignedTo?.name || "Not Assigned"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Timeline Tab */}
              {activeTab === "timeline" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    {timeline.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex gap-4 pb-6 last:pb-0 relative"
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-3 h-3 rounded-full ${index === 0 ? "bg-error" : index === timeline.length - 1 ? "bg-success" : "bg-primary"}`}
                          />
                          {index < timeline.length - 1 && (
                            <div className="w-0.5 flex-1 bg-white/30 mt-1" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-text-primary">
                              {item.action}
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary mt-0.5">
                            {item.description}
                          </p>
                          <p className="text-xs text-text-tertiary mt-0.5 flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {new Date(item.createdAt).toLocaleString()} • by{" "}
                            {item.performedBy.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Updates Tab */}
              {activeTab === "updates" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={updateMessage}
                      onChange={(e) => setUpdateMessage(e.target.value)}
                      placeholder="Add an update..."
                      className="flex-1 bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-2 text-sm placeholder:text-text-tertiary/50"
                    />
                    <Button
                      onClick={handleAddUpdate}
                      disabled={updating || !updateMessage.trim()}
                      className="bg-primary hover:bg-primary-dark text-white rounded-xl px-4"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-text-tertiary text-center">
                    Updates will appear here in real-time
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* ✅ CHAT BUTTON - Auto-create Emergency Chat */}
          <Button
            onClick={openEmergencyChat}
            disabled={joiningChat}
            className="w-full bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 text-white rounded-xl shadow-lg shadow-primary/20 h-11 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {joiningChat ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Opening Chat...
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4 mr-2" />
                Open Emergency Chat
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ============================================
      ASSIGN VOLUNTEER MODAL
      ============================================ */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">
                    Assign Volunteer
                  </h3>
                  <p className="text-xs text-text-tertiary">
                    Select a volunteer to assign
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedVolunteerId("");
                }}
                className="p-1.5 rounded-xl hover:bg-sand-light/50 transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            <div className="space-y-4">
              {loadingVolunteers ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : volunteers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-text-tertiary/30 mx-auto mb-2" />
                  <p className="text-text-secondary">No available volunteers</p>
                  <p className="text-xs text-text-tertiary">
                    All volunteers are currently busy
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary">
                      Select Volunteer
                    </label>
                    <select
                      value={selectedVolunteerId}
                      onChange={(e) => setSelectedVolunteerId(e.target.value)}
                      className="w-full h-11 px-4 bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-sm appearance-none cursor-pointer hover:bg-white/80 transition-colors"
                    >
                      <option value="">Choose a volunteer...</option>
                      {volunteers.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} {v.skills?.length > 0 ? `(${v.skills.join(", ")})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedVolunteerId && (
                    <div className="bg-sand-light/30 rounded-xl p-3 border border-white/20">
                      <p className="text-xs text-text-tertiary">Selected Volunteer</p>
                      <p className="text-sm font-medium text-text-primary">
                        {volunteers.find(v => v.id === selectedVolunteerId)?.name}
                      </p>
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedVolunteerId("");
                  }}
                  className="flex-1 border-white/30 text-text-secondary hover:bg-white/50 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignVolunteer}
                  disabled={assigning || !selectedVolunteerId || loadingVolunteers}
                  className="flex-1 bg-success hover:bg-success-dark text-white rounded-xl"
                >
                  {assigning ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Assign
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};