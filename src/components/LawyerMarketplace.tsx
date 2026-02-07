// src/components/LawyerMarketplace.tsx - FIXED WITH AUTH
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Briefcase, 
  MessageSquare, 
  BadgeCheck, 
  Globe,
  Building2,
  Filter,
  ChevronDown,
  Clock,
  User,
  LogIn
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import AnimatedButton from './AnimatedButton';
import TiltCard from './TiltCard';

interface Lawyer {
  name: string;
  barNumber: string;
  yearsOfPractice: number;
  location: string;
  practiceAreas: string[];
  courts: string[];
  languages: string[];
  consultationFee: string;
  availability: string;
  image: string;
  verified: boolean;
}

const lawyers: Lawyer[] = [
  {
    name: 'Adv. Priya Sharma',
    barNumber: 'D/1234/2012',
    yearsOfPractice: 12,
    location: 'Mumbai, Maharashtra',
    practiceAreas: ['Criminal Defense', 'Bail Applications', 'Trial Advocacy'],
    courts: ['Bombay High Court', 'Sessions Court, Mumbai'],
    languages: ['English', 'Hindi', 'Marathi'],
    consultationFee: '₹2,000 - ₹5,000',
    availability: 'Available within 48 hours',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face',
    verified: true,
  },
  {
    name: 'Adv. Rajesh Kumar',
    barNumber: 'DL/5678/2008',
    yearsOfPractice: 16,
    location: 'New Delhi',
    practiceAreas: ['White Collar Crime', 'Economic Offences', 'Corporate Fraud'],
    courts: ['Delhi High Court', 'Patiala House Courts'],
    languages: ['English', 'Hindi', 'Punjabi'],
    consultationFee: '₹3,000 - ₹8,000',
    availability: 'Next available: 3 days',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    verified: true,
  },
  {
    name: 'Adv. Meera Patel',
    barNumber: 'KA/9012/2014',
    yearsOfPractice: 10,
    location: 'Bangalore, Karnataka',
    practiceAreas: ['Cyber Crime', 'IT Act Violations', 'Data Privacy'],
    courts: ['Karnataka High Court', 'City Civil Court, Bangalore'],
    languages: ['English', 'Hindi', 'Kannada'],
    consultationFee: '₹1,500 - ₹4,000',
    availability: 'Available within 24 hours',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face',
    verified: true,
  },
  {
    name: 'Adv. Arjun Reddy',
    barNumber: 'TN/3456/2010',
    yearsOfPractice: 14,
    location: 'Chennai, Tamil Nadu',
    practiceAreas: ['Criminal Appeals', 'POCSO Cases', 'Witness Protection'],
    courts: ['Madras High Court', 'District Courts, Chennai'],
    languages: ['English', 'Hindi', 'Tamil'],
    consultationFee: '₹2,500 - ₹6,000',
    availability: 'Next available: 2 days',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    verified: true,
  },
];

const specializations = [
  'All Specializations',
  'Criminal Defense',
  'Bail Applications',
  'Cyber Crime',
  'White Collar Crime',
  'POCSO Cases',
  'Trial Advocacy',
];

const locations = [
  'All Locations',
  'Mumbai',
  'New Delhi',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Hyderabad',
];

const experienceRanges = [
  'Any Experience',
  '5+ years',
  '10+ years',
  '15+ years',
];

const springConfig = { damping: 20, stiffness: 300 };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', ...springConfig },
  },
};

// Verification Badge Component
const VerificationBadge = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <motion.div
        className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.05 }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <BadgeCheck className="w-4 h-4 text-blue-400" />
        </motion.div>
        <span className="text-xs text-blue-400 font-medium">Verified</span>
      </motion.div>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute top-full mt-2 left-0 z-20 w-48 p-2 rounded-lg glass text-xs text-muted-foreground"
          >
            Bar Council registration verified
            <div className="absolute -top-1 left-4 w-2 h-2 glass rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Filter Dropdown Component
