/* eslint-disable react-hooks/static-components */
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  LayoutDashboard,
  LogOut,
  MapPin,
  MessageCircle,
  Settings,
  ShieldCheck,
  Truck,
  User,
  Users,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 10 L180 50 L180 100 C180 140 150 175 100 190 C50 175 20 140 20 100 L20 50 L100 10Z"
        fill="url(#shieldGrad)"
        stroke="#4F5844"
        strokeWidth="2"
      />
      <path
        d="M100 25 L160 55 L160 95 C160 125 135 155 100 168 C65 155 40 125 40 95 L40 55 L100 25Z"
        fill="#F5F2EC"
        opacity="0.9"
      />
      <path
        d="M70 100 L90 120 L130 70"
        stroke="#4F5844"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M75 110 L85 130 L95 110"
        stroke="#4F5844"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M120 80 L135 65 L145 80"
        stroke="#4F5844"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M95 145 C90 138 80 140 80 148 C80 156 95 165 95 165 C95 165 110 156 110 148 C110 140 100 138 95 145Z"
        fill="#7A2E2A"
        opacity="0.8"
      />
      <circle cx="60" cy="70" r="4" fill="#4F5844" opacity="0.4" />
      <circle cx="140" cy="70" r="4" fill="#4F5844" opacity="0.4" />
      <circle cx="100" cy="55" r="3" fill="#7A2E2A" opacity="0.3" />

      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#5E6653" }} />
          <stop offset="50%" style={{ stopColor: "#4F5844" }} />
          <stop offset="100%" style={{ stopColor: "#3E4636" }} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const Sidebar = ({
  active,
  mobileOpen,
  setMobileOpen,
}: {
  active: string;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}) => {
  const navigate = useNavigate();

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === "ADMIN";

  const navItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
      href: "/dashboard",
    },
    // Admin Panel - only for ADMIN users
    ...(isAdmin
      ? [
          {
            icon: <ShieldCheck className="w-5 h-5" />,
            label: "Admin Panel",
            href: "/admin",
          },
        ]
      : []),
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      label: "Emergencies",
      href: "/emergencies",
    },
    { icon: <MapPin className="w-5 h-5" />, label: "Live Map", href: "/map" },
    {
      icon: <Truck className="w-5 h-5" />,
      label: "Resources",
      href: "/resources",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Volunteers",
      href: "/volunteers",
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      label: "Chat",
      href: "/chat",
    },
    {
      icon: <Bell className="w-5 h-5" />,
      label: "Notifications",
      href: "/notifications",
    },
    {
      icon: <User className="w-5 h-5" />,
      label: "Profile",
      href: "/profile",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      href: "/settings",
    },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="w-11 h-11 flex-shrink-0">
          <Logo className="w-full h-full" />
        </div>
        <div>
          <span className="text-lg font-bold text-primary tracking-tight block leading-tight">
            Disaster
          </span>
          <span className="text-[10px] font-medium text-text-tertiary tracking-widest uppercase">
            Relief Platform
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
              active === item.label
                ? "bg-gradient-to-r from-primary/50 to-primary-dark/50 text-white shadow-lg shadow-primary/25"
                : "text-white hover:bg-primary/5 hover:text-primary"
            }`}
          >
            <span
              className={
                active === item.label
                  ? "text-white"
                  : "text-text-secondary group-hover:text-primary transition-colors"
              }
            >
              {item.icon}
            </span>
            <span
              className={
                active === item.label
                  ? "text-white flex-1"
                  : "text-text-secondary group-hover:text-primary transition-colors"
              }
            >
              {item.label}
            </span>
            {active === item.label && (
              <motion.div
                layoutId="activeDot"
                className="w-1.5 h-1.5 rounded-full bg-white/80"
              />
            )}
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-3">
        <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-sand-light via-secondary/30 to-accent/10 border border-accent/10 shadow-lg shadow-accent/5">
          <div className="absolute inset-0 bg-gradient-to-tr from-sand-light/50 via-transparent to-accent/10" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary-dark/80 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-lg shadow-primary/20">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-primary-dark truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-text-medium truncate">
                {user?.role || "User"}
              </p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
              }}
              className="p-1.5 rounded-xl hover:bg-error/10 text-text-light hover:text-error transition-colors"
            >
              <LogOut className="w-4 h-4 cursor-pointer" />
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 lg:w-72 flex-col bg-gradient-to-b from-white/80 via-sand-light/30 to-white/80 backdrop-blur-xl rounded-r-3xl shadow-xl shadow-accent/5 h-screen sticky top-0 flex-shrink-0 border-r border-accent/10 bg-primary">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-72 bg-gradient-to-b from-white via-sand-light/30 to-white h-full shadow-2xl rounded-r-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-2">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-xl hover:bg-sand-light/50"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};
