/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  ChevronDown,
  ChevronUp,
  Filter,
  MapPin,
  Menu,
  RefreshCw,
  Search,
  Truck,
  Users,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Sidebar } from "../components/layouts/sidebar";
import { Badge } from "../components/ui/badge";
import api from "../lib/api";
import { Navbar } from "../components/layouts/Navbar";

// ============================================
// TYPES
// ============================================

interface EmergencyMarker {
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
  location: string;
  latitude: number;
  longitude: number;
  victimCount: number;
  createdAt: string;
  reportedBy: {
    name: string;
  };
  assignedTo?: {
    name: string;
  };
}

interface ResourceMarker {
  id: string;
  name: string;
  type:
    | "FOOD"
    | "WATER"
    | "MEDICAL"
    | "SHELTER"
    | "TRANSPORT"
    | "RESCUE_TEAM"
    | "COMMUNICATION"
    | "SANITATION"
    | "CLOTHING"
    | "ELECTRICITY"
    | "OTHER";
  status: "AVAILABLE" | "IN_TRANSIT" | "DEPLOYED" | "DEPLETED" | "RESERVED";
  location: string;
  latitude: number;
  longitude: number;
  availableQty: number;
  quantity: number;
  provider: {
    name: string;
  };
  unit?: string;
}


// ============================================
// MAP COMPONENT
// ============================================

export const Map = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [emergencies, setEmergencies] = useState<EmergencyMarker[]>([]);
  const [resources, setResources] = useState<ResourceMarker[]>([]);

  const [selectedEmergency, setSelectedEmergency] =
    useState<EmergencyMarker | null>(null);
 
  const [showResources, setShowResources] = useState(true);
  const [showEmergencies, setShowEmergencies] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [zoom, setZoom] = useState(12);
  const [showFilters, setShowFilters] = useState(false);

  // ========== FETCH MAP DATA ==========
  const fetchMapData = async () => {
    setLoading(true);
    try {
      const [emergenciesRes, resourcesRes] = await Promise.all([
        api.get("/map/emergencies"),
        api.get("/map/resources"),
        api.get("/map/stats"),
      ]);

      if (emergenciesRes.data.success) {
        setEmergencies(emergenciesRes.data.data);
      }
      if (resourcesRes.data.success) {
        setResources(resourcesRes.data.data);
      }
      
    } catch (error: any) {
      console.error("Map data fetch error:", error);
      toast.error("Failed to load map data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMapData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchMapData, 30000);
    return () => clearInterval(interval);
  }, []);

  // ========== FILTERS ==========
  const filteredEmergencies = emergencies.filter((e) => {
    const matchType = filterType === "all" || e.type === filterType;
    const matchSeverity =
      filterSeverity === "all" || e.severity === filterSeverity;
    return matchType && matchSeverity;
  });

  // ========== HELPERS ==========
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "FLOOD":
        return "🌊";
      case "EARTHQUAKE":
        return "🏔️";
      case "FIRE":
        return "🔥";
      case "CYCLONE":
        return "🌀";
      case "LANDSLIDE":
        return "⛰️";
      case "PANDEMIC":
        return "🦠";
      case "ACCIDENT":
        return "🚨";
      default:
        return "📍";
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
      default:
        return status;
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "SHELTER":
        return "🏠";
      case "FOOD":
        return "🍲";
      case "MEDICAL":
        return "🏥";
      case "WATER":
        return "💧";
      case "RESCUE_TEAM":
        return "🚑";
      case "TRANSPORT":
        return "🚛";
      default:
        return "📦";
    }
  };

  const getResourceStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-success/20 border-success text-success";
      case "IN_TRANSIT":
        return "bg-info/20 border-info text-info";
      case "DEPLOYED":
        return "bg-primary/20 border-primary text-primary";
      case "DEPLETED":
        return "bg-error/20 border-error text-error";
      case "RESERVED":
        return "bg-warning/20 border-warning text-warning";
      default:
        return "bg-muted/20 border-muted text-text-secondary";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex">
      {/* ===== SIDEBAR ===== */}
      <Sidebar
        active="Live Map"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* ===== MAIN ===== */}
      <div className="flex-1 min-w-0 overflow-y-auto h-screen">
        {/* ===== NAVBAR ===== */}
         <Navbar 
          title="Map" 
          subtitle={`Live view of emergencies and resources`}
          onMenuClick={() => setMobileOpen(true)}
        />
        {/* ===== MAP CONTROLS ===== */}
        <div className="px-3 md:px-4 flex flex-wrap items-center gap-2 mb-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="h-9 px-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-text-secondary hover:bg-white/70 transition-colors flex items-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
            {showFilters ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={() => setShowEmergencies(!showEmergencies)}
            className={`h-9 px-3 rounded-xl text-sm font-medium transition-colors ${
              showEmergencies
                ? "bg-error/10 text-error border border-error/20"
                : "bg-white/50 text-text-secondary border border-white/30"
            }`}
          >
            🚨 Emergencies ({filteredEmergencies.length})
          </button>

          <button
            onClick={() => setShowResources(!showResources)}
            className={`h-9 px-3 rounded-xl text-sm font-medium transition-colors ${
              showResources
                ? "bg-success/10 text-success border border-success/20"
                : "bg-white/50 text-text-secondary border border-white/30"
            }`}
          >
            📦 Resources ({resources.length})
          </button>

          <button
            onClick={fetchMapData}
            disabled={loading}
            className="h-9 px-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-60 shadow-primary"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <div className="ml-auto flex items-center gap-1 text-xs text-text-tertiary">
            <span>🟢 Live</span>
          </div>
        </div>

        {/* ===== FILTERS ===== */}
        {showFilters && (
          <div className="px-3 md:px-4 mb-3">
            <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-primary/5 border border-white/30 flex flex-wrap gap-3">
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

              <button
                onClick={() => {
                  setFilterType("all");
                  setFilterSeverity("all");
                }}
                className="h-9 px-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-text-secondary hover:bg-white/70 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* ===== MAP AREA ===== */}
        <div className="px-3 md:px-4 pb-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 via-sand-light to-secondary/20 border border-white/30 shadow-lg shadow-primary/5 h-[calc(100vh-420px)]">
            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-30">
                <div className="text-center">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-text-secondary text-sm mt-3">
                    Loading map data...
                  </p>
                </div>
              </div>
            )}

            {/* Grid Lines */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(20)].map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute w-full border-t border-primary/20"
                  style={{ top: `${i * 5}%` }}
                />
              ))}
              {[...Array(20)].map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute h-full border-l border-primary/20"
                  style={{ left: `${i * 5}%` }}
                />
              ))}
            </div>

            {/* Emergency Markers */}
            {showEmergencies &&
              filteredEmergencies.map((emergency) => (
                <motion.button
                  key={emergency.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setSelectedEmergency(emergency)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                  style={{
                    left: `${((emergency.longitude - 77.0) / 0.5) * 100}%`,
                    top: `${((emergency.latitude - 28.5) / 0.4) * 100}%`,
                  }}
                >
                  <div
                    className={`w-8 h-8 rounded-full ${getSeverityColor(emergency.severity)} flex items-center justify-center shadow-lg shadow-primary/20 animate-pulse-slow`}
                  >
                    <span className="text-sm">
                      {getTypeIcon(emergency.type)}
                    </span>
                  </div>
                  {/* Tooltip - Show Location on Hover */}
                  <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-text-primary opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-lg border border-white/30 z-20 pointer-events-none min-w-[140px]">
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-text-primary text-xs">
                        {emergency.title}
                      </span>
                      <span className="text-[8px] text-text-tertiary flex items-center gap-0.5">
                        📍 {emergency.location}
                      </span>
                      <span className="text-[8px] text-error mt-0.5">
                        {getSeverityLabel(emergency.severity)} •{" "}
                        {getStatusLabel(emergency.status)}
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}

            {/* Resource Markers */}
            {showResources &&
              resources.map((resource) => (
                <motion.div
                  key={resource.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                  style={{
                    left: `${((resource.longitude - 77.0) / 0.5) * 100}%`,
                    top: `${((resource.latitude - 28.5) / 0.4) * 100}%`,
                  }}
                  onClick={() => {
                    toast.info(
                      `📍 ${resource.name}\n${resource.location}\nAvailable: ${resource.availableQty} ${resource.unit || "units"}`,
                    );
                  }}
                >
                  <div
                    className={`w-7 h-7 rounded-full ${resource.status === "AVAILABLE" ? "bg-success/20 border-2 border-success" : "bg-error/20 border-2 border-error"} flex items-center justify-center shadow-lg shadow-primary/10`}
                  >
                    <span className="text-sm">
                      {getResourceIcon(resource.type)}
                    </span>
                  </div>
                  {/* Tooltip - Show on Hover */}
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-text-primary opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-lg border border-white/30 z-20 pointer-events-none min-w-[130px]">
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-text-primary text-xs">
                        {resource.name}
                      </span>
                      <span className="text-[8px] text-text-tertiary flex items-center gap-0.5">
                        📍 {resource.location}
                      </span>
                      <span
                        className={`text-[8px] mt-0.5 ${resource.status === "AVAILABLE" ? "text-success" : "text-warning"}`}
                      >
                        {resource.availableQty} available
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

            {/* No Data */}
            {!loading &&
              filteredEmergencies.length === 0 &&
              resources.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-text-tertiary/30 mx-auto mb-3" />
                    <p className="text-text-secondary font-medium">
                      No data to display
                    </p>
                    <p className="text-xs text-text-tertiary">
                      Add emergencies or resources to see them on map
                    </p>
                  </div>
                </div>
              )}

            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 z-20">
              <button
                onClick={() => setZoom((z) => Math.min(z + 1, 20))}
                className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl shadow-soft hover:shadow-medium transition-shadow flex items-center justify-center text-primary border border-white/30"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z - 1, 1))}
                className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl shadow-soft hover:shadow-medium transition-shadow flex items-center justify-center text-primary border border-white/30"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-soft border border-white/30 text-xs z-20">
              <p className="font-semibold text-text-primary mb-1.5">Legend</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-error" />
                  <span className="text-text-secondary">Critical/High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-text-secondary">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-text-secondary">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success/50 border border-success" />
                  <span className="text-text-secondary">
                    Resource Available
                  </span>
                </div>
              </div>
            </div>

            {/* Map Info */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-1.5 shadow-soft border border-white/30 text-xs text-text-secondary z-20 flex items-center gap-3">
              <span>🗺️ {filteredEmergencies.length} emergencies</span>
              <span>•</span>
              <span>📦 {resources.length} resources</span>
              <span>•</span>
              <span>Zoom: {zoom}x</span>
            </div>
          </div>
        </div>

        {/* ===== EMERGENCY FEED + RESOURCES ===== */}
        <div className="px-3 md:px-4 pb-4">
          <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-primary/5 border border-white/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-text-primary text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-error" />
                Emergency Feed
              </h3>
              <span className="text-xs text-text-secondary">
                {filteredEmergencies.length} active
              </span>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl border border-white/20"
                  >
                    <div className="w-8 h-8 rounded-xl bg-sand-light/50 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-sand-light/50 rounded-lg animate-pulse" />
                      <div className="h-3 w-20 bg-sand-light/50 rounded-lg animate-pulse mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredEmergencies.length === 0 ? (
              <div className="text-center py-4 text-text-tertiary">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No emergencies reported</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredEmergencies.slice(0, 5).map((emergency) => (
                  <motion.div
                    key={emergency.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedEmergency?.id === emergency.id
                        ? "border-primary bg-primary/5 shadow-soft"
                        : "border-white/30 hover:border-primary/30 hover:bg-sand-light/30"
                    }`}
                    onClick={() => setSelectedEmergency(emergency)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span>{getTypeIcon(emergency.type)}</span>
                          <p className="font-medium text-sm text-text-primary truncate">
                            {emergency.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full ${getSeverityColor(emergency.severity)}`}
                          >
                            {emergency.severity}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(emergency.status)}`}
                          >
                            {getStatusLabel(emergency.status)}
                          </span>
                          <span className="text-[10px] text-text-tertiary">
                            {new Date(emergency.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-xs text-text-tertiary mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {emergency.location}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-text-secondary">
                        <Users className="w-3 h-3" />
                        {emergency.victimCount}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {filteredEmergencies.length > 5 && (
                  <p className="text-center text-xs text-text-tertiary pt-1">
                    +{filteredEmergencies.length - 5} more emergencies
                  </p>
                )}
              </div>
            )}

            {/* ===== RESOURCES FEED ===== */}
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-success" />
                  Resources Nearby
                </h4>
                <span className="text-xs text-text-tertiary">
                  {resources.length} available
                </span>
              </div>

              {loading ? (
                <div className="flex flex-wrap gap-1.5">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-6 w-16 bg-sand-light/50 rounded-full animate-pulse"
                    />
                  ))}
                </div>
              ) : resources.length === 0 ? (
                <p className="text-xs text-text-tertiary">
                  No resources available
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {resources.slice(0, 6).map((r) => (
                    <Badge
                      key={r.id}
                      className={`${getResourceStatusColor(r.status)} border text-[10px] px-2.5 py-1 cursor-pointer hover:scale-105 transition-transform`}
                      onClick={() => {
                        toast.info(
                          `📍 ${r.name}\n${r.location}\nAvailable: ${r.availableQty}`,
                        );
                      }}
                    >
                      {getResourceIcon(r.type)} {r.name} ({r.availableQty})
                    </Badge>
                  ))}
                  {resources.length > 6 && (
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] px-2.5 py-1">
                      +{resources.length - 6} more
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* ===== REPORT BUTTON ===== */}
            <div className="mt-3 pt-3 border-t border-white/20">
              <Link to="/report">
                <button className="w-full bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 text-white rounded-xl py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                  <AlertTriangle className="w-4 h-4" />
                  Report Emergency
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="text-center text-[10px] text-text-tertiary/40 py-3">
          © 2026 Disaster Relief Coordination Platform
        </div>
      </div>
    </div>
  );
};
