import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const isAuthenticated = !!localStorage.getItem("token");
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        isScrolled
          ? "bg-primary/95 backdrop-blur-xl border-b border-white/10 shadow-nav"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">
              Disaster Relief
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["Home", "About", "Contact", "Map", "Resources"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="text-sm text-white/70 hover:text-white transition-colors duration-200 font-medium "
                style={{
                  color: isAuthenticated ? "#4F5844" : "#FFFFFF",
                }}
              >
                <span className="cursor-pointer text-white hover:text-white/70 transition-colors duration-200 font-medium">{item}</span>

              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to={isAuthenticated ? "/dashboard" : "/login"}>
              <Button
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer"
              >
                {isAuthenticated ? "Dashboard" : "Sign In"}
              </Button>
            </Link>
          {
            !isAuthenticated && (
              <Link to="/register">
                <Button className="bg-white text-primary hover:bg-sand-light rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
                  Get Started
                </Button>
              </Link>
            )
          }
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
