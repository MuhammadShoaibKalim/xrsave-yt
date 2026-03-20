import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download, User, LogOut, History, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { authApi } from '../../services/api';
import toast from 'react-hot-toast';

const navLinks = [
  { to: '/video', label: 'Video' },
  { to: '/audio', label: 'Audio MP3' },
  { to: '/thumbnail', label: 'Thumbnail' },
  { to: '/shorts', label: 'Shorts' },
  { to: '/subtitle', label: 'Subtitles', disabled: true },
  { to: '/playlist', label: 'Playlist', disabled: true },
  { to: '/extract', label: 'Extract Info' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch { }
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-dark-900/95 backdrop-blur-md border-b border-dark-600' : 'bg-transparent'
        }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center group-hover:bg-brand-500 transition-colors">
            <Download className="w-4 h-4 text-true-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            xrsave <span className="text-brand-500">YT</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            link.disabled ? (
              <span
                key={link.to}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-500 cursor-not-allowed flex items-center gap-1.5"
                title="Will be available soon"
              >
                {link.label}
                <span className="text-[10px] bg-dark-800/50 border border-dark-600/50 px-1.5 py-0.5 rounded text-gray-400">Soon</span>
              </span>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? 'text-brand-400 bg-brand-600/10'
                    : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  }`
                }
              >
                {link.label}
              </NavLink>
            )
          ))}
        </div>

        {/* Auth + Mobile */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 mr-1 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"
            title="Toggle Light/Dark Mode"
          >
            {theme === 'light' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-400" />}
          </button>

          {isAuthenticated ? (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold text-true-white">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-300">{user?.name?.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 top-12 w-48 bg-dark-800 border border-dark-600 rounded-xl shadow-xl overflow-hidden"
                  >
                    <Link to="/history" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-dark-700 hover:text-white transition-colors">
                      <History className="w-4 h-4" /> Download History
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-dark-700 transition-colors">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              {/* <Link to="/login" className="btn-ghost text-sm">Sign In</Link> */}
              <Link to="/" className="btn-primary text-sm py-2">Get Started</Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-dark-900 border-b border-dark-600 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                link.disabled ? (
                  <div
                    key={link.to}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 cursor-not-allowed"
                    title="Will be available soon"
                  >
                    {link.label}
                    <span className="text-[10px] bg-dark-800 border border-dark-600 px-1.5 py-0.5 rounded text-gray-400">Soon</span>
                  </div>
                ) : (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? 'text-brand-400 bg-brand-600/10' : 'text-gray-400 hover:text-white hover:bg-dark-700'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                )
              ))}
              <div className="pt-2 border-t border-dark-600 mt-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/history" className="block px-4 py-3 text-sm text-gray-300 hover:bg-dark-700 rounded-xl">History</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-dark-700 rounded-xl">Sign Out</button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" className="flex-1 btn-secondary text-center text-sm py-2">Sign In</Link>
                    <Link to="/register" className="flex-1 btn-primary text-center text-sm py-2">Register</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
