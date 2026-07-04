/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Droplet,
  Eye,
  Filter,
  Flame,
  MapPin,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Users,
  Wind,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

interface EmergencyStats {
  total: number;
  active: number;
  resolved: number;
  pending: number;
}

// ============================================
// EMERGENCY CARD
// ============================================

const EmergencyCard = ({
  emergency,
}: {
  emergency: Emergency;
  onRefresh: () => void;
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-error text-white";
      case "HIGH":
        return "bg-error/80 text-white";
      case "MEDIUM":
        return "bg-warning text-white";
      case "LOW":
        return "bg-success text-white";
      default:
        return "bg-primary text-white";
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-warning/20 text-warning border-warning/30";
      case "VERIFIED":
        return "bg-info/20 text-info border-info/30";
      case "ASSIGNED":
        return "bg-primary/20 text-primary border-primary/30";
      case "IN_PROGRESS":
        return "bg-success/20 text-success border-success/30";
      case "RESOLVED":
        return "bg-success/20 text-success border-success/30";
      case "CANCELLED":
        return "bg-muted/20 text-text-secondary border-muted/30";
      default:
        return "bg-muted/20 text-text-secondary border-muted/30";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "VERIFIED":
        return "Verified";
      case "ASSIGNED":
        return "Assigned";
      case "IN_PROGRESS":
        return "In Progress";
      case "RESOLVED":
        return "Resolved";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "FLOOD":
        return <Droplet className="w-4 h-4" />;
      case "EARTHQUAKE":
        return <Zap className="w-4 h-4" />;
      case "FIRE":
        return <Flame className="w-4 h-4" />;
      case "CYCLONE":
        return <Wind className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "FLOOD":
        return "Flood";
      case "EARTHQUAKE":
        return "Earthquake";
      case "FIRE":
        return "Fire";
      case "CYCLONE":
        return "Cyclone";
      case "LANDSLIDE":
        return "Landslide";
      case "PANDEMIC":
        return "Pandemic";
      case "ACCIDENT":
        return "Accident";
      default:
        return "Other";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`w-11 h-11 rounded-xl ${getSeverityColor(emergency.severity)} flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/10`}
          >
            {getTypeIcon(emergency.type)}
          </div>
          <div>
            <h4 className="font-semibold text-text-primary">
              {emergency.title}
            </h4>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge
                className={`text-[10px] border ${getStatusColor(emergency.status)}`}
              >
                {getStatusLabel(emergency.status)}
              </Badge>
              <Badge
                className={`text-[10px] border ${getSeverityColor(emergency.severity)}`}
              >
                {getSeverityLabel(emergency.severity)}
              </Badge>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                {getTypeLabel(emergency.type)}
              </Badge>
            </div>
          </div>
        </div>
        <button className="p-1.5 rounded-xl hover:bg-sand-light/50 transition-colors">
          <MoreHorizontal className="w-4 h-4 text-text-tertiary" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/20">
        <div>
          <p className="text-xs text-text-tertiary">Location</p>
          <p className="text-sm text-text-secondary truncate flex items-center gap-1">
            <MapPin className="w-3 h-3 text-text-tertiary" />
            {emergency.location}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-tertiary">Victims</p>
          <p className="text-sm font-semibold text-text-primary flex items-center gap-1">
            <Users className="w-3 h-3 text-text-tertiary" />
            {emergency.victimCount}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-tertiary">Reported By</p>
          <p className="text-sm text-text-secondary">
            {emergency.reportedBy?.name || "Unknown"}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-tertiary">Reported At</p>
          <p className="text-sm text-text-secondary flex items-center gap-1">
            <Clock className="w-3 h-3 text-text-tertiary" />
            {new Date(emergency.createdAt).toLocaleString()}
          </p>
        </div>
        {emergency.assignedTo && (
          <div className="col-span-2">
            <p className="text-xs text-text-tertiary">Assigned To</p>
            <p className="text-sm text-text-secondary">
              {emergency.assignedTo.name}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-white/20">
        <Link to={`/emergencies/${emergency.id}`} className="flex-1">
          <button className="w-full bg-primary/10 hover:bg-primary/20 text-primary rounded-xl py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            View Details
          </button>
        </Link>
        <button className="flex-1 bg-primary hover:bg-primary-dark text-white rounded-xl py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" />
          Update Status
        </button>
      </div>
    </motion.div>
  );
};

// ============================================
// STAT CARD
// ============================================

const StatCard = ({
  label,
  value,
  icon,
  color,
  isLoading,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  isLoading?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-primary/5 border border-white/30"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-text-tertiary font-medium uppercase tracking-wider">
          {label}
        </p>
        {isLoading ? (
          <div className="h-8 w-12 bg-sand-light/50 rounded-lg animate-pulse mt-0.5" />
        ) : (
          <p className="text-2xl font-bold text-text-primary mt-0.5">{value}</p>
        )}
      </div>
      <div
        className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}
      >
        {icon}
      </div>
    </div>
  </motion.div>
);

// ============================================
// MAIN EMERGENCIES PAGE
// ============================================

export const Emergencies = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [stats, setStats] = useState<EmergencyStats>({
    total: 0,
    active: 0,
    resolved: 0,
    pending: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // ========== FETCH EMERGENCIES ==========
  const fetchEmergencies = async () => {
    setLoading(true);
    try {
      const [emergenciesRes, statsRes] = await Promise.all([
        api.get("/emergencies"),
        api.get("/emergencies/stats"),
      ]);

      if (emergenciesRes.data.success) {
        setEmergencies(emergenciesRes.data.data);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (error: any) {
      console.error("Emergencies fetch error:", error);
      toast.error("Failed to load emergencies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEmergencies();
  }, []);

  // ========== FILTERS ==========
  const filteredEmergencies = emergencies.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || e.type === filterType;
    const matchesSeverity =
      filterSeverity === "all" || e.severity === filterSeverity;
    const matchesStatus = filterStatus === "all" || e.status === filterStatus;
    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex">
      <Sidebar
        active="Emergencies"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 min-w-0 overflow-y-auto h-screen">
        {/* ===== NAVBAR ===== */}
        <Navbar
          title="Emergencies"
          subtitle="Manage all emergencies"
          onMenuClick={() => setMobileOpen(true)}
        />

        {/* ===== CONTENT ===== */}
        <div className="p-3 md:p-4 space-y-4 pb-8">
          {/* ===== STATS ===== */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              label="Total"
              value={stats.total}
              icon={<AlertTriangle className="w-4 h-4 text-white" />}
              color="bg-gradient-to-br from-primary to-primary-dark text-white"
              isLoading={loading}
            />
            <StatCard
              label="Active"
              value={stats.active}
              icon={<Activity className="w-4 h-4 text-white" />}
              color="bg-gradient-to-br from-error to-error-dark text-white"
              isLoading={loading}
            />
            <StatCard
              label="Resolved"
              value={stats.resolved}
              icon={<CheckCircle className="w-4 h-4 text-white" />}
              color="bg-gradient-to-br from-success to-success-dark text-white"
              isLoading={loading}
            />
            <StatCard
              label="Pending"
              value={stats.pending}
              icon={<Clock className="w-4 h-4 text-white" />}
              color="bg-gradient-to-br from-warning to-warning-dark text-white"
              isLoading={loading}
            />
          </div>

          {/* ===== ACTIONS BAR ===== */}
          <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-primary/5 border border-white/30">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search - Mobile */}
              <div className="flex-1 min-w-[150px] sm:hidden flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/30">
                <Search className="w-3.5 h-3.5 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent p-0 h-7 text-sm w-full focus:outline-none focus:ring-0 focus:border-transparent placeholder:text-text-tertiary/60"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 text-sm text-text-secondary hover:bg-white/70 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Refresh */}
              <button
                onClick={fetchEmergencies}
                disabled={loading}
                className="p-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 text-text-secondary hover:bg-white/70 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
              </button>

              {/* Report Emergency Button */}
              <Link to="/emergencies/report" className="ml-auto">
                <Button className="bg-primary cursor-pointer hover:shadow-lg hover:shadow-error/30 text-white rounded-xl shadow-lg shadow-error/20">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Report Emergency
                </Button>
              </Link>
            </div>

            {/* Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-white/20">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="h-9 px-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="all">All Types</option>
                      <option value="FLOOD">🌊 Flood</option>
                      <option value="EARTHQUAKE">🏔️ Earthquake</option>
                      <option value="FIRE">🔥 Fire</option>
                      <option value="CYCLONE">🌀 Cyclone</option>
                      <option value="LANDSLIDE">⛰️ Landslide</option>
                      <option value="PANDEMIC">🦠 Pandemic</option>
                      <option value="ACCIDENT">🚨 Accident</option>
                    </select>

                    <select
                      value={filterSeverity}
                      onChange={(e) => setFilterSeverity(e.target.value)}
                      className="h-9 px-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="all">All Severities</option>
                      <option value="CRITICAL">🔴 Critical</option>
                      <option value="HIGH">🟠 High</option>
                      <option value="MEDIUM">🟡 Medium</option>
                      <option value="LOW">🟢 Low</option>
                    </select>

                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="h-9 px-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="all">All Status</option>
                      <option value="PENDING">⏳ Pending</option>
                      <option value="VERIFIED">✅ Verified</option>
                      <option value="ASSIGNED">📋 Assigned</option>
                      <option value="IN_PROGRESS">🔄 In Progress</option>
                      <option value="RESOLVED">✔️ Resolved</option>
                      <option value="CANCELLED">❌ Cancelled</option>
                    </select>

                    <button
                      onClick={() => {
                        setFilterType("all");
                        setFilterSeverity("all");
                        setFilterStatus("all");
                        setSearchQuery("");
                      }}
                      className="h-9 px-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-text-secondary hover:bg-white/70 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== EMERGENCIES GRID ===== */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white/50 backdrop-blur-md rounded-2xl p-5 border border-white/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-sand-light/50 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-5 w-32 bg-sand-light/50 rounded-lg animate-pulse" />
                      <div className="h-4 w-20 bg-sand-light/50 rounded-lg animate-pulse mt-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/20">
                    <div className="h-8 w-full bg-sand-light/50 rounded-lg animate-pulse" />
                    <div className="h-8 w-full bg-sand-light/50 rounded-lg animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEmergencies.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-md rounded-2xl p-12 text-center shadow-lg shadow-primary/5 border border-white/30">
              <AlertTriangle className="w-16 h-16 text-text-tertiary/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary">
                No Emergencies Found
              </h3>
              <p className="text-sm text-text-tertiary mt-1">
                Try adjusting your filters or report a new emergency.
              </p>
              <Link to="/emergencies/report">
                <Button className="mt-4 bg-gradient-to-r from-error to-error-dark text-white rounded-xl shadow-lg shadow-error/20">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Report Emergency
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEmergencies.map((emergency) => (
                <EmergencyCard
                  key={emergency.id}
                  emergency={emergency}
                  onRefresh={fetchEmergencies}
                />
              ))}
            </div>
          )}

          {/* ===== FOOTER ===== */}
          <div className="text-center text-[10px] text-text-tertiary/40 py-3">
            © 2026 Disaster Relief Coordination Platform
          </div>
        </div>
      </div>
    </div>
  );
};