const FilterDropdown = ({ 
  label, 
  options, 
  value, 
  onChange 
}: { 
  label: string; 
  options: string[]; 
  value: string; 
  onChange: (val: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-sm hover:bg-white/5 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-muted-foreground">{label}:</span>
        <span className="text-foreground">{value}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full mt-2 left-0 z-20 w-48 rounded-xl glass-strong overflow-hidden"
            >
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${
                    value === option ? 'text-primary bg-primary/5' : 'text-foreground'
                  }`}
                >
                  {option}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Lawyer Card Component - WITH AUTH CHECK
const LawyerCard = ({ lawyer, index }: { lawyer: Lawyer; index: number }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRequestClick = () => {
    if (!user) {
      toast.error('Please sign in to request consultation');
      navigate('/login');
    } else {
      // Navigate to lawyers page for full consultation request
      navigate('/lawyers');
    }
  };

  return (
    <TiltCard className="group" maxTilt={8} glare>
      <motion.div
        variants={cardVariants}
        className="relative"
      >
        {/* Subtle gradient border on hover */}
        <motion.div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100"
          style={{
            background: 'linear-gradient(135deg, hsl(187 100% 50% / 0.3), hsl(266 93% 58% / 0.3))',
          }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative glass rounded-2xl p-6 h-full bg-card">
          {/* Header: Photo + Basic Info */}
          <div className="flex gap-4 mb-5">
            {/* Profile Photo */}
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', ...springConfig }}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-white/10 ring-offset-2 ring-offset-card">
                <img
                  src={lawyer.image}
                  alt={lawyer.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Basic Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-bold text-lg truncate">{lawyer.name}</h3>
                {lawyer.verified && <VerificationBadge />}
              </div>
              
              <p className="text-xs text-muted-foreground font-mono mb-2">
                Bar No: {lawyer.barNumber}
              </p>
              
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{lawyer.yearsOfPractice}+ years</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{lawyer.location.split(',')[0]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Practice Areas */}
          <div className="mb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Practice Areas</p>
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
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Courts of Practice</p>
            <div className="space-y-1">
              {lawyer.courts.map((court) => (
                <div key={court} className="flex items-center gap-2 text-sm text-foreground/80">
                  <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{court}</span>
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

          {/* Consultation Fee & Availability */}
          <div className="flex items-center justify-between mb-5 p-3 rounded-lg bg-white/5 border border-white/5">
            <div>
              <p className="text-xs text-muted-foreground">Consultation Fee</p>
              <p className="text-sm font-medium text-foreground">{lawyer.consultationFee}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{lawyer.availability}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons - WITH AUTH CHECK */}
          <div className="flex gap-2">
            {user ? (
              // Logged in - Show Request Consultation
              <motion.button
                onClick={handleRequestClick}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageSquare className="w-4 h-4" />
                Request Consultation
              </motion.button>
            ) : (
              // Not logged in - Show Sign In button
              <motion.button
                onClick={handleRequestClick}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogIn className="w-4 h-4" />
                Sign in to Request
              </motion.button>
            )}
            
            <motion.button
              className="px-4 py-2.5 rounded-xl text-sm font-medium glass hover:bg-white/5 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/lawyers')}
            >
              <User className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </TiltCard>
  );
};

const LawyerMarketplace = () => {
  const [specialization, setSpecialization] = useState('All Specializations');
  const [location, setLocation] = useState('All Locations');
  const [experience, setExperience] = useState('Any Experience');

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', ...springConfig }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Legal Assistance</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with verified advocates specializing in relevant practice areas
          </p>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10 text-center"
        >
          <p className="text-sm text-muted-foreground">
            These advocates are independently practicing professionals. LegalAI does not endorse specific legal outcomes. 
            Please verify credentials independently before engagement.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-3 mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground mr-2">
            <Filter className="w-4 h-4" />
            <span>Filter by:</span>
          </div>
          <FilterDropdown
            label="Specialization"
            options={specializations}
            value={specialization}
            onChange={setSpecialization}
          />
          <FilterDropdown
            label="Location"
            options={locations}
            value={location}
            onChange={setLocation}
          />
          <FilterDropdown
            label="Experience"
            options={experienceRanges}
            value={experience}
            onChange={setExperience}
          />
        </motion.div>

        {/* Lawyer Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {lawyers.map((lawyer, index) => (
            <LawyerCard key={lawyer.barNumber} lawyer={lawyer} index={index} />
          ))}
        </motion.div>

        {/* View All */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', ...springConfig, delay: 0.5 }}
        >
          <Link to="/lawyers">
            <AnimatedButton variant="secondary" size="lg">
              Browse More Advocates
            </AnimatedButton>
          </Link>
          <p className="mt-3 text-xs text-muted-foreground">
            All listed advocates have verified Bar Council registrations
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LawyerMarketplace;
