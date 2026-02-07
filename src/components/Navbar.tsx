import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { Scale, Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AnimatedButton from './AnimatedButton';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const navLinks = [
  { label: 'Situation Assessment', href: '#analyzer', isHash: true },
  { label: 'Procedural Steps', href: '#timeline', isHash: true },
  { label: 'Legal Assistance', href: '/lawyers', isHash: false },
  { label: 'Resources', href: '/resources', isHash: false },
];

const springConfig = { damping: 20, stiffness: 300 };

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);
  
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < 200) {
      const factor = (1 - distance / 200) * 0.02;
      mouseX.set(distanceX * factor);
      mouseY.set(distanceY * factor);
    }
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  // Get user initial (first letter of email)
  const getUserInitial = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  // Handle navigation for hash links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isHash: boolean) => {
    if (isHash) {
      e.preventDefault();
      const hashId = href.replace('#', '');
      
      // If we're already on home page, just scroll
      if (location.pathname === '/') {
        const element = document.getElementById(hashId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // Navigate to home page with hash, then scroll after navigation
        navigate('/');
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          const element = document.getElementById(hashId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
      setIsOpen(false);
    }
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 px-4 py-4"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', ...springConfig }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          ref={navRef}
          className="rounded-2xl px-6 py-3 flex items-center justify-between"
          style={{
            x: mouseX,
            y: mouseY,
            background: 'rgba(10, 14, 39, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', ...springConfig }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Scale className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-base font-semibold tracking-tight">
                Legal<span className="text-primary">AI</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              link.isHash ? (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.isHash)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative py-1 cursor-pointer"
                  whileHover={{ y: -1 }}
                  transition={{ type: 'spring', ...springConfig }}
                >
                  {link.label}
                  <motion.span
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ type: 'spring', ...springConfig }}
                  />
                </motion.a>
              ) : (
                <Link key={link.label} to={link.href}>
                  <motion.span
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative py-1 cursor-pointer block"
                    whileHover={{ y: -1 }}
                    transition={{ type: 'spring', ...springConfig }}
                  >
                    {link.label}
                    <motion.span
                      className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary rounded-full origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ type: 'spring', ...springConfig }}
                    />
                  </motion.span>
                </Link>
              )
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              // Logged in - Show user avatar
              <div className="relative">
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition-shadow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {getUserInitial()}
                </motion.button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <>
                      {/* Backdrop */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />
                      
                      {/* Dropdown */}
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: 'spring', ...springConfig }}
                        className="absolute top-full right-0 mt-2 w-56 rounded-xl overflow-hidden z-50"
                        style={{
                          background: 'rgba(10, 14, 39, 0.95)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                        }}
                      >
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-sm font-medium text-foreground truncate">
                            {user.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Free Plan
                          </p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link to="/dashboard" onClick={() => setShowUserMenu(false)}>
                            <motion.button
                              className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors flex items-center gap-3"
                              whileHover={{ x: 4 }}
                            >
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span>Dashboard</span>
                            </motion.button>
                          </Link>

                          <Link to="/settings" onClick={() => setShowUserMenu(false)}>
                            <motion.button
                              className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors flex items-center gap-3"
                              whileHover={{ x: 4 }}
                            >
                              <Settings className="w-4 h-4 text-muted-foreground" />
                              <span>Settings</span>
                            </motion.button>
                          </Link>
                        </div>

                        {/* Sign Out */}
                        <div className="border-t border-white/10 py-2">
                          <motion.button
                            onClick={handleSignOut}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors flex items-center gap-3 text-red-400"
                            whileHover={{ x: 4 }}
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // Not logged in - Show Sign In and Sign Up buttons
              <>
                <Link to="/login">
                  <AnimatedButton variant="ghost" size="sm">
                    Sign In
                  </AnimatedButton>
                </Link>
                <Link to="/register">
                  <AnimatedButton variant="primary" size="sm">
                    Get Started
                  </AnimatedButton>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/5"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </motion.div>

        {/* Mobile Menu */}
        <motion.div
          className="md:hidden mt-2 overflow-hidden"
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ type: 'spring', ...springConfig }}
        >
          <div 
            className="glass-dark rounded-2xl p-4 space-y-2"
            style={{
              background: 'rgba(10, 14, 39, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            {navLinks.map((link, index) => (
              link.isHash ? (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.isHash)}
                  className="block py-3 px-4 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', ...springConfig, delay: index * 0.1 }}
                >
                  {link.label}
                </motion.a>
              ) : (
                <Link key={link.label} to={link.href} onClick={() => setIsOpen(false)}>
                  <motion.div
                    className="block py-3 px-4 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', ...springConfig, delay: index * 0.1 }}
                  >
                    {link.label}
                  </motion.div>
                </Link>
              )
            ))}
            
            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              {user ? (
                <>
                  {/* User Info */}
                  <div className="px-4 py-2 rounded-xl bg-white/5 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                        {getUserInitial()}
                      </div>
                      <div>
                        <p className="text-sm font-medium truncate">{user.email}</p>
                        <p className="text-xs text-muted-foreground">Free Plan</p>
                      </div>
                    </div>
                  </div>

                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    <motion.button
                      className="w-full px-4 py-2 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3 text-sm"
                      whileTap={{ scale: 0.98 }}
                    >
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </motion.button>
                  </Link>

                  <Link to="/settings" onClick={() => setIsOpen(false)}>
                    <motion.button
                      className="w-full px-4 py-2 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3 text-sm"
                      whileTap={{ scale: 0.98 }}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </motion.button>
                  </Link>

                  <motion.button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3 text-sm text-red-400"
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </motion.button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <AnimatedButton variant="ghost" size="sm" className="w-full">
                      Sign In
                    </AnimatedButton>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <AnimatedButton variant="primary" size="sm" className="w-full">
                      Get Started
                    </AnimatedButton>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;