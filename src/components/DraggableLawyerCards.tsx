import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Star, MapPin, Briefcase, Scale, Clock, Trophy, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import AnimatedButton from './AnimatedButton';
import TiltCard from './TiltCard';

interface Lawyer {
  id: number;
  name: string;
  specialty: string;
  location: string;
  experience: number;
  rating: number;
  cases: number;
  successRate: number;
  image: string;
  tags: string[];
}

interface DraggableLawyerCardsProps {
  lawyers: Lawyer[];
}

const DraggableLawyerCards = ({ lawyers: initialLawyers }: DraggableLawyerCardsProps) => {
  const [lawyers, setLawyers] = useState(initialLawyers);
  const [draggedId, setDraggedId] = useState<number | null>(null);

  return (
    <Reorder.Group
      axis="y"
      values={lawyers}
      onReorder={setLawyers}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AnimatePresence>
        {lawyers.map((lawyer) => (
          <Reorder.Item
            key={lawyer.id}
            value={lawyer}
            className="cursor-grab active:cursor-grabbing"
            onDragStart={() => setDraggedId(lawyer.id)}
            onDragEnd={() => setDraggedId(null)}
            data-draggable
          >
            <TiltCard
              className={`relative transition-all duration-300 ${
                draggedId === lawyer.id ? 'opacity-50 scale-95' : ''
              }`}
            >
              <motion.div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--card) / 0.8) 100%)',
                  border: '1px solid hsl(var(--border) / 0.5)',
                }}
                whileHover={{
                  boxShadow: '0 20px 40px -20px hsl(var(--primary) / 0.3)',
                }}
              >
                {/* Ghost placeholder when dragging */}
                {draggedId !== null && draggedId !== lawyer.id && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div
                      className="relative"
                      style={{ transform: 'translateZ(30px)' }}
                    >
                      <img
                        src={lawyer.image}
                        alt={lawyer.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-background" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg transition-transform duration-200 hover:-translate-y-0.5">
                        {lawyer.name}
                      </h3>
                      <p className="text-primary text-sm flex items-center gap-1">
                        <Scale className="w-3 h-3" />
                        {lawyer.specialty}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(lawyer.rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">
                          {lawyer.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 rounded-lg bg-muted/30">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                      </div>
                      <p className="text-xs text-foreground mt-1">{lawyer.location}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/30">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                      </div>
                      <p className="text-xs text-foreground mt-1">{lawyer.experience}+ yrs</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/30">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <Trophy className="w-3 h-3" />
                      </div>
                      <p className="text-xs text-foreground mt-1">{lawyer.successRate}%</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {lawyer.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action */}
                  <AnimatedButton
                    variant="primary"
                    size="sm"
                    className="w-full"
                    icon={<MessageSquare className="w-4 h-4" />}
                  >
                    Contact Lawyer
                  </AnimatedButton>
                </div>
              </motion.div>
            </TiltCard>
          </Reorder.Item>
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
};

export default DraggableLawyerCards;
