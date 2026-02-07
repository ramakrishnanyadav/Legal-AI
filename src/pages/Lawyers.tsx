// src/pages/Lawyers.tsx - UPDATED to load from Firestore
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  MessageSquare,
  BadgeCheck,
  Globe,
  Building2,
  Clock,
  User,
  X,
  Send,
  Scale,
  LogOut,
  Menu as MenuIcon,
  Check,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedButton from '@/components/AnimatedButton';
import TiltCard from '@/components/TiltCard';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp, getDocs, query, where } from 'firebase/firestore';
import { getUserCases, CaseRecord } from '@/lib/storage';

interface Lawyer {
  id?: string;
  name: string;
  barNumber: string;
  yearsOfPractice: number;
  location: string;
  city: string;
  state: string;
  practiceAreas: string[];
  courts: string[];
  languages: string[];
  consultationFee: string;
  feeMin: number;
  feeMax: number;
  availability: string;
  image: string;
  verified: boolean;
  active: boolean;
  email: string;
  phone: string;
  rating?: number;
  totalCases?: number;
  successRate?: number;
  bio?: string;
  education?: string;
  barCouncil?: string;
}

interface ConsultationRequest {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  lawyerName: string;
  lawyerBarNumber: string;
  caseId?: string;
  caseType?: string;
  preferredDate: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Timestamp;
}

