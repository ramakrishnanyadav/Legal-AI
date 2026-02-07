// src/components/Footer.tsx - WITH WORKING POLICY MODALS
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Scale, Twitter, Linkedin, Github, Mail, ExternalLink, Phone, AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

type ModalType = 'privacy' | 'terms' | 'cookies' | null;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const featureLinks = [
    { label: 'Situation Assessment', href: '/#analyzer' },
    { label: 'Connect with Advocates', href: '/lawyers' },
    { label: 'Legal Resources', href: '/resources' },
    { label: 'Procedural Timeline', href: '/#timeline' },
  ];

  const officialResources = [
    { label: 'India Code', href: 'https://www.indiacode.nic.in' },
    { label: 'eCourts Services', href: 'https://ecourts.gov.in/ecourts_home/' },
    { label: 'NALSA', href: 'https://nalsa.gov.in/' },
    { label: 'Supreme Court', href: 'https://main.sci.gov.in/' },
  ];

  const legalGuides = [
    { label: 'Indian Kanoon', href: 'https://indiankanoon.org' },
    { label: 'LiveLaw', href: 'https://www.livelaw.in' },
    { label: 'Nyaaya', href: 'https://nyaaya.org' },
    { label: 'Legal Services India', href: 'https://www.legalserviceindia.com' },
  ];

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Mail, href: 'mailto:contact@legalai.com', label: 'Email' },
  ];

  const emergencyNumbers = [
    { label: 'Police', number: '100' },
    { label: 'Women Helpline', number: '1091' },
    { label: 'Legal Aid', number: '15100' },
    { label: 'Cyber Crime', number: '1930' },
  ];

  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const id = href.replace('/#', '');
      
      if (window.location.pathname !== '/') {
        window.location.href = href;
      } else {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  const modalContent = {
    privacy: {
      title: 'Privacy Policy',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Last Updated:</strong> {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">1. Information We Collect</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We collect information you provide directly to us, including email addresses, case information, and consultation requests. 
              We also automatically collect certain information about your device when you use our services.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">2. How We Use Your Information</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, to communicate with you, 
              to connect you with legal professionals, and to protect against fraud and abuse.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">3. Information Sharing</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We do not sell your personal information. We may share your information with lawyers you choose to consult with, 
              service providers who assist us, and when required by law.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">4. Data Security</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information. 
              However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">5. Your Rights</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You have the right to access, correct, or delete your personal information. You may also object to 
              or restrict certain processing of your data. Contact us to exercise these rights.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">6. Contact Us</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@legalai.com" className="text-primary hover:underline">
                privacy@legalai.com
              </a>
            </p>
          </section>
        </div>
      )
    },
    terms: {
      title: 'Terms of Service',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Last Updated:</strong> {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">1. Acceptance of Terms</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By accessing and using LegalAI, you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">2. Description of Services</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              LegalAI provides AI-powered legal information based on Indian criminal law (IPC, CrPC). 
              We connect users with legal professionals and provide educational resources. Our services do not constitute legal advice.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">3. Not Legal Advice</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-amber-400">Important:</strong> LegalAI provides general legal information only. 
              This is NOT legal advice. You must consult a qualified advocate or lawyer for legal advice specific to your situation.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">4. User Responsibilities</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You agree to use our services lawfully and to provide accurate information. You are responsible for maintaining 
              the confidentiality of your account credentials and for all activities under your account.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">5. AI-Generated Content</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-generated analysis and predictions are probabilistic estimates based on available data. 
              They should not be relied upon as definitive legal opinions or predictions of legal outcomes.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">6. Limitation of Liability</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              LegalAI and its affiliates shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages resulting from your use or inability to use the service.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">7. Modifications to Terms</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use of the service after changes 
              constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">8. Governing Law</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive 
              jurisdiction of courts in Mumbai, Maharashtra.
            </p>
          </section>
        </div>
      )
    },
    cookies: {
      title: 'Cookie Policy',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Last Updated:</strong> {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">1. What Are Cookies?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cookies are small text files stored on your device when you visit our website. They help us provide you 
              with a better experience by remembering your preferences and understanding how you use our services.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">2. Types of Cookies We Use</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Essential Cookies:</strong> Required for the website to function properly. These cannot be disabled.</p>
              <p><strong className="text-foreground">Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting anonymous information.</p>
              <p><strong className="text-foreground">Functional Cookies:</strong> Enable enhanced functionality and personalization, such as remembering your preferences.</p>
              <p><strong className="text-foreground">Authentication Cookies:</strong> Used to identify you when you sign in and keep you logged in during your session.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">3. Third-Party Cookies</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We may use third-party services (like Google Analytics, Firebase) that also set cookies. 
              These services have their own privacy policies governing their use of cookies.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">4. Managing Cookies</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Most web browsers allow you to control cookies through their settings. However, disabling cookies may 
              limit your ability to use certain features of our website. You can adjust your browser settings to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Block all cookies</li>
              <li>Allow only first-party cookies</li>
              <li>Delete cookies when you close your browser</li>
              <li>Receive notifications when cookies are set</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">5. Cookie Duration</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Session Cookies:</strong> Temporary cookies deleted when you close your browser.</p>
              <p><strong className="text-foreground">Persistent Cookies:</strong> Remain on your device until they expire or you delete them manually.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">6. Updates to This Policy</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We may update this Cookie Policy from time to time. We encourage you to review this policy periodically 
              to stay informed about our use of cookies.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">7. Contact Us</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have questions about our use of cookies, please contact us at{' '}
              <a href="mailto:privacy@legalai.com" className="text-primary hover:underline">
                privacy@legalai.com
              </a>
            </p>
          </section>
        </div>
      )
    }
  };

  return (
    <>
      <footer className="relative mt-32 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background pointer-events-none" />
        
        <div className="relative">
          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Top Section - Links Grid */}
            <div className="pt-16 pb-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
                
                {/* Brand Column - Spans 4 columns */}
                <div className="lg:col-span-4">
                  <Link to="/" className="inline-block mb-6">
                    <motion.div
                      className="flex items-center gap-3"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
                        <Scale className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <span className="text-2xl font-bold block leading-none">
                          Legal<span className="text-primary">AI</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                          Legal Intelligence
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-sm">
                    Empowering citizens with AI-powered legal information and connecting them with qualified advocates across India.
                  </p>
                  
                  {/* Social Links */}
                  <div className="flex items-center gap-2">
                    {socialLinks.map((social) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg glass border border-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all"
                        whileHover={{ y: -3, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={social.label}
                      >
                        <social.icon className="w-4 h-4" />
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Features Column */}
                <div className="lg:col-span-3">
                  <h4 className="text-xs font-bold text-foreground/90 mb-5 uppercase tracking-wider">
                    Platform
                  </h4>
                  <ul className="space-y-3">
                    {featureLinks.map((link) => (
                      <li key={link.label}>
                        {link.href.startsWith('/#') ? (
                          <motion.a
                            href={link.href}
                            onClick={(e) => handleHashClick(e, link.href)}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block"
                            whileHover={{ x: 3 }}
                          >
                            {link.label}
                          </motion.a>
                        ) : (
                          <Link to={link.href}>
                            <motion.span
                              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block"
                              whileHover={{ x: 3 }}
                            >
                              {link.label}
                            </motion.span>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Official Resources Column */}
                <div className="lg:col-span-2">
                  <h4 className="text-xs font-bold text-foreground/90 mb-5 uppercase tracking-wider">
                    Official
                  </h4>
                  <ul className="space-y-3">
                    {officialResources.map((link) => (
                      <li key={link.label}>
                        <motion.a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                          whileHover={{ x: 3 }}
                        >
                          <span>{link.label}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal Guides Column */}
                <div className="lg:col-span-3">
                  <h4 className="text-xs font-bold text-foreground/90 mb-5 uppercase tracking-wider">
                    Resources
                  </h4>
                  <ul className="space-y-3">
                    {legalGuides.map((link) => (
                      <li key={link.label}>
                        <motion.a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                          whileHover={{ x: 3 }}
                        >
                          <span>{link.label}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative h-px mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Emergency Section */}
            <div className="pb-12">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Phone className="w-4 h-4 text-primary" />
                <h4 className="text-xs font-bold text-foreground/90 uppercase tracking-wider">
                  Emergency Helplines
                </h4>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {emergencyNumbers.map((item) => (
                  <motion.div
                    key={item.label}
                    className="text-center p-4 rounded-xl glass border border-white/5 hover:border-primary/20 transition-colors"
                    whileHover={{ y: -2 }}
                  >
                    <p className="text-xs text-muted-foreground mb-2">{item.label}</p>
                    <p className="text-xl font-bold text-primary">{item.number}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Disclaimer - Naturally Integrated */}
            <div className="pb-12">
              <div className="max-w-4xl mx-auto">
                <div className="relative rounded-2xl overflow-hidden">
                  {/* Subtle gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5" />
                  <div className="absolute inset-0 bg-white/[0.02]" />
                  
                  <div className="relative p-6 border border-white/10">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-semibold text-foreground mb-2">
                          Legal Information Notice
                        </h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          LegalAI provides general legal information based on Indian Penal Code (IPC) and Code of Criminal Procedure (CrPC). 
                          This platform offers educational guidance and should not be considered legal advice. Always consult with a qualified 
                          advocate or lawyer for matters requiring legal expertise. AI-generated analysis provides probabilistic assessments 
                          for informational purposes only. For authoritative legal references, visit{' '}
                          <a 
                            href="https://www.indiacode.nic.in" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors font-medium"
                          >
                            India Code
                          </a>
                          {' '}or consult your regional Bar Council.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  © {currentYear} LegalAI. All rights reserved.
                </p>
                
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setActiveModal('privacy')}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </button>
                  <button
                    onClick={() => setActiveModal('terms')}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </button>
                  <button
                    onClick={() => setActiveModal('cookies')}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cookie Policy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Policy Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[85vh] bg-background rounded-2xl border border-white/10 shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-foreground">
                  {modalContent[activeModal].title}
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-10 h-10 rounded-lg glass hover:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {modalContent[activeModal].content}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/10">
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;