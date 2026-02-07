// src/pages/Resources.tsx - UPDATED WITH PROPER LINKS
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Scale,
  BookOpen,
  FileText,
  Gavel,
  Search,
  ExternalLink,
  Filter,
  BookMarked,
  Shield,
  Users,
  AlertCircle,
  Info,
  ArrowLeft,
  Eye,
  CheckCircle,
  Newspaper,
  Building2,
  FileQuestion
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import AnimatedButton from '@/components/AnimatedButton';
import { toast } from 'sonner';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'ipc' | 'crpc' | 'guide' | 'article' | 'official';
  url?: string;
  isExternal?: boolean;
  icon: any;
  color: string;
  action: 'external' | 'view';
}

const resources: Resource[] = [
  // Official Government Resources
  {
    id: '1',
    title: 'India Code - Official Government Portal',
    description: 'IPC, CrPC, Constitution & all Indian laws - Official source',
    category: 'official',
    url: 'https://www.indiacode.nic.in',
    isExternal: true,
    icon: Building2,
    color: 'from-blue-600 to-blue-400',
    action: 'external'
  },
  {
    id: '2',
    title: 'eCourts Services',
    description: 'Check case status, court orders, and judiciary resources nationwide',
    category: 'official',
    url: 'https://ecourts.gov.in/ecourts_home/',
    isExternal: true,
    icon: Gavel,
    color: 'from-amber-600 to-orange-500',
    action: 'external'
  },
  {
    id: '3',
    title: 'NALSA - Free Legal Aid',
    description: 'National Legal Services Authority for free legal aid and helplines',
    category: 'official',
    url: 'https://nalsa.gov.in',
    isExternal: true,
    icon: Users,
    color: 'from-teal-600 to-cyan-500',
    action: 'external'
  },
  
  // IPC & Legal Databases
  {
    id: '4',
    title: 'Indian Kanoon - Case Laws',
    description: 'Court judgments, case references, and IPC interpretation',
    category: 'ipc',
    url: 'https://indiankanoon.org',
    isExternal: true,
    icon: BookOpen,
    color: 'from-purple-600 to-pink-500',
    action: 'external'
  },
  {
    id: '5',
    title: 'Legal Services India',
    description: 'IPC explanations, articles on laws, and research papers',
    category: 'ipc',
    url: 'https://www.legalserviceindia.com',
    isExternal: true,
    icon: BookOpen,
    color: 'from-indigo-600 to-blue-500',
    action: 'external'
  },
  
  // News & Updates
  {
    id: '6',
    title: 'LiveLaw',
    description: 'Legal news, case laws, SC & HC judgments, articles',
    category: 'article',
    url: 'https://www.livelaw.in',
    isExternal: true,
    icon: Newspaper,
    color: 'from-red-600 to-rose-500',
    action: 'external'
  },
  {
    id: '7',
    title: 'Legal Bites',
    description: 'Student-friendly legal articles, IPC summaries, case laws',
    category: 'article',
    url: 'https://www.legalbites.in',
    isExternal: true,
    icon: Newspaper,
    color: 'from-orange-600 to-amber-500',
    action: 'external'
  },
  
  // Guides & Procedures
  {
    id: '8',
    title: 'Nyaaya - Legal Rights Guide',
    description: 'Simple language legal rights, FIR process, citizen rights',
    category: 'guide',
    url: 'https://nyaaya.org',
    isExternal: true,
    icon: FileText,
    color: 'from-green-600 to-emerald-500',
    action: 'external'
  },
  {
    id: '9',
    title: 'VakilSearch Legal Guides',
    description: 'Legal procedures, complaint formats, civil & criminal guides',
    category: 'guide',
    url: 'https://vakilsearch.com',
    isExternal: true,
    icon: FileText,
    color: 'from-cyan-600 to-blue-500',
    action: 'external'
  },
  {
    id: '10',
    title: 'LawRato Guides',
    description: 'Legal guides, FIR formats, common legal questions',
    category: 'guide',
    url: 'https://lawrato.com',
    isExternal: true,
    icon: FileQuestion,
    color: 'from-violet-600 to-purple-500',
    action: 'external'
  },
  
  // CrPC Resources
  {
    id: '11',
    title: 'Code of Criminal Procedure (CrPC)',
    description: 'Complete procedural law for criminal cases - India Code',
    category: 'crpc',
    url: 'https://www.indiacode.nic.in/handle/123456789/1362?view_type=browse&sam_handle=123456789/1362',
    isExternal: true,
    icon: Gavel,
    color: 'from-pink-600 to-rose-500',
    action: 'external'
  },
  
  // Internal Guides (View type)
  {
    id: '12',
    title: 'How to File an FIR',
    description: 'Step-by-step guide on filing First Information Report',
    category: 'guide',
    icon: FileText,
    color: 'from-green-500 to-emerald-500',
    action: 'view'
  },
  {
    id: '13',
    title: 'Understanding Bail Procedures',
    description: 'Complete guide to bail types and application process',
    category: 'guide',
    icon: Scale,
    color: 'from-orange-500 to-red-500',
    action: 'view'
  },
  {
    id: '14',
    title: 'Your Rights When Arrested',
    description: 'Know your fundamental rights during arrest',
    category: 'article',
    icon: Shield,
    color: 'from-indigo-500 to-blue-500',
    action: 'view'
  },
  {
    id: '15',
    title: 'Common Criminal Offenses Explained',
    description: 'Understanding theft, assault, fraud under IPC',
    category: 'article',
    icon: AlertCircle,
    color: 'from-red-500 to-rose-500',
    action: 'view'
  }
];

