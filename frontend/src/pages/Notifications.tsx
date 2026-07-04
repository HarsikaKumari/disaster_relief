/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Filter,
  Loader2,
  MessageCircle,
  RefreshCw,
  Settings,
  Truck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Navbar } from "../components/layouts/Navbar";
import { Sidebar } from "../components/layouts/sidebar";
import { Button } from "../components/ui/button";
import api from "../lib/api";

// ============================================
// TYPES
// ============================================

interface Notification {
  id: string;
  type:
    | "EMERGENCY_ALERT"
    | "RESOURCE_UPDATE"
    | "VOLUNTEER_ASSIGNMENT"
    | "STATUS_UPDATE"
    | "MESSAGE"
    | "SYSTEM";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  link?: string;
  priority: "high" | "medium" | "low";
  createdAt: string;
}

interface NotificationStats {
  total: number;
  unread: number;
  highPriority: number;
}

// ============================================
// NOTIFICATION CARD
// ============================================

const NotificationCard = ({
  notification,
  onMarkRead,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "EMERGENCY_ALERT":
        return "bg-error text-white";
      case "VOLUNTEER_ASSIGNMENT":
        return "bg-primary text-white";
      case "RESOURCE_UPDATE":
        return "bg-success text-white";
      case "STATUS_UPDATE":
        return "bg-info text-white";
      case "MESSAGE":
        return "bg-warning text-white";
      case "SYSTEM":
        return "bg-muted text-text-secondary";
      default:
        return "bg-primary text-white";
    }
  };

  const getPriorityBorder = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-error";
      case "medium":
        return "border-l-4 border-warning";
      case "low":
        return "border-l-4 border-success";
      default:
        return "";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "EMERGENCY_ALERT":
        return <AlertTriangle className="w-4 h-4" />;
      case "VOLUNTEER_ASSIGNMENT":
        return <Users className="w-4 h-4" />;
      case "RESOURCE_UPDATE":
        return <Truck className="w-4 h-4" />;
      case "STATUS_UPDATE":
        return <CheckCircle className="w-4 h-4" />;
      case "MESSAGE":
        return <MessageCircle className="w-4 h-4" />;
      case "SYSTEM":
        return <Settings className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const handleMarkRead = async () => {
    if (!notification.isRead) {
      await onMarkRead(notification.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 4 }}
      onClick={handleMarkRead}
      className={`bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer ${getPriorityBorder(notification.priority)} ${!notification.isRead ? "bg-white/70" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-xl ${getTypeColor(notification.type)} flex items-center justify-center flex-shrink-0 shadow-sm`}
        >
          {getTypeIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-text-primary">
              {notification.title}
            </p>
            {!notification.isRead && (
              <div className="w-2 h-2 rounded-full bg-error flex-shrink-0 mt-1.5" />
            )}
          </div>
          <p className="text-sm text-text-secondary mt-0.5">
            {notification.message}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs text-text-tertiary flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {notification.time}
            </span>
            {notification.link && (
              <Link
                to={notification.link}
                className="text-xs text-primary hover:text-primary-dark font-medium flex items-center gap-0.5"
              >
                View <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// NOTIFICATIONS STATS
// ============================================

const NotificationStats = ({
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
  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 text-center hover:shadow-md transition-shadow">
    <div
      className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto`}
    >
      {icon}
    </div>
    {isLoading ? (
      <div className="h-6 w-12 bg-sand-light/50 rounded-lg animate-pulse mx-auto mt-2" />
    ) : (
      <p className="text-xl font-bold text-text-primary mt-2">{value}</p>
    )}
    <p className="text-xs text-text-tertiary">{label}</p>
  </div>
);

// ============================================
// MAIN NOTIFICATIONS PAGE
// ============================================

export const Notifications = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    highPriority: 0,
  });
  const [filterType, setFilterType] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  // ========== FETCH NOTIFICATIONS ==========
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const [notificationsRes, statsRes] = await Promise.all([
        api.get("/notifications?limit=50"),
        api.get("/notifications/stats"),
      ]);

      if (notificationsRes.data.success) {
        // Format notifications
        const formatted = notificationsRes.data.data.map((n: any) => ({
          ...n,
          time: new Date(n.createdAt).toLocaleString(),
          priority:
            n.priority === 2 ? "high" : n.priority === 1 ? "medium" : "low",
        }));
        setNotifications(formatted);
      }

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (error: any) {
      console.error("Fetch notifications error:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();

    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // ========== MARK AS READ ==========
  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      if (response.data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        );
        setStats((prev) => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1),
        }));
        toast.success("Marked as read");
      }
    } catch (error: any) {
      toast.error("Failed to mark as read");
      console.error("Failed to mark as read:", error);
    }
  };

  // ========== MARK ALL AS READ ==========
  const handleMarkAllAsRead = async () => {
    setMarkingAll(true);
    try {
      const response = await api.put("/notifications/read-all");
      if (response.data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setStats((prev) => ({
          ...prev,
          unread: 0,
        }));
        toast.success("All notifications marked as read");
      }
    } catch (error: any) {
      toast.error("Failed to mark all as read");
      console.error("Failed to mark all as read:", error);
    } finally {
      setMarkingAll(false);
    }
  };

  // ========== DELETE ALL READ ==========
  const handleDeleteAllRead = async () => {
  try {
    const response = await api.delete('/notifications/read-all');
    if (response.data.success) {
      setNotifications((prev) => prev.filter((n) => !n.isRead));
      
      // ✅ Update stats
      setStats((prev) => ({
        ...prev,
        total: prev.total - (prev.total - prev.unread), 
      }));
      
      toast.success('All read notifications deleted');
      
      fetchNotifications();
    } else {
      toast.error(response.data.message || 'Failed to delete notifications');
    }
  } catch (error: any) {
    console.error('Delete read error:', error);
    toast.error(error.response?.data?.message || 'Failed to delete notifications');
  }
};

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === "all") return true;
    return n.type === filterType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex">
      <Sidebar
        active="Notifications"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 min-w-0 overflow-y-auto h-screen">
        {/* Navbar */}
        <Navbar
          title="Notifications"
          subtitle={`${stats.unread} unread`}
          onMenuClick={() => setMobileOpen(true)}
        />

        {/* Content */}
        <div className="p-3 md:p-4 pb-8 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <NotificationStats
              label="Total"
              value={stats.total}
              icon={<Bell className="w-4 h-4 text-white" />}
              color="bg-gradient-to-br from-primary to-primary-dark text-white"
              isLoading={loading}
            />
            <NotificationStats
              label="Unread"
              value={stats.unread}
              icon={<AlertTriangle className="w-4 h-4 text-white" />}
              color="bg-gradient-to-br from-error to-error-dark text-white"
              isLoading={loading}
            />
            <NotificationStats
              label="Read"
              value={stats.total - stats.unread}
              icon={<CheckCircle className="w-4 h-4 text-white" />}
              color="bg-gradient-to-br from-success to-success-dark text-white"
              isLoading={loading}
            />
            <NotificationStats
              label="High Priority"
              value={stats.highPriority}
              icon={<AlertTriangle className="w-4 h-4 text-white" />}
              color="bg-gradient-to-br from-warning to-warning-dark text-white"
              isLoading={loading}
            />
          </div>

          {/* Actions */}
          <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-primary/5 border border-white/30">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 text-sm text-text-secondary hover:bg-white/70 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filter
                  {showFilters ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
                {stats.unread > 0 && (
                  <Button
                    onClick={handleMarkAllAsRead}
                    disabled={markingAll}
                    variant="outline"
                    className="border-white/30 text-text-secondary hover:bg-white/50 rounded-xl text-sm h-9"
                  >
                    {markingAll ? (
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                    )}
                    Mark All Read
                  </Button>
                )}
                <button
                  onClick={handleDeleteAllRead}
                  className="px-3 py-1.5 bg-error/10 text-error hover:bg-error/20 rounded-xl text-xs font-medium transition-colors"
                >
                  Delete Read
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchNotifications}
                  disabled={loading}
                  className="p-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 text-text-secondary hover:bg-white/70 transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
                <span className="text-xs text-text-tertiary">
                  {notifications.length} notifications
                </span>
              </div>
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
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/20">
                    {[
                      "all",
                      "EMERGENCY_ALERT",
                      "VOLUNTEER_ASSIGNMENT",
                      "RESOURCE_UPDATE",
                      "STATUS_UPDATE",
                      "MESSAGE",
                      "SYSTEM",
                    ].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          filterType === type
                            ? "bg-primary text-white"
                            : "bg-white/50 text-text-secondary hover:bg-white/70"
                        }`}
                      >
                        {type === "all" ? "All" : type.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sand-light/50 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-40 bg-sand-light/50 rounded-lg animate-pulse" />
                      <div className="h-3 w-60 bg-sand-light/50 rounded-lg animate-pulse mt-1" />
                      <div className="h-3 w-20 bg-sand-light/50 rounded-lg animate-pulse mt-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-md rounded-2xl p-12 text-center border border-white/30">
              <Bell className="w-16 h-16 text-text-tertiary/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary">
                No Notifications
              </h3>
              <p className="text-sm text-text-tertiary mt-1">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkAsRead}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
