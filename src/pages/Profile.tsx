// src/pages/Profile.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar,
  Shield,
  Scale,
  LogOut,
  Menu as MenuIcon,
  X,
  Edit2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import AnimatedButton from '@/components/AnimatedButton';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const getUserInitial = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Scale className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold gradient-text">LegalAI</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link to="/analyze" className="text-muted-foreground hover:text-foreground transition-colors">
                Analyze
              </Link>
              <Link to="/lawyers" className="text-muted-foreground hover:text-foreground transition-colors">
                Lawyers
              </Link>
            </nav>

            {/* User Menu */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/profile">
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-white/5"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user?.email?.split('@')[0]}</span>
                </motion.button>
              </Link>
              
              <motion.button
                onClick={handleSignOut}
                className="p-2 rounded-xl glass hover:bg-white/5 text-muted-foreground hover:text-foreground"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg glass"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Back Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <h1 className="text-3xl font-bold mb-8">
            <span className="gradient-text">Profile</span>
          </h1>

          {/* Profile Card */}
          <div className="glass rounded-2xl p-8 mb-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-white">
                {getUserInitial()}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{user?.email?.split('@')[0]}</h2>
                <p className="text-muted-foreground">Free Plan</p>
              </div>
              <AnimatedButton variant="secondary" size="sm" icon={<Edit2 className="w-4 h-4" />}>
                Edit
              </AnimatedButton>
            </div>

            {/* Info Grid */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <div className="glass rounded-xl p-4 border border-white/10">
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>

                {/* Member Since */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member Since
                  </label>
                  <div className="glass rounded-xl p-4 border border-white/10">
                    <p className="font-medium">
                      {user?.metadata?.creationTime 
                        ? new Date(user.metadata.creationTime).toLocaleDateString()
                        : 'Unknown'}
                    </p>
                  </div>
                </div>

                {/* User ID */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    User ID
                  </label>
                  <div className="glass rounded-xl p-4 border border-white/10">
                    <p className="font-mono text-sm">{user?.uid}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => toast.info('Feature coming soon')}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between"
              >
                <span>Change Password</span>
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => toast.info('Feature coming soon')}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between"
              >
                <span>Email Preferences</span>
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors flex items-center justify-between text-red-400"
              >
                <span>Sign Out</span>
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;