const categories = [
  { value: 'all', label: 'All Resources', icon: BookMarked },
  { value: 'official', label: 'Official Sources', icon: Building2 },
  { value: 'ipc', label: 'IPC & Case Laws', icon: BookOpen },
  { value: 'crpc', label: 'CrPC Procedures', icon: Gavel },
  { value: 'guide', label: 'Guides', icon: FileText },
  { value: 'article', label: 'Articles & News', icon: Newspaper }
];

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredResources, setFilteredResources] = useState(resources);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const resourceContent: Record<string, { sections: Array<{ title: string; content: string }> }> = {
    '12': {
      sections: [
        {
          title: 'What is an FIR?',
          content: 'First Information Report (FIR) is a written document prepared by police when they receive information about a cognizable offense under Section 154 of CrPC.'
        },
        {
          title: 'Who Can File an FIR?',
          content: 'Any person who has knowledge of a cognizable offense can file an FIR. There is no restriction on who can file it - victim, witness, or any informed person.'
        },
        {
          title: 'Steps to File FIR',
          content: '1. Visit the nearest police station in whose jurisdiction the offense occurred\n2. Give oral or written complaint to the officer in charge\n3. Police must register FIR for cognizable offenses\n4. Get a signed copy of the FIR free of charge\n5. Note down the FIR number for future reference\n6. If police refuse, you can approach Superintendent of Police or Magistrate'
        },
        {
          title: 'Important Rights',
          content: '• Police MUST register FIR for cognizable offenses (Section 154 CrPC)\n• You have the right to get a free copy of the FIR\n• FIR can be filed at any police station (Zero FIR) and will be transferred\n• Refusal to register FIR is a punishable offense\n• You can send FIR by post or email if you cannot visit in person'
        }
      ]
    },
    '13': {
      sections: [
        {
          title: 'Types of Bail',
          content: '1. Regular Bail (Section 437/439 CrPC): Applied after arrest\n2. Anticipatory Bail (Section 438 CrPC): Applied before arrest to avoid detention\n3. Interim Bail: Temporary bail granted until final decision\n4. Default Bail (Section 167 CrPC): Granted if chargesheet not filed within 60/90 days'
        },
        {
          title: 'Who Can Grant Bail?',
          content: '• Police: For non-bailable offenses punishable up to 7 years\n• Magistrate: For most cases\n• Sessions Court: For serious offenses\n• High Court: For all cases including anticipatory bail\n• Supreme Court: Appeals and special cases'
        },
        {
          title: 'Bail Application Process',
          content: '1. File bail application in appropriate court\n2. Mention case details, grounds for bail\n3. Court may ask for surety or bond\n4. Conditions may be imposed (reporting to police, travel restrictions)\n5. Violation of bail conditions can lead to cancellation'
        },
        {
          title: 'Factors Courts Consider',
          content: '• Nature and gravity of accusation\n• Severity of punishment\n• Character and behavior of accused\n• Likelihood of fleeing justice\n• Risk of tampering with evidence\n• Repeating the offense\n• Health and age of accused'
        }
      ]
    },
    '14': {
      sections: [
        {
          title: 'Right to Know Grounds of Arrest',
          content: 'Under Article 22(1) of the Constitution, you must be informed of the grounds of your arrest at the time of arrest. Police must tell you why you are being arrested.'
        },
        {
          title: 'Right to Legal Counsel',
          content: 'Article 22(1) guarantees the right to consult and be defended by a lawyer of your choice. If you cannot afford a lawyer, the State must provide free legal aid under Article 39A.'
        },
        {
          title: 'Right to Be Produced Before Magistrate',
          content: 'You must be produced before a Magistrate within 24 hours of arrest (excluding travel time). Detention beyond this without Magistrate\'s order is illegal.'
        },
        {
          title: 'Right Against Self-Incrimination',
          content: 'Article 20(3) protects you from being compelled to be a witness against yourself. You have the right to remain silent during interrogation.'
        },
        {
          title: 'Right to Medical Examination',
          content: 'You have the right to be medically examined at the time of arrest and detention. Request this especially if subjected to any force or violence.'
        },
        {
          title: 'Right to Inform Someone',
          content: 'Section 50A CrPC (2009 amendment) gives you the right to inform a friend, relative, or person of your choice about your arrest and place of detention.'
        },
        {
          title: 'Protection Against Torture',
          content: 'Article 21 prohibits torture and custodial violence. Any confession made under torture is inadmissible. You can file complaints against police torture.'
        },
        {
          title: 'Special Rights for Women',
          content: '• Women cannot be arrested after sunset and before sunrise (Section 46 CrPC)\n• Arrest must be made by a female police officer\n• Medical examination must be conducted by a female doctor'
        }
      ]
    },
    '15': {
      sections: [
        {
          title: 'Theft (Section 378 IPC)',
          content: 'Definition: Dishonestly taking movable property without consent\nPunishment: Up to 3 years imprisonment or fine or both\nExample: Taking someone\'s mobile phone or wallet without permission'
        },
        {
          title: 'Robbery (Section 390 IPC)',
          content: 'Definition: Theft with force or threat of force\nPunishment: Up to 10 years rigorous imprisonment and fine\nExample: Snatching a purse by pushing someone or threatening with weapon'
        },
        {
          title: 'Criminal Breach of Trust (Section 405-406)',
          content: 'Definition: Dishonestly misappropriating property entrusted to you\nPunishment: Up to 3-7 years and fine\nExample: Employee using company funds for personal use'
        },
        {
          title: 'Cheating (Section 420 IPC)',
          content: 'Definition: Fraudulently inducing someone to deliver property\nPunishment: Up to 7 years imprisonment and fine\nExample: Online fraud, fake investment schemes, impersonation'
        },
        {
          title: 'Assault (Section 351-358 IPC)',
          content: 'Simple Assault (351): Making gestures to cause fear of harm\nPunishment: Up to 2 years or fine\n\nGrievous Hurt (325): Causing serious injury\nPunishment: Up to 7 years and fine'
        },
        {
          title: 'Defamation (Section 499-500 IPC)',
          content: 'Definition: Making false statements that harm someone\'s reputation\nPunishment: Up to 2 years imprisonment or fine or both\nNote: Can be civil or criminal case'
        },
        {
          title: 'Criminal Intimidation (Section 503-506)',
          content: 'Definition: Threatening someone to cause alarm or make them do something\nPunishment: Up to 2-7 years depending on threat severity\nExample: Threatening to harm, defame, or damage property'
        },
        {
          title: 'House Trespass (Section 442-446)',
          content: 'Definition: Entering someone\'s property with intent to commit offense\nPunishment: Up to 1-10 years depending on circumstances\nNote: Aggravated if done at night or with weapon'
        }
      ]
    }
  };

  const handleFilter = (category: string) => {
    setSelectedCategory(category);
    let filtered = resources;

    if (category !== 'all') {
      filtered = resources.filter(r => r.category === category);
    }

    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredResources(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    let filtered = resources;

    if (selectedCategory !== 'all') {
      filtered = resources.filter(r => r.category === selectedCategory);
    }

    if (query) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredResources(filtered);
  };

  const handleResourceClick = (resource: Resource) => {
    if (resource.action === 'external' && resource.url) {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    } else if (resource.action === 'view') {
      const content = resourceContent[resource.id];
      if (content) {
        setSelectedResource(resource);
      } else {
        toast.info('Content coming soon!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Navbar />

      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/">
            <motion.button
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
              whileHover={{ x: -4 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </motion.button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Legal <span className="gradient-text">Resources</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive guides and official references for Indian criminal law
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl glass border border-white/10 focus:border-primary/50 focus:outline-none transition-all text-lg"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                onClick={() => handleFilter(cat.value)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-primary text-primary-foreground'
                    : 'glass hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <cat.icon className="w-4 h-4" />
                <span className="font-medium">{cat.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredResources.length === 0 ? (
            <div className="text-center py-20">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">No resources found</h3>
              <p className="text-muted-foreground">Try adjusting your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => handleResourceClick(resource)}
                >
                  <div className="glass rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all h-full flex flex-col">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${resource.color} flex items-center justify-center mb-4`}>
                      <resource.icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                      {resource.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                      {resource.action === 'external' ? (
                        <>
                          <span>Open Resource</span>
                          <ExternalLink className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <span>View Details</span>
                          <Eye className="w-4 h-4" />
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Top <span className="gradient-text">Official Resources</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Supreme Court of India',
                description: 'Official website with case status and judgments',
                url: 'https://main.sci.gov.in/',
                icon: Scale
              },
              {
                title: 'India Code',
                description: 'Official government portal for all Indian laws',
                url: 'https://www.indiacode.nic.in',
                icon: BookOpen
              },
              {
                title: 'NALSA',
                description: 'Free legal aid services and helplines',
                url: 'https://nalsa.gov.in/',
                icon: Users
              }
            ].map((link, index) => (
              <motion.a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <link.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                  {link.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {link.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <span>Visit Website</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-12 text-center border border-white/10">
            <h2 className="text-3xl font-bold mb-4">
              Need Personalized Guidance?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get AI-powered analysis of your case
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/#analyzer">
                <AnimatedButton variant="primary" size="lg">
                  Analyze Your Case
                </AnimatedButton>
              </a>
              <Link to="/lawyers">
                <AnimatedButton variant="secondary" size="lg">
                  Connect with Lawyers
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <AnimatePresence>
        {selectedResource && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedResource(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl bg-background rounded-2xl border border-white/10 my-8"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedResource.color} flex items-center justify-center flex-shrink-0`}>
                    <selectedResource.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{selectedResource.title}</h2>
                    <p className="text-muted-foreground">{selectedResource.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedResource(null)}
                    className="text-muted-foreground hover:text-foreground text-2xl leading-none"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {resourceContent[selectedResource.id]?.sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass rounded-xl p-6 border border-white/10"
                  >
                    <h3 className="text-xl font-bold mb-3 text-primary flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      {section.title}
                    </h3>
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {section.content}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedResource(null)}
                  className="px-4 py-2 rounded-xl glass hover:bg-white/5"
                >
                  Close
                </button>
                <a href="/#analyzer">
                  <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                    Analyze Your Case
                  </button>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Resources;