const Lawyers = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [userCases, setUserCases] = useState<CaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form state
  const [selectedCase, setSelectedCase] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    loadLawyers();
    if (user) {
      loadUserCases();
    }
  }, [user]);

  // ✅ LOAD LAWYERS FROM FIRESTORE
  const loadLawyers = async () => {
    setLoading(true);
    try {
      // Query only active lawyers
      const q = query(
        collection(db, 'lawyers'),
        where('active', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const lawyersData: Lawyer[] = [];
      querySnapshot.forEach((doc) => {
        lawyersData.push({ id: doc.id, ...doc.data() } as Lawyer);
      });
      setLawyers(lawyersData);
    } catch (error) {
      console.error('Error loading lawyers:', error);
      toast.error('Failed to load lawyers');
    } finally {
      setLoading(false);
    }
  };

  const loadUserCases = async () => {
    if (!user) return;
    try {
      const cases = await getUserCases(user.uid);
      setUserCases(cases);
    } catch (error) {
      console.error('Error loading cases:', error);
    }
  };

  const handleRequestConsultation = (lawyer: Lawyer) => {
    if (!user) {
      toast.error('Please sign in to request consultation');
      navigate('/login');
      return;
    }
    setSelectedLawyer(lawyer);
    setShowModal(true);
    setRequestSent(false);
  };

  const handleSubmitRequest = async () => {
    if (!selectedLawyer || !user) return;

    if (!preferredDate || !message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const selectedCaseData = userCases.find(c => c.id === selectedCase);

      const consultationRequest: any = {
        userId: user.uid,
        userName: user.email?.split('@')[0] || 'User',
        userEmail: user.email || '',
        lawyerName: selectedLawyer.name,
        lawyerBarNumber: selectedLawyer.barNumber,
        caseType: selectedCaseData?.caseType || 'General Consultation',
        preferredDate,
        message,
        status: 'pending',
        createdAt: Timestamp.now(),
      };

      if (selectedCase) {
        consultationRequest.caseId = selectedCase;
      }

      await addDoc(collection(db, 'consultationRequests'), consultationRequest);

      setRequestSent(true);
      toast.success('Consultation request sent successfully!');

      setTimeout(() => {
        setShowModal(false);
        setSelectedCase('');
        setPreferredDate('');
        setMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to send request. Please try again.');
    } finally {
      setLoading(false);
    }
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
              <Link to="/lawyers" className="text-foreground font-medium">
                Lawyers
              </Link>
            </nav>

            {/* User Menu */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <Link to="/profile">
                    <motion.button
                      className="flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-white/5"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">{user.email?.split('@')[0]}</span>
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
                </>
              ) : (
                <>
                  <Link to="/login">
                    <AnimatedButton variant="ghost" size="sm">Sign In</AnimatedButton>
                  </Link>
                  <Link to="/register">
                    <AnimatedButton variant="primary" size="sm">Get Started</AnimatedButton>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg glass"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
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
                  <Link to="/dashboard" className="px-4 py-2 rounded-lg hover:bg-white/5">
                    Dashboard
                  </Link>
                  <Link to="/analyze" className="px-4 py-2 rounded-lg hover:bg-white/5">
                    Analyze
                  </Link>
                  {user && (
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 rounded-lg hover:bg-white/5 text-left text-red-400"
                    >
                      Sign Out
                    </button>
                  )}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Find Legal Experts</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Connect with verified advocates for your case
          </p>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10 text-center"
        >
          <p className="text-sm text-muted-foreground">
            All advocates listed are independently practicing professionals with verified Bar Council registrations.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading lawyers...</p>
            </div>
          </div>
        ) : lawyers.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center border border-white/10">
            <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">No lawyers available</h3>
            <p className="text-muted-foreground">Please check back later</p>
          </div>
        ) : (
          /* Lawyer Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lawyers.map((lawyer, index) => (
              <motion.div
                key={lawyer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TiltCard>
                  <div className="glass rounded-2xl p-6 h-full border border-white/10">
                    {/* Header */}
                    <div className="flex gap-4 mb-4">
                      <img
                        src={lawyer.image}
                        alt={lawyer.name}
                        className="w-20 h-20 rounded-full object-cover ring-2 ring-white/10"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-lg">{lawyer.name}</h3>
                          {lawyer.verified && (
                            <BadgeCheck className="w-5 h-5 text-blue-400 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-mono mb-2">
                          Bar No: {lawyer.barNumber}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5" />
                            {lawyer.yearsOfPractice}+ years
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {lawyer.city}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Practice Areas */}
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                        Practice Areas
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {lawyer.practiceAreas.map((area) => (
                          <span
                            key={area}
                            className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Courts */}
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                        Courts
                      </p>
                      <div className="space-y-1">
                        {lawyer.courts.map((court) => (
                          <div key={court} className="flex items-center gap-2 text-sm">
                            <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-foreground/80">{court}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="w-3.5 h-3.5" />
                        <span>{lawyer.languages.join(', ')}</span>
                      </div>
                    </div>

                    {/* Fee & Availability */}
                    <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-white/5">
                      <div>
                        <p className="text-xs text-muted-foreground">Consultation Fee</p>
                        <p className="text-sm font-medium">{lawyer.consultationFee}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs text-green-400">
                          <Clock className="w-3 h-3" />
                          <span>{lawyer.availability}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <AnimatedButton
                      onClick={() => handleRequestConsultation(lawyer)}
                      variant="primary"
                      className="w-full"
                      icon={<MessageSquare className="w-4 h-4" />}
                    >
                      Request Consultation
                    </AnimatedButton>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Consultation Request Modal */}
      <AnimatePresence>
        {showModal && selectedLawyer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => !requestSent && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass rounded-2xl p-6 border border-white/10"
            >
              {requestSent ? (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
                  >
                    <Check className="w-8 h-8 text-green-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">Request Sent!</h3>
                  <p className="text-muted-foreground mb-4">
                    Your consultation request has been sent to {selectedLawyer.name}.
                    They will contact you soon.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Request Consultation</h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-2 rounded-lg hover:bg-white/5"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/5">
                    <img
                      src={selectedLawyer.image}
                      alt={selectedLawyer.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{selectedLawyer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedLawyer.consultationFee}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {userCases.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Related Case (Optional)
                        </label>
                        <select
                          value={selectedCase}
                          onChange={(e) => setSelectedCase(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary/50 focus:outline-none [&>option]:bg-gray-900 [&>option]:text-white"
                        >
                          <option value="" className="bg-gray-900 text-white">No specific case</option>
                          {userCases.map((c) => (
                            <option key={c.id} value={c.id} className="bg-gray-900 text-white">
                              {c.caseType} - {new Date(c.createdAt.toDate()).toLocaleDateString()}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary/50 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Message *
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Briefly describe your legal matter..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-primary/50 focus:outline-none resize-none"
                        required
                      />
                    </div>

                    <AnimatedButton
                      onClick={handleSubmitRequest}
                      loading={loading}
                      variant="primary"
                      className="w-full"
                      icon={<Send className="w-4 h-4" />}
                    >
                      Send Request
                    </AnimatedButton>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Lawyers;