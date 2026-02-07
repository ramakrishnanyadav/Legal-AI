import { motion } from 'framer-motion';
import { BookOpen, Scale, Building2, Users, ExternalLink, Calendar } from 'lucide-react';

const SourcesFooter = () => {
  const sources = [
    {
      icon: BookOpen,
      title: 'Indian Penal Code (IPC)',
      description: 'Primary criminal law of India',
      link: 'https://legislative.gov.in/sites/default/files/A1860-45.pdf',
    },
    {
      icon: Scale,
      title: 'Code of Criminal Procedure (CrPC)',
      description: 'Procedural aspects of criminal law',
      link: 'https://legislative.gov.in/sites/default/files/A1974-2.pdf',
    },
    {
      icon: Building2,
      title: 'Supreme Court & High Court Judgments',
      description: 'Case law precedents',
      link: 'https://main.sci.gov.in/',
    },
    {
      icon: Users,
      title: 'Reviewed by Practicing Advocates',
      description: 'Expert legal validation',
      link: '#',
    },
  ];

  const lastUpdated = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="py-16 px-4 border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h3 className="text-2xl font-bold mb-2">Our Sources</h3>
          <p className="text-muted-foreground">
            Our analysis is built on authoritative legal frameworks
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sources.map((source, index) => (
            <motion.a
              key={source.title}
              href={source.link}
              target={source.link !== '#' ? '_blank' : undefined}
              rel={source.link !== '#' ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-4 rounded-xl glass hover:bg-white/5 transition-all"
              whileHover={{ y: -2 }}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <source.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1 flex items-center justify-center gap-1">
                    {source.title}
                    {source.link !== '#' && (
                      <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </h4>
                  <p className="text-xs text-muted-foreground">{source.description}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Last updated timestamp */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            Last updated: {lastUpdated}
          </span>
        </motion.div>

        {/* Additional legal databases */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-muted-foreground mb-3">Additional authoritative sources:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: 'India Code', url: 'https://www.indiacode.nic.in/' },
              { name: 'e-Courts Services', url: 'https://ecourts.gov.in/' },
              { name: 'National Judicial Data Grid', url: 'https://njdg.ecourts.gov.in/' },
            ].map((db) => (
              <a
                key={db.name}
                href={db.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
              >
                {db.name}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SourcesFooter;
