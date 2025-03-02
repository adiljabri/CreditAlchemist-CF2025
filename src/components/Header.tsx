
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-450 ease-apple py-4",
        scrolled ? "bg-white/80 backdrop-blur-lg shadow-soft" : "bg-transparent"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-500/5 opacity-0 transition-opacity duration-500" 
           style={{ opacity: scrolled ? 1 : 0 }} />
      <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 transition-opacity duration-500"
           style={{ opacity: scrolled ? 1 : 0 }} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative overflow-hidden rounded-full">
              <img src="/logo.svg" alt="Credit Alchemist Logo" className="w-8 h-8 transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
            </div>
            <div className="text-2xl font-semibold relative overflow-hidden">
              <span className="relative z-10 bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-text-shimmer">Credit Alchemist</span>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary to-blue-500 transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
            </div>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={cn(
                "text-sm font-medium transition-all duration-300 hover:text-primary relative px-2 py-1 group",
                isActive('/') ? "text-primary" : "text-foreground/80"
              )}
            >
              <span className="relative z-10">Home</span>
              {isActive('/') && (
                <motion.div 
                  layoutId="navIndicator"
                  className="absolute inset-0 bg-primary/10 rounded-md -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
            <Link 
              to="/dashboard" 
              className={cn(
                "text-sm font-medium transition-all duration-300 hover:text-primary relative px-2 py-1 group",
                isActive('/dashboard') ? "text-primary" : "text-foreground/80"
              )}
            >
              <span className="relative z-10">Dashboard</span>
              {isActive('/dashboard') && (
                <motion.div 
                  layoutId="navIndicator"
                  className="absolute inset-0 bg-primary/10 rounded-md -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
            <Link 
              to="/chat" 
              className={cn(
                "text-sm font-medium transition-all duration-300 hover:text-primary relative px-2 py-1 group",
                isActive('/chat') ? "text-primary" : "text-foreground/80"
              )}
            >
              <span className="relative z-10">Chat</span>
              {isActive('/chat') && (
                <motion.div 
                  layoutId="navIndicator"
                  className="absolute inset-0 bg-primary/10 rounded-md -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
