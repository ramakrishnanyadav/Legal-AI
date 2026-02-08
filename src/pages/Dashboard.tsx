// src/pages/Dashboard.tsx - UPDATED with NotificationCenter & AdvancedSearch
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  BookOpen,
  Plus,
  ArrowRight,
  Scale,
  Shield,
  FileCheck,
  LogOut,
  User,
  Menu,
  X,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedButton from '@/components/AnimatedButton';
import { getUserCases, CaseRecord } from '@/lib/storage';
import { toast } from 'sonner';

// ✅ Import the new components
import NotificationCenter from '@/components/NotificationCenter';
import AdvancedSearch, { SearchFilters } from '@/components/AdvancedSearch';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Existing state
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ✅ NEW: Search & Filter state (replacing old simple search)
  const [filteredCases, setFilteredCases] = useState<CaseRecord[]>([]);

  useEffect(() => {
    loadUserCases();
  }, [user]);

  const loadUserCases = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userCases = await getUserCases(user.uid);
      setCases(userCases);
      setFilteredCases(userCases); // Initialize filtered cases
    } catch (error) {
      console.error('Error loading cases:', error);
      toast.error('Failed to load cases');
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Handle advanced search with all filters
  const handleSearch = (filters: SearchFilters) => {
    let filtered = [...cases];

    // Keyword search
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filtered = filtered.filter(c => 
        c.description.toLowerCase().includes(keyword) ||
        c.caseType.toLowerCase().includes(keyword) ||
        c.analysisResults?.sections.some(s => 
          s.code.toLowerCase().includes(keyword) ||
          s.name.toLowerCase().includes(keyword)
        )
      );
    }

    // Case type filter
    if (filters.caseType !== 'all') {
      filtered = filtered.filter(c => c.caseType === filters.caseType);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(c => c.status === filters.status);
    }

    // Urgency filter
    if (filters.urgency !== 'all') {
      filtered = filtered.filter(c => 
        filters.urgency === 'urgent' ? c.isUrgent : !c.isUrgent
      );
    }

    // Date range filter
    if (filters.dateRange.start) {
      const startDate = new Date(filters.dateRange.start);
      filtered = filtered.filter(c => c.createdAt.toDate() >= startDate);
    }
    if (filters.dateRange.end) {
      const endDate = new Date(filters.dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Include entire end date
      filtered = filtered.filter(c => c.createdAt.toDate() <= endDate);
    }

    // Confidence filter
    if (filters.confidenceMin > 0) {
      filtered = filtered.filter(c => {
        if (!c.analysisResults) return false;
        const confidence = normalizeConfidence(c.analysisResults.overallConfidence);
        return confidence >= filters.confidenceMin;
      });
    }

    // Severity filter
    if (filters.severity !== 'all') {
      filtered = filtered.filter(c => 
        c.analysisResults?.severity === filters.severity
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'date':
          comparison = b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
          break;
        case 'confidence':
          const confA = a.analysisResults?.overallConfidence || 0;
          const confB = b.analysisResults?.overallConfidence || 0;
          comparison = normalizeConfidence(confB) - normalizeConfidence(confA);
          break;
        case 'severity':
          const severityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          const sevA = severityOrder[a.analysisResults?.severity as keyof typeof severityOrder] || 0;
          const sevB = severityOrder[b.analysisResults?.severity as keyof typeof severityOrder] || 0;
          comparison = sevB - sevA;
          break;
      }
      
      return filters.sortOrder === 'asc' ? -comparison : comparison;
    });

    setFilteredCases(filtered);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const quickActions = [
    {
      icon: Plus,
      title: 'New Analysis',
      description: 'Analyze a new case',
      color: 'from-blue-500/20 to-cyan-500/20',
      href: '/analyze',
      primary: true,
    },
    {
      icon: Users,
      title: 'Find Lawyers',
      description: 'Connect with legal experts',
      color: 'from-green-500/20 to-emerald-500/20',
      href: '/lawyers',
    },
    {
      icon: BookOpen,
      title: 'Resources',
      description: 'Legal guides & info',
      color: 'from-orange-500/20 to-amber-500/20',
      href: '/#resources',
    },
  ];

  const stats = [
    { 
      label: 'Total Cases', 
      value: cases.length,
      icon: Scale,
      color: 'text-blue-400',
      bg: 'bg-blue-500/20'
    },
    { 
      label: 'Active', 
      value: cases.filter(c => c.status === 'draft' || c.status === 'submitted').length,
      icon: TrendingUp,
      color: 'text-green-400',
      bg: 'bg-green-500/20'
    },
    { 
      label: 'Documents', 
      value: cases.reduce((sum, c) => sum + c.evidenceFiles.length, 0),
      icon: FileCheck,
      color: 'text-purple-400',
      bg: 'bg-purple-500/20'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'submitted': return <AlertCircle className="w-4 h-4 text-blue-400" />;
      case 'closed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'submitted': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'closed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const normalizeConfidence = (conf: number) => {
    if (conf > 0 && conf <= 1) return Math.round(conf * 100);
    return Math.min(Math.max(Math.round(conf), 0), 100);
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
              <Link to="/dashboard" className="text-foreground font-medium">
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
              {/* ✅ NEW: Notification Center */}
              <NotificationCenter />

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
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 pt-4 border-t border-white/10"
              >
                <nav className="flex flex-col gap-2">
                  <Link to="/analyze" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
                    Analyze
                  </Link>
                  <Link to="/lawyers" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
                    Lawyers
                  </Link>
                  <Link to="/profile" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-left text-red-400"
                  >
                    Sign Out
                  </button>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center"
            >
              <Scale className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Welcome back, <span className="gradient-text">{user?.email?.split('@')[0]}</span>
              </h1>
              <p className="text-muted-foreground">Manage your legal cases and consultations</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="glass rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</span>
                <motion.div 
                  className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center border border-white/10`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </motion.div>
              </div>
              <p className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link key={action.title} to={action.href}>
                <motion.div
                  className={`glass rounded-2xl p-6 border border-white/10 h-full hover:border-primary/50 transition-colors group ${action.primary ? 'border-primary/30' : ''}`}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                  <div className="flex items-center gap-1 text-sm text-primary group-hover:gap-2 transition-all">
                    <span>Get started</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Case History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Case History</h2>
          </div>

          {/* ✅ NEW: Advanced Search Component */}
          {cases.length > 0 && (
            <div className="mb-6">
              <AdvancedSearch 
                onSearch={handleSearch}
                totalResults={filteredCases.length}
              />
            </div>
          )}

          {loading ? (
            <div className="glass rounded-2xl p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Loading cases...</p>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">
                {cases.length === 0 ? 'No cases yet' : 'No cases found'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {cases.length === 0 
                  ? 'Start analyzing your legal situation to create your first case'
                  : 'Try adjusting your search filters'}
              </p>
              {cases.length === 0 && (
                <Link to="/analyze">
                  <AnimatedButton>
                    <Plus className="w-4 h-4" />
                    Analyze New Case
                  </AnimatedButton>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCases.map((caseItem, index) => (
                <motion.div
                  key={caseItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-all group"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start gap-4">
                    {/* Left: Main Info */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start gap-2 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(caseItem.status)} flex items-center gap-1`}>
                              {getStatusIcon(caseItem.status)}
                              {caseItem.status}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                              {caseItem.caseType}
                            </span>
                            {caseItem.isUrgent && (
                              <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Urgent
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {caseItem.description}
                          </p>
                        </div>
                      </div>

                      {/* AI Analysis Summary */}
                      {caseItem.analysisResults && (
                        <>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div className="text-center p-2 rounded-lg bg-white/5">
                              <p className="text-xs text-muted-foreground">Confidence</p>
                              <p className="text-sm font-semibold text-primary">
                                {normalizeConfidence(caseItem.analysisResults.overallConfidence)}%
                              </p>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-white/5">
                              <p className="text-xs text-muted-foreground">Primary Section</p>
                              <p className="text-sm font-semibold">
                                {caseItem.analysisResults.sections.find(s => s.isPrimary)?.code || 'N/A'}
                              </p>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-white/5">
                              <p className="text-xs text-muted-foreground">Severity</p>
                              <p className="text-sm font-semibold text-yellow-400">
                                {caseItem.analysisResults.severity}
                              </p>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-white/5">
                              <p className="text-xs text-muted-foreground">Bail</p>
                              <p className="text-sm font-semibold text-green-400">
                                {caseItem.analysisResults.bail}
                              </p>
                            </div>
                          </div>
                          
                          {/* Premium Features Preview */}
                          {caseItem.analysisResults.actionPlan && (
                            <div className="grid grid-cols-3 gap-2 mb-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-purple/10 border border-primary/20">
                              {caseItem.analysisResults.actionPlan.victoryPrediction && (
                                <div className="text-center">
                                  <p className="text-xs text-muted-foreground mb-1">Victory</p>
                                  <p className="text-lg font-bold text-green-400">
                                    {caseItem.analysisResults.actionPlan.victoryPrediction.victoryChance}%
                                  </p>
                                </div>
                              )}
                              {caseItem.analysisResults.actionPlan.durationEstimate && (
                                <div className="text-center">
                                  <p className="text-xs text-muted-foreground mb-1">Duration</p>
                                  <p className="text-sm font-bold text-purple-400">
                                    {caseItem.analysisResults.actionPlan.durationEstimate.totalDuration?.average || 'N/A'}
                                  </p>
                                </div>
                              )}
                              {caseItem.analysisResults.actionPlan.detailedCosts && (
                                <div className="text-center">
                                  <p className="text-xs text-muted-foreground mb-1">Est. Cost</p>
                                  <p className="text-sm font-bold text-emerald-400">
                                    {caseItem.analysisResults.actionPlan.detailedCosts.summary?.averageCost || 'N/A'}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(caseItem.createdAt.toDate()).toLocaleDateString()}
                          </span>
                          {caseItem.evidenceFiles.length > 0 && (
                            <span className="flex items-center gap-1">
                              <FileCheck className="w-3 h-3" />
                              {caseItem.evidenceFiles.length} files
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <Link to={`/cases/${caseItem.id}`}>
                      <motion.button
                        className="p-3 rounded-xl glass hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;