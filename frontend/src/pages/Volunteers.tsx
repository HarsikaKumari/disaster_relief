/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  Filter,
  Mail,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Plus,
  RefreshCw,
  Search as SearchIcon,
  Shield,
  Star,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Navbar } from "../components/layouts/Navbar";
import { Sidebar } from "../components/layouts/sidebar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import api from "../lib/api";

// ============================================
// TYPES
// ============================================

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location?: string;
  skills: string[];
  availability: "AVAILABLE" | "BUSY" | "OFF_DUTY" | "UNREACHABLE";
  rating: number;
  missionsCompleted: number;
  totalHoursVolunteered: number;
  verifiedVolunteer: boolean;
  status: "Active" | "Inactive" | "Pending";
  joinedDate: string;
  profileImage?: string;
  bio?: string;
}

interface VolunteerStats {
  total: number;
  available: number;
  verified: number;
  unverified: number;
  totalHoursVolunteered: number;
}

// ============================================
// VOLUNTEER CARD
// ============================================

const VolunteerCard = ({
  volunteer,
  onChat,
}: {
  volunteer: Volunteer;
  onRefresh: () => void;
  onChat: (volunteer: Volunteer) => void;
}) => {
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "AVAILABLE":
        return "bg-success text-white border-success";
      case "BUSY":
        return "bg-warning text-white border-warning";
      case "OFF_DUTY":
        return "bg-muted text-text-secondary border-muted";
      case "UNREACHABLE":
        return "bg-error text-white border-error";
      default:
        return "bg-primary text-white";
    }
  };

  const getAvailabilityLabel = (availability: string) => {
    switch (availability) {
      case "AVAILABLE":
        return "Available";
      case "BUSY":
        return "Busy";
      case "OFF_DUTY":
        return "Off Duty";
      case "UNREACHABLE":
        return "Unreachable";
      default:
        return availability;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success/10 text-success border-success/20";
      case "Inactive":
        return "bg-error/10 text-error border-error/20";
      case "Pending":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted/10 text-text-secondary border-muted/20";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white/50 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-primary/5 border border-white/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-lg shadow-primary/20">
          {volunteer.name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-text-primary">
                {volunteer.name}
              </h4>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <Badge
                  className={`text-[10px] border ${getAvailabilityColor(volunteer.availability)}`}
                >
                  {getAvailabilityLabel(volunteer.availability)}
                </Badge>
                <Badge
                  className={`text-[10px] border ${getStatusColor(volunteer.status)}`}
                >
                  {volunteer.status}
                </Badge>
                {volunteer.verifiedVolunteer && (
                  <Badge className="bg-success/10 text-success border-success/20 text-[10px]">
                    <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
                    Verified
                  </Badge>
                )}
                <div className="flex items-center gap-0.5 text-warning">
                  <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                  <span className="text-xs font-medium text-text-primary">
                    {volunteer.rating || "4.5"}
                  </span>
                </div>
              </div>
            </div>
            <button className="p-1.5 rounded-xl hover:bg-sand-light/50 transition-colors">
              <MoreHorizontal className="w-4 h-4 text-text-tertiary" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-text-secondary">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-text-tertiary" />
              {volunteer.location || "N/A"}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-text-tertiary" />
              {volunteer.phone}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-text-tertiary" />
              {volunteer.email}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {volunteer.skills?.map((skill, i) => (
              <Badge
                key={i}
                className="bg-primary/10 text-primary border-primary/20 text-[10px]"
              >
                {skill}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-white/20">
            <div className="text-center">
              <p className="text-lg font-bold text-primary">
                {volunteer.missionsCompleted || 0}
              </p>
              <p className="text-[10px] text-text-tertiary">Missions</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-primary">
                {volunteer.totalHoursVolunteered || 0}
              </p>
              <p className="text-[10px] text-text-tertiary">Hours</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-primary">
                {volunteer.joinedDate || "N/A"}
              </p>
              <p className="text-[10px] text-text-tertiary">Joined</p>
            </div>
          </div>

          <div className="flex gap-2 mt-3 pt-3 border-t border-white/20">
            <Link to={`/volunteers/${volunteer.id}`} className="flex-1">
              <button className="w-full bg-primary/10 hover:bg-primary/20 text-primary rounded-xl py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                View Details
              </button>
            </Link>
            {/* ✅ CHAT BUTTON - FIXED */}
            <button
              onClick={() => onChat(volunteer)}
              className="flex-1 bg-primary hover:bg-primary-dark text-white rounded-xl py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Message
            </button>
          </div>
        </div>
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
  trend,
  isLoading,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: { value: string; up: boolean };
  isLoading?: boolean;
}) => (
  <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-primary/5 border border-white/30">
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
        {trend && !isLoading && (
          <p
            className={`text-xs font-medium ${trend.up ? "text-success" : "text-error"} mt-0.5`}
          >
            {trend.value}
          </p>
        )}
      </div>
      <div
        className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}
      >
        {icon}
      </div>
    </div>
  </div>
);


export const Volunteers = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [stats, setStats] = useState<VolunteerStats>({
    total: 0,
    available: 0,
    verified: 0,
    unverified: 0,
    totalHoursVolunteered: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAvailability, setFilterAvailability] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const [volunteersRes, statsRes] = await Promise.all([
        api.get("/volunteers"),
        api.get("/volunteers/stats"),
      ]);

      if (volunteersRes.data.success) {
        const formattedVolunteers = volunteersRes.data.data.map((v: any) => ({
          id: v.id,
          name: v.name,
          email: v.email,
          phone: v.phone,
          location: v.location || "N/A",
          skills: v.skills || [],
          availability: v.availability || "AVAILABLE",
          rating: v.rating || 4.5,
          missionsCompleted: v.completedMissions || 0,
          totalHoursVolunteered: v.totalHoursVolunteered || 0,
          verifiedVolunteer: v.verifiedVolunteer || false,
          status: v.isActive ? "Active" : "Inactive",
          joinedDate: v.createdAt
            ? new Date(v.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })
            : "N/A",
          profileImage: v.profileImage,
          bio: v.bio,
        }));
        setVolunteers(formattedVolunteers);
      }

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (error: any) {
      console.error("Volunteers fetch error:", error);
      toast.error("Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVolunteers();
  }, []);

  // ========== FILTERS ==========
  const filteredVolunteers = volunteers.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAvailability =
      filterAvailability === "all" || v.availability === filterAvailability;
    const matchesStatus = filterStatus === "all" || v.status === filterStatus;
    return matchesSearch && matchesAvailability && matchesStatus;
  });

  // ========== FETCH EMERGENCIES ==========
 
  // ========== OPEN CHAT ==========
  const handleOpenChat = async (volunteer: Volunteer) => {
    try {
      const response = await api.post("/chat/rooms", {
        name: `Chat with ${volunteer.name}`,
        isGroup: false,
        memberIds: [volunteer.id],
      });
      if (response.data.success) {
        navigate(`/chat/${response.data.data.id}`);
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      toast.error(error.response?.data?.message || "Failed to open chat");
    }
  };

  // ========== OPEN ASSIGN MODAL ==========

  // ========== ASSIGN VOLUNTEER ==========
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex">
      <Sidebar
        active="Volunteers"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 min-w-0 overflow-y-auto h-screen">
        <Navbar
          title="Volunteers"
          subtitle="Manage and view all volunteers"
          onMenuClick={() => setMobileOpen(true)}
        />

        {/* Content */}
        <div className="p-3 md:p-4 pb-8 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              label="Total Volunteers"
              value={stats.total}
              icon={<Users className="w-4 h-4 text-white" />}
              color="bg-gradient-to-br from-primary to-primary-dark text-white"
              isLoading={loading}
            />
            <StatCard
              label="Available"
              value={stats.available}
              icon={<CheckCircle className="w-4 h-4 text-white" />}
              color="bg-gradient-to-br from-success to-success-dark text-white"
              trend={{ value: "Ready to help", up: true }}
              isLoading={loading}
            />
            <StatCard
              label="Verified"
              value={stats.verified}
              icon={<Shield className="w-4 h-4 text-white" />}
              color="bg-gradient-to-br from-info to-info-dark text-white"
              isLoading={loading}
            />
            <StatCard
              label="Pending Verification"
              value={stats.unverified}
              icon={<Clock className="w-4 h-4 text-white" />}
              color="bg-gradient-to-br from-warning to-warning-dark text-white"
              trend={{ value: "Needs review", up: false }}
              isLoading={loading}
            />
          </div>

          {/* Actions */}
          <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-primary/5 border border-white/30">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[150px] sm:hidden flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/30">
                <SearchIcon className="w-3.5 h-3.5 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent p-0 h-7 text-sm w-full focus:outline-none"
                />
              </div>

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

              <button
                onClick={fetchVolunteers}
                disabled={loading}
                className="p-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 text-text-secondary hover:bg-white/70 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
              </button>

              <Link to="/volunteers/add" className="ml-auto">
                <Button className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 text-white rounded-xl shadow-lg shadow-primary/20">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Volunteer
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
                      value={filterAvailability}
                      onChange={(e) => setFilterAvailability(e.target.value)}
                      className="h-9 px-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="all">All Availability</option>
                      <option value="AVAILABLE">✅ Available</option>
                      <option value="BUSY">🟡 Busy</option>
                      <option value="OFF_DUTY">⚪ Off Duty</option>
                      <option value="UNREACHABLE">🔴 Unreachable</option>
                    </select>

                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="h-9 px-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="all">All Status</option>
                      <option value="Active">✅ Active</option>
                      <option value="Inactive">❌ Inactive</option>
                      <option value="Pending">⏳ Pending</option>
                    </select>

                    <button
                      onClick={() => {
                        setFilterAvailability("all");
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

          {/* Volunteers Grid */}
          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/50 backdrop-blur-md rounded-2xl p-5 border border-white/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-sand-light/50 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-5 w-32 bg-sand-light/50 rounded-lg animate-pulse" />
                      <div className="h-4 w-20 bg-sand-light/50 rounded-lg animate-pulse mt-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-white/20">
                    <div className="h-8 w-full bg-sand-light/50 rounded-lg animate-pulse" />
                    <div className="h-8 w-full bg-sand-light/50 rounded-lg animate-pulse" />
                    <div className="h-8 w-full bg-sand-light/50 rounded-lg animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVolunteers.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-md rounded-2xl p-12 text-center border border-white/30">
              <Users className="w-16 h-16 text-text-tertiary/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary">
                No Volunteers Found
              </h3>
              <p className="text-sm text-text-tertiary mt-1">
                Try adjusting your filters or add a new volunteer.
              </p>
              <Link to="/volunteers/add">
                <Button className="mt-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Volunteer
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredVolunteers.map((volunteer) => (
                <VolunteerCard
                  key={volunteer.id}
                  volunteer={volunteer}
                  onRefresh={fetchVolunteers}
                  onChat={handleOpenChat}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
