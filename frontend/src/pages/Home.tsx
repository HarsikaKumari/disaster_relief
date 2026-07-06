import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  ChevronDown,
  Clock,
  Compass,
  Heart,
  MapPin,
  Phone,
  Shield,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import Navbar from "../components/global/Navbar";

const FloatingIcon = ({
  children,
  delay = 0,
  duration = 4,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}) => {
  return (
    <motion.div
      initial={{ y: 0, opacity: 0.15 }}
      animate={{
        y: [-12, 12, -12],
        opacity: [0.15, 0.35, 0.15],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
};

const GlowingCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      whileHover={{
        y: -6,
        boxShadow: "0 20px 60px rgba(79, 88, 68, 0.15)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative group ${className}`}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700" />
      {children}
    </motion.div>
  );
};

const StatCounter = ({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) => {
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace("+", ""));

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev < target) {
          return prev + Math.ceil(target / 50);
        }
        clearInterval(timer);
        return target;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="flex justify-center mb-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
      <div className="text-3xl md:text-4xl font-bold text-primary">
        {value.includes("+") ? `${count}+` : value}
      </div>
      <div className="text-sm text-text-secondary mt-1">{label}</div>
    </motion.div>
  );
};

export const Home = () => {
  const stats = [
    {
      icon: <Shield className="w-5 h-5" />,
      value: "500+",
      label: "Emergencies Handled",
    },
    {
      icon: <Users className="w-5 h-5" />,
      value: "2,000+",
      label: "Active Volunteers",
    },
    {
      icon: <Truck className="w-5 h-5" />,
      value: "150+",
      label: "Relief Resources",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      value: "24/7",
      label: "Real-time Support",
    },
  ];

  const features = [
    {
      icon: <AlertTriangle className="w-7 h-7" />,
      title: "Emergency Reporting",
      description:
        "Report disasters instantly with location tracking and image uploads for quick response.",
      color: "bg-accent/10 text-accent",
    },
    {
      icon: <MapPin className="w-7 h-7" />,
      title: "Live Tracking",
      description:
        "Track rescue teams and resources on an interactive map with real-time updates.",
      color: "bg-info/10 text-info",
    },
    {
      icon: <Heart className="w-7 h-7" />,
      title: "Volunteer Coordination",
      description:
        "Connect with nearby volunteers and coordinate rescue efforts seamlessly.",
      color: "bg-success/10 text-success",
    },
    {
      icon: <Bell className="w-7 h-7" />,
      title: "Real-time Alerts",
      description:
        "Get instant notifications about emergencies and updates in your area.",
      color: "bg-warning/10 text-warning",
    },
    {
      icon: <Compass className="w-7 h-7" />,
      title: "Resource Management",
      description:
        "Track and allocate food, shelter, and medical supplies efficiently.",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: <Activity className="w-7 h-7" />,
      title: "Admin Dashboard",
      description:
        "Monitor operations and generate detailed reports for better decision-making.",
      color: "bg-info/10 text-info",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand-light via-white to-secondary/20">
      {/* ========== NAVBAR ========== */}
      <Navbar />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero animate-hero" />

        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-24 left-10">
            <FloatingIcon delay={0}>
              <Shield className="w-16 h-16 text-white/10" />
            </FloatingIcon>
          </div>
          <div className="absolute top-32 right-20">
            <FloatingIcon delay={1.2}>
              <AlertTriangle className="w-12 h-12 text-white/8" />
            </FloatingIcon>
          </div>
          <div className="absolute bottom-40 left-16">
            <FloatingIcon delay={0.8} duration={5}>
              <Heart className="w-14 h-14 text-white/8" />
            </FloatingIcon>
          </div>
          <div className="absolute bottom-48 right-16">
            <FloatingIcon delay={1.8} duration={4.5}>
              <Users className="w-12 h-12 text-white/8" />
            </FloatingIcon>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-5 py-2.5 rounded-full mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                Real-time Disaster Management
              </span>
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-white"
          >
            Disaster Relief
            <br />
            <span className="text-sand-light">Coordination Platform</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
          >
            Streamlining communication, resource management, and coordination
            during natural disasters to save lives and strengthen relief
            efforts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to={isAuthenticated ? "/dashboard" : "/login"}>
              <Button
                size="lg"
                className="bg-white cursor-pointer text-primary hover:bg-sand-light shadow-xl shadow-primary/30 hover:shadow-primary/40 text-base px-8 h-12 rounded-xl transition-all duration-300"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/map">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 cursor-pointer text-white hover:bg-white/10 hover:border-white/50 text-base px-8 h-12 rounded-xl transition-all duration-300"
              >
                <MapPin className="mr-2 w-5 h-5" />
                View Live Map
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-8 h-8 text-white/40" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white border-y border-sand-dark/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <StatCounter
                key={index}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-sand-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Powerful Features
            </h2>
            <p className="mt-4 text-text-secondary max-w-2xl mx-auto">
              Everything you need to coordinate disaster relief efforts
              effectively
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <GlowingCard>
                  <Card className="h-full border-sand-dark/20 hover:border-primary/20 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-soft hover:shadow-card-hover">
                    <CardContent className="p-6 md:p-8">
                      <div
                        className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                      >
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </GlowingCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-olive text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Make a Difference?
            </h2>
            <p className="mt-4 text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
              Join thousands of volunteers and organizations working together to
              save lives during disasters.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                <Button
                  size="lg"
                  className="bg-white cursor-pointer text-primary hover:bg-sand-light shadow-xl shadow-black/20 hover:shadow-black/30 text-base px-8 h-12 rounded-xl transition-all duration-300"
                >
                  {isAuthenticated ? "Dashboard" : "Register Now"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 cursor-pointer text-white hover:bg-white/10 hover:border-white/50 text-base px-8 h-12 rounded-xl transition-all duration-300"
                >
                  <Phone className="mr-2 w-5 h-5" />
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-primary-dark text-white/70 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-white">
                  Disaster Relief
                </span>
              </div>
              <p className="text-sm text-white/50 leading-relaxed max-w-xs">
                Coordinating disaster relief efforts through technology and
                collaboration.
              </p>
            </div>

            <div>
              <h4
                className="text-white font-semibold mb-4 text-sm"
                style={{ color: "white" }}
              >
                Platform
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    to="/map"
                    className="hover:text-white transition-colors"
                    style={{ color: "white" }}
                  >
                    Live Map
                  </Link>
                </li>
                <li>
                  <Link
                    to="/report"
                    className="hover:text-white transition-colors"
                    style={{ color: "white" }}
                  >
                    Report Emergency
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className="hover:text-white transition-colors"
                    style={{ color: "white" }}
                  >
                    Resources
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4
                className="text-white font-semibold mb-4 text-sm"
                style={{ color: "white" }}
              >
                Support
              </h4>

              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-white transition-colors"
                    style={{ color: "white" }}
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-white transition-colors"
                    style={{ color: "white" }}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4
                className="text-white font-semibold mb-4 text-sm"
                style={{ color: "white" }}
              >
                Emergency
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-accent-light" />
                  <span className="text-white">112 - Emergency</span>
                </li>
                <li className="text-white/40">24/7 Support Available</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-10 pt-8 text-center text-sm text-white/30">
            © 2026 Disaster Relief Coordination Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
