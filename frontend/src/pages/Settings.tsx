/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import {
  Bell,
  Eye,
  EyeOff,
  Key,
  Loader2,
  Lock,
  Moon,
  Save,
  Settings as SettingsIcon,
  Shield,
  ShieldCheck,
  Sun,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Navbar } from "../components/layouts/Navbar";
import { Sidebar } from "../components/layouts/sidebar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import api from "../lib/api";

// ============================================
// TYPES
// ============================================

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  bio?: string;
  profileImage?: string;
}

// ============================================
// SETTINGS PAGE
// ============================================

export const Settings = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "notifications" | "preferences"
  >("profile");

  // Profile State
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    bio: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Notification Preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    emergencyAlerts: true,
    volunteerAssignments: true,
    statusUpdates: true,
    resourceUpdates: true,
    chatMessages: true,
    systemUpdates: true,
    emailNotifications: true,
  });

  // Theme
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // ========== FETCH PROFILE ==========
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/profile");
        if (response.data.success) {
          const data = response.data.data;
          setProfile(data);
          setFormData({
            name: data.name || "",
            phone: data.phone || "",
            bio: data.bio || "",
          });
        }
      } catch (error) {
        console.error("Fetch profile error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();

    // Load theme from localStorage
    const savedTheme =
      (localStorage.getItem("theme") as "light" | "dark") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // ========== UPDATE PROFILE ==========
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await api.put("/users/profile", {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
      });
      if (response.data.success) {
        setProfile(response.data.data);
        toast.success("Profile updated successfully!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // ========== CHANGE PASSWORD ==========
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSaving(true);
    try {
      const response = await api.put("/users/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (response.data.success) {
        toast.success("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  // ========== TOGGLE THEME ==========
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // ========== SAVE NOTIFICATION PREFERENCES ==========
  const saveNotificationPrefs = async () => {
    setSaving(true);
    try {
      const response = await api.put(
        "/users/notification-preferences",
        notificationPrefs,
      );
      if (response.data.success) {
        toast.success("Notification preferences saved!");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  // ========== SETTINGS TABS ==========
  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-4 h-4" />,
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: <SettingsIcon className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex">
      <Sidebar
        active="Settings"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 min-w-0 overflow-y-auto h-screen">
        <Navbar
          title="Settings"
          subtitle="Manage your account settings"
          onMenuClick={() => setMobileOpen(true)}
        />

        <div className="p-3 md:p-4 pb-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
              <p className="text-sm text-text-tertiary">
                Manage your account preferences and security
              </p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1 mb-6 bg-white/50 backdrop-blur-md rounded-2xl p-1 border border-white/30">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "text-text-secondary hover:bg-sand-light/50"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ===== PROFILE TAB ===== */}
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-lg shadow-primary/5 border border-white/30"
              >
                <h2 className="text-lg font-bold text-text-primary mb-4">
                  Profile Settings
                </h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-text-primary">
                        Full Name
                      </Label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-text-primary">
                        Email
                      </Label>
                      <Input
                        value={profile.email}
                        disabled
                        className="bg-sand-light/30 border-white/30 rounded-xl text-text-tertiary cursor-not-allowed"
                      />
                      <p className="text-xs text-text-tertiary">
                        Email cannot be changed
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-text-primary">
                        Phone
                      </Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-text-primary">
                        Role
                      </Label>
                      <Input
                        value={profile.role}
                        disabled
                        className="bg-sand-light/30 border-white/30 rounded-xl text-text-tertiary cursor-not-allowed uppercase"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-text-primary">
                      Bio
                    </Label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      rows={3}
                      placeholder="Tell us about yourself..."
                      className="w-full bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-2.5 text-sm placeholder:text-text-tertiary/50 resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-primary hover:bg-primary-dark text-white rounded-xl"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-1.5" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            )}

            {/* ===== SECURITY TAB ===== */}
            {activeTab === "security" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-lg shadow-primary/5 border border-white/30"
              >
                <h2 className="text-lg font-bold text-text-primary mb-4">
                  Change Password
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-text-primary">
                      Current Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                      <Input
                        type={showPassword.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        placeholder="Enter current password"
                        className="pl-10 bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            current: !showPassword.current,
                          })
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                      >
                        {showPassword.current ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-text-primary">
                      New Password
                    </Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                      <Input
                        type={showPassword.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="Enter new password (min 6 characters)"
                        className="pl-10 bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            new: !showPassword.new,
                          })
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                      >
                        {showPassword.new ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-text-primary">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                      <Input
                        type={showPassword.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Confirm new password"
                        className="pl-10 bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            confirm: !showPassword.confirm,
                          })
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                      >
                        {showPassword.confirm ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-primary hover:bg-primary-dark text-white rounded-xl"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4 mr-1.5" />
                        Change Password
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center gap-3 p-4 bg-sand-light/30 rounded-xl border border-white/20">
                    <ShieldCheck className="w-8 h-8 text-success" />
                    <div>
                      <p className="font-medium text-text-primary">
                        Account Security
                      </p>
                      <p className="text-sm text-text-tertiary">
                        Your account is protected with industry-standard
                        encryption.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ===== NOTIFICATIONS TAB ===== */}
            {activeTab === "notifications" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-lg shadow-primary/5 border border-white/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-text-primary">
                    Notification Preferences
                  </h2>
                  <Badge className="bg-success/10 text-success border-success/20">
                    Real-time
                  </Badge>
                </div>
                <p className="text-sm text-text-tertiary mb-4">
                  Choose what notifications you want to receive
                </p>
                <div className="space-y-3">
                  {[
                    {
                      key: "emergencyAlerts",
                      label: "Emergency Alerts",
                      desc: "Get notified about new emergencies in your area",
                    },
                    {
                      key: "volunteerAssignments",
                      label: "Volunteer Assignments",
                      desc: "Get notified when you're assigned to a mission",
                    },
                    {
                      key: "statusUpdates",
                      label: "Status Updates",
                      desc: "Get notified about emergency status changes",
                    },
                    {
                      key: "resourceUpdates",
                      label: "Resource Updates",
                      desc: "Get notified about resource availability changes",
                    },
                    {
                      key: "chatMessages",
                      label: "Chat Messages",
                      desc: "Get notified about new chat messages",
                    },
                    {
                      key: "systemUpdates",
                      label: "System Updates",
                      desc: "Get notified about platform updates and maintenance",
                    },
                    {
                      key: "emailNotifications",
                      label: "Email Notifications",
                      desc: "Receive notifications via email as well",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-3 rounded-xl bg-sand-light/30 border border-white/20 hover:bg-sand-light/50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {item.label}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          {item.desc}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={
                            notificationPrefs[
                              item.key as keyof typeof notificationPrefs
                            ]
                          }
                          onChange={() =>
                            setNotificationPrefs({
                              ...notificationPrefs,
                              [item.key]:
                                !notificationPrefs[
                                  item.key as keyof typeof notificationPrefs
                                ],
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-primary transition-colors duration-300">
                          <div
                            className={`w-5 h-5 bg-white rounded-full transition-all duration-300 transform ${notificationPrefs[item.key as keyof typeof notificationPrefs] ? "translate-x-5" : "translate-x-0.5"} mt-0.5 shadow-md`}
                          />
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={saveNotificationPrefs}
                  disabled={saving}
                  className="mt-4 bg-primary hover:bg-primary-dark text-white rounded-xl"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-1.5" />
                      Save Preferences
                    </>
                  )}
                </Button>
              </motion.div>
            )}

            {/* ===== PREFERENCES TAB ===== */}
            {activeTab === "preferences" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-lg shadow-primary/5 border border-white/30"
              >
                <h2 className="text-lg font-bold text-text-primary mb-4">
                  Preferences
                </h2>
                <div className="space-y-4">
                  {/* Theme Toggle */}
                  <div className="p-4 bg-sand-light/30 rounded-xl border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          Theme
                        </p>
                        <p className="text-xs text-text-tertiary">
                          Choose between light and dark mode
                        </p>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-xl border border-white/30 hover:bg-white/70 transition-colors"
                      >
                        {theme === "light" ? (
                          <>
                            <Sun className="w-4 h-4 text-warning" />
                            <span className="text-sm font-medium">Light</span>
                          </>
                        ) : (
                          <>
                            <Moon className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">Dark</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Language */}
                  <div className="p-4 bg-sand-light/30 rounded-xl border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          Language
                        </p>
                        <p className="text-xs text-text-tertiary">
                          Select your preferred language
                        </p>
                      </div>
                      <select className="h-9 px-3 bg-white/50 border border-white/30 rounded-xl text-sm text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20">
                        <option value="en">🇺🇸 English</option>
                        <option value="hi">🇮🇳 Hindi</option>
                      </select>
                    </div>
                  </div>

                  {/* Timezone */}
                  <div className="p-4 bg-sand-light/30 rounded-xl border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          Timezone
                        </p>
                        <p className="text-xs text-text-tertiary">
                          Select your timezone
                        </p>
                      </div>
                      <select className="h-9 px-3 bg-white/50 border border-white/30 rounded-xl text-sm text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20">
                        <option value="asia/kolkata">
                          Asia/Kolkata (UTC +5:30)
                        </option>
                        <option value="asia/dubai">
                          Asia/Dubai (UTC +4:00)
                        </option>
                        <option value="utc">UTC</option>
                      </select>
                    </div>
                  </div>

                  {/* Session */}
                  <div className="p-4 bg-sand-light/30 rounded-xl border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          Active Sessions
                        </p>
                        <p className="text-xs text-text-tertiary">
                          Manage your active sessions
                        </p>
                      </div>
                      <button className="text-sm text-primary hover:text-primary-dark font-medium">
                        View All →
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-text-secondary">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        Current Session
                      </div>
                      <span>•</span>
                      <span>Chrome on Windows</span>
                      <span>•</span>
                      <span>Today, 10:30 AM</